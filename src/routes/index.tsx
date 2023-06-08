import { For, createEffect, createSignal, onMount } from "solid-js";
import { A, useNavigate } from "solid-start";
import {User,Users} from "~/components/User";
import { UserType ,BooksWithAuthor,BookSummary,BooksByShelf} from "../types/type";
import {readServerBooks,booksByShelfServer } from "../Server/Services";



const BookView = ({ book }: { book: BooksWithAuthor }) => {
  return (
    <div class="p-4">
      <a href={`/book/Detail/` + book.id}>
        <img
          src={book.cover}
          class="h-64 w-48 object-cover border-2 border-gray-800 rounded-md shadow-lg object-center hover:opacity-80"
        />
      </a>
      <div class="mt-4 flex flex-col justify-between w-full sm:w-48">
        <h3 class="font-bold">
          {book.title.length > 20
            ? book.title.slice(0, 20) + "..."
            : book.title}
        </h3>
        <p class="text-sm text-gray-500 mt-2">
          {book.description.length > 70
            ? book.description.slice(0, 70) + "..."
            : book.description}
        </p>
        <p class="text-xs mt-2 text-gray-600">Authors: {book.authors}</p>
        <p class="text-xs text-gray-600">Genre: {book.genre}</p>
        <p class="text-xs text-gray-600">Shelf: {book.shelf}</p>
        <p class="text-xs text-gray-600">Available: {book.quantity}</p>
        <p class="text-xs text-gray-600">Added By: {book.addedBy.username}</p>
        <p class="text-xs text-gray-600">
          Added on: {(book.createdAt as any).split("T")[0]}
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = Users();
  const [books, setBooks] = createSignal<BooksWithAuthor[]>();
  const [loading, setLoading] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [searchShelf, setSearchShelf] = createSignal<number | undefined>();
  const [page, setPage] = createSignal<"Books" | "Shelves">("Shelves");
  const [shelves, setShelves] = createSignal<BooksByShelf[]>([]);
  const [bookcount, setBookcount] = createSignal<number>(0);
  // const [shelfcount, setShelfcount] = createSignal<number>(0);
  
  onMount(async () => {
    if (!user()) return navigate("/login");
    setLoading(true);

    const books = await readServerBooks({});
    setBooks(books);
    const booksByShelves = await booksByShelfServer();
    setShelves(booksByShelves);
    setLoading(false);
   const totalShelfbooks:number = booksByShelves.length
   
  });

  createEffect(() => {
    if (!user()) return navigate("/login");
  });


  createEffect(async () => {
    setLoading(true);
    if (searchShelf()) {
      const books = await readServerBooks({
        where: {
          AND: [
            {
              OR: [
                {
                  title: {
                    contains: search(),
                  },
                },
                {
                  description: {
                    contains: search(),
                  },
                },
                {
                  authors: {
                    contains: search(),
                  },
                },
              ],
            },
            { shelf: searchShelf() },
          ],
        },
      });
      setBooks(books);
    } else {
      const books = await readServerBooks({
        where: search()
          ? {
              OR: [
                {
                  title: {
                    contains: search(),
                  },
                },
                {
                  description: {
                    contains: search(),
                  },
                },
                {
                  authors: {
                    contains: search(),
                  },
                },
              ],
            }
          : undefined,
      });
      setBooks(books);
    }
    setLoading(false);
  });

  return (
    <main class="mx-4 sm:mx-24 mt-10">
      <div class="flex items-center">
        {user() && <User user={user() as UserType} logout={logout} />}
      </div>
      <div class="bg-white">
        <div class="py-8">
          <div class="mb-10 flex flex-wrap items-center">
            {/* <h2 id="products-heading">Books</h2> */}
            <span class="mt-2 isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                class={`rounded-l-md text-black relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold ring-1 ring-gray-300 ${
                  page() === "Shelves" ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => setPage("Shelves")}
              >
                Shelves
              </button>
              <button
                type="button"
                class={`relative text-black inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-gray-300 ${
                  page() === "Books" ? "bg-gray-200" : "bg-white"
                }`}
                onClick={() => setPage("Books")}
              >
                Books
              </button>
            </span>
            <div class="w-16 mt-2">
              {loading() && (
                <svg
                  class="ml-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 48 48"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  >
                    <path d="M4 24c0 11.046 8.954 20 20 20v0c11.046 0 20-8.954 20-20S35.046 4 24 4"></path>
                    <path d="M36 24c0-6.627-5.373-12-12-12s-12 5.373-12 12s5.373 12 12 12v0"></path>
                  </g>
                </svg>
              )}
            </div>
            <input
              type="text"
              name="search"
              id="search"
              class="mt-2 mr-2 w-64 rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 p-3  focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search"
              value={search()}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchShelf() && (
              <button
                type="button"
                class="mt-2 rounded-md bg-white px-3.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center"
                onClick={() => setSearchShelf(undefined)}
              >
                Shelf {searchShelf()}
                <svg
                  class="ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z"
                  ></path>
                </svg>
              </button>
            )}
            
            <div class="mr-auto w-8"></div>
            <div class="flex mt-2">
              <A href="/book/Add/Add">
                <button
                  type="button"
                  class="flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <svg
                    class="mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4v4Zm-6 4q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.588 1.413T19 21H5Z"
                    ></path>
                  </svg>
                  Add Book
                </button>
              </A>
              <A href="/book/Lendings/lendings">
                <button
                  type="button"
                  class="ml-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  <svg
                    class="mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M435.9 64.9l-367.1 160c-6.5 3.1-6.3 12.4.3 15.3l99.3 56.1c5.9 3.3 13.2 2.6 18.3-1.8l195.8-168.8c1.3-1.1 4.4-3.2 5.6-2 1.3 1.3-.7 4.3-1.8 5.6L216.9 320.1c-4.7 5.3-5.4 13.1-1.6 19.1l64.9 104.1c3.2 6.3 12.3 6.2 15.2-.2L447.2 76c3.3-7.2-4.2-14.5-11.3-11.1z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Lendings
                </button>
              </A>
            </div>
          </div>
          
          {page() === "Books" && (
            <>
             <div class=" flex justify-center font-bold">
                    Total Books : 
                    <span class="text-indigo-600">
                      {books()?.length}
                      </span> 
              </div>    
              <div class="flex flex-wrap justify-around">
                {books() && (
                  <For
                    each={books()}
                    
                    children={(book) =><BookView book={book}   />}
                  />
              
                
                )}
                
              </div>
            </>
          )}
          {page() === "Shelves" && (
            <>
              <div class="flex flex-wrap justify-around">
                {shelves() && (
                  <For
                    each={shelves()}
                    children={(sh) => (
                      <div
                        onClick={() => {
                          setPage("Books");
                          setSearchShelf(sh.shelf);
                        }}
                        class="bg-gray-50 rounded-lg p-16 mb-4 border hover:bg-gray-100 shadow-lg cursor-pointer flex flex-col items-center"
                      >
                        <svg
                          class="mb-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="3em"
                          height="3em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#333"
                            d="M9 3v15h3V3H9m3 2l4 13l3-1l-4-13l-3 1M5 5v13h3V5H5M3 19v2h18v-2H3Z"
                          ></path>
                        </svg>
                        Shelf {sh.shelf}
                        <div class="">
                         <p>
                         Books  {sh.books.length}
                          </p> 
                         </div>
                      </div>
                    )}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
