import { createSignal } from 'solid-js';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import type { Book } from '../types/types';

interface AddBookProps {
  onAddBook: () => void;
}

export default function AddBook({ onAddBook }: AddBookProps) {
  const [title, setTitle] = createSignal('');
  const [author, setAuthor] = createSignal('');

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const newBook: Book = {
      title: title(),
      author: author(),
      id: "", // We'll set the ID later after adding the book to Firestore
      publishedDate: new Date()
    };
    const docRef = await addDoc(collection(db, 'books'), newBook);
    newBook.id = docRef.id;
    onAddBook();
    setTitle('');
    setAuthor('');

  }

  return (
    <form onSubmit={handleSubmit}>
      <label for="title">Title:</label>
      <input type="text" id="title" value={title()} onInput={(e) => setTitle(e.currentTarget.value)} required />

      <label for="author">Author:</label>
      <input type="text" id="author" value={author()} onInput={(e) => setAuthor(e.currentTarget.value)} required />

      <button type="submit">Add Book</button>
    </form>
  );
}
