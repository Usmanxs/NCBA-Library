export interface BooksWithAuthor {
    id: number;
    cover: string;
    title: string;
    description: string;
    authors: string;
    genre: string;
    quantity: number;
    createdAt: Date;
    shelf: number;
    addedBy: {
      username: string;
    };
  }
  
  
export type BookSummary = {
    id: number;
    cover: string;
    title: string;
    authors: string;
    description: string;
    genre: string;
    quantity: number;
    createdAt: Date;
    adminId: number;
  };
  
 export type BooksByShelf = {
    shelf: number;
    books: BookSummary[];
  };
  export type UserType = {
    username: string;
    password: string;
    id: number;
  };
  
  export interface BookOption {
    title: string;
    authors: string;
    cover: string;
    description: string;
    genre: string;
  }
  
 export interface BooksWithMetaData {
  id: number;
  cover: string;
  title: string;
  description: string;
  authors: string;
  genre: string;
  quantity: number;
  createdAt: Date;
  shelf: number;
  addedBy: {
    username: string;
  };
  Lendings: {
    id: number;
    name: string;
    email: string;
    due: Date;
    on: Date;
    by: {
      username: string;
    };
    returned: boolean;
  }[];
}