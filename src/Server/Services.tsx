import server$ from "solid-start/server";
import prisma from "~/prisma";
import {BooksByShelf} from "../types/type";
import { Prisma } from "@prisma/client";
import { isStringALink, uploadBase64ImageToDO } from "~/components/uploadImage";
import { randomUUID } from "crypto";
// index or Home
const booksByShelfServer = server$(async (shelfId?: number) => {
    return prisma.$queryRaw<BooksByShelf[]>`
      SELECT
        shelf,
        JSON_ARRAYAGG(JSON_OBJECT(
          'id', id,
          'cover', cover,
          'title', title,
          'authors', authors,
          'description', description,
          'genre', genre,
          'quantity', quantity,
          'createdAt', createdAt,
          'adminId', adminId
        )) as books
      FROM
        Book
      GROUP BY
        shelf
      ORDER BY
        shelf;
    `;
  });
  // index or home

  

  const readServerBooks = server$(
    ({ where }: { where?: Prisma.BookWhereInput }) => {
      return prisma.book.findMany({
        where,
        select: {
          id: true,
          cover: true,
          title: true,
          description: true,
          authors: true,
          genre: true,
          quantity: true,
          createdAt: true,
          shelf: true,
          addedBy: {
            select: {
              username: true,
            },
          },
        },
      });
    }
  );
  // Lendings
  const readLendingsServer = server$((search?: string) => {
    return prisma.lending.findMany({
      where: {
        returned: false,
      },
      select: {
        bookId: true,
        name: true,
        email: true,
        due: true,
      },
      orderBy: {
        due: "asc",
      },
    });
  });
// Add 
  const addBookServer = server$(
    async (
      bookPayload: Prisma.BookUncheckedCreateInput,
      coverFileName: string,
      contentType: string
    ) => {
      let cover;
  
      if (isStringALink(bookPayload.cover)) {
        cover = bookPayload.cover;
      } else {
        cover = await uploadBase64ImageToDO(
          randomUUID() + coverFileName,
          bookPayload.cover,
          contentType
        );
      }
  
      return prisma.book.create({ data: { ...bookPayload, cover } });
    }
  );
  //Edit
  const saveBookServer = server$(
    async (
      id: number,
      bookPayload: Prisma.BookUncheckedUpdateInput,
      coverFileName: string,
      contentType: string
    ) => {
      let cover;
  
      if (isStringALink(bookPayload.cover as any)) {
        cover = bookPayload.cover;
      } else {
        cover = await uploadBase64ImageToDO(
          randomUUID() + coverFileName,
          bookPayload.cover as any,
          contentType
        );
      }
  
      return prisma.book.update({
        where: { id },
        data: { ...bookPayload, cover },
      });
    }
  );

//Edit
  const readBookServer = server$((id: number) => {
    return prisma.book.findUnique({
      where: { id },
      select: {
        id: true,
        cover: true,
        title: true,
        description: true,
        authors: true,
        genre: true,
        quantity: true,
        createdAt: true,
        shelf: true,
        addedBy: {
          select: {
            username: true,
          },
        },
        Lendings: {
          select: {
            returned: true,
          },
        },
      },
    });
  });

//detail
  const readDetailServer = server$((id: number) => {
    return prisma.book.findUnique({
      where: { id },
      select: {
        id: true,
        cover: true,
        title: true,
        description: true,
        authors: true,
        genre: true,
        quantity: true,
        createdAt: true,
        shelf: true,
        addedBy: {
          select: {
            username: true,
          },
        },
        Lendings: {
          select: {
            id: true,
            name: true,
            email: true,
            due: true,
            on: true,
            by: {
              select: {
                username: true,
              },
            },
            returned: true,
          },
        },
      },
    });
  });
  
//detail
  const deleteBookServer = server$(async (id: number) => {
    await prisma.lending.deleteMany({ where: { bookId: id } });
    return prisma.book.delete({ where: { id } });
  });
//detail
  const handleBookLendingServer = server$(
    async (data: Prisma.LendingUncheckedCreateInput) => {
      const book: any = await prisma.book.findUnique({
        where: { id: data.bookId },
        select: {
          id: true,
          quantity: true,
        },
      });
  
      await prisma.book.update({
        where: { id: book.id },
        data: { quantity: book.quantity - 1 },
      });
  
      return prisma.lending.create({ data });
    }
  );
  //detail

  const handleReturnBookServer = server$(async (id: number) => {
    const lending: any = await prisma.lending.findUnique({
      where: { id },
      select: { book: { select: { id: true, quantity: true } } },
    });
  
    await prisma.book.update({
      where: { id: lending.book.id },
      data: { quantity: lending.book.quantity + 1 },
    });
  
    return prisma.lending.update({ where: { id }, data: { returned: true } });
  });



  
  export {handleReturnBookServer,readServerBooks,booksByShelfServer,readLendingsServer,addBookServer,readBookServer,saveBookServer,readDetailServer,deleteBookServer,handleBookLendingServer}