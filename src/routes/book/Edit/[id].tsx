import { A, useParams } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { useNavigate } from "solid-start";
import {User,Users} from "~/components/User";
import { UserType } from "../../../types/type";
import {saveBookServer,readBookServer } from "../../../Server/Services";



export default function EditBook() {
  const { user, logout } = Users();
  const [error, setError] = createSignal<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const params = useParams();

  // book related fields
  const [coverPhoto, setCoverPhoto] = createSignal<string>();
  const [bookTitle, setBookTitle] = createSignal<string>("");
  const [bookDescription, setBookDescription] = createSignal<string>("");
  const [bookAuthors, setBookAuthors] = createSignal<string>("");
  const [bookQuantity, setBookQuantity] = createSignal<number>(1);
  const [bookShelf, setBookShelf] = createSignal<number>(1);
  const [bookGenre, setBookGenre] = createSignal<string>("");
  const [minQuantity, setMinQuantity] = createSignal(0);
  const [coverPhotoType, setCoverPhotoType] = createSignal<string>("");
  const [coverPhotoName, setCoverPhotoName] = createSignal<string>("");

  onMount(async () => {
    if (!user()) return navigate("/login");

    setLoading(true);
    const book = await readBookServer(parseInt(params.id));

    if (!book) return navigate("/");

    setCoverPhoto(book.cover);
    setBookTitle(book.title);
    setBookGenre(book.genre);
    setBookDescription(book.description);
    setBookQuantity(book.quantity);
    setBookAuthors(book.authors);
    setLoading(false);

    let minQ = 0;
    for (let l of book.Lendings) {
      if (l.returned === false) minQ++;
    }

    setMinQuantity(minQ);
  });

  createEffect(() => {
    if (!user()) return navigate("/login");
  });

  const handleBookSave = async () => {
    const bookPayload = {
      cover: coverPhoto() as string,
      title: bookTitle(),
      description: bookDescription(),
      authors: bookAuthors(),
      shelf: bookShelf(),
      quantity: bookQuantity(),
      genre: bookGenre(),
    };

    if (!bookPayload.cover) return setError("Book cover must be there !");
    if (!bookPayload.title) return setError("Book title must be there !");
    if (!bookPayload.description)
      return setError("Book description must be there !");
    if (!bookPayload.authors) return setError("Book author must be there !");
    if (!bookPayload.genre) return setError("Book genre must be there !");

    setLoading(true);

    const book = await saveBookServer(
      parseInt(params.id),
      {
        ...bookPayload,
        adminId: user()?.id,
      },
      coverPhotoName(),
      coverPhotoType()
    );

    setLoading(false);

    navigate("/book/Detail/" + params.id);
  };

  return (
    <main class="mx-4 sm:mx-24 mt-10">
      {user() && <User user={user() as UserType} logout={logout} />}
      <div class="mt-10">
        <A href="/">
          <button
            type="button"
            class="inline-flex items-center gap-x-1.5 rounded-md text-sm text-gray-400 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m10.875 19.3l-6.6-6.6q-.15-.15-.213-.325T4 12q0-.2.063-.375t.212-.325l6.6-6.6q.275-.275.688-.287t.712.287q.3.275.313.688T12.3 6.1L7.4 11h11.175q.425 0 .713.288t.287.712q0 .425-.287.713t-.713.287H7.4l4.9 4.9q.275.275.288.7t-.288.7q-.275.3-.7.3t-.725-.3Z"
              ></path>
            </svg>
            back
          </button>
        </A>
        <div class="space-y-12 mt-4">
          <div class="border-b border-gray-900/10 pb-12">
            <h2 class="text-base font-semibold leading-7 text-gray-900">
              Edit Book Details
            </h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">
              Please update the book using the form below
            </p>
            {error() && (
              <p class="mt-1 text-sm leading-6 text-red-600">{error()}</p>
            )}
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {coverPhoto() ? (
                <img
                  onClick={() => setCoverPhoto(undefined)}
                  class="col-span-4 max-h-64"
                  src={coverPhoto()}
                />
              ) : (
                <>
                  <div class="col-span-4">
                    <label
                      for="cover-photo"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Cover photo
                    </label>
                    <div class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div class="text-center">
                        <svg
                          class="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <div class="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            for="file-upload"
                            class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              class="sr-only"
                              multiple={false}
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target?.files?.[0];
                                if (file) {
                                  const fileReader = new FileReader();
                                  fileReader.readAsDataURL(file);
                                  fileReader.onload = () => {
                                    setCoverPhoto(fileReader.result as string);
                                    setCoverPhotoName(file.name);
                                    setCoverPhotoType(file.type);
                                  };
                                }
                              }}
                            />
                          </label>
                          <p class="pl-1">or drag and drop</p>
                        </div>
                        <p class="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div class="col-span-4 sm:col-span-4">
                <label
                  for="title"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <div class="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    autocomplete="title"
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={bookTitle()}
                    onChange={(e) => {
                      setBookTitle(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div class="col-span-4 sm:col-span-2">
                <label
                  for="author"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Authors
                </label>
                <div class="mt-2">
                  <input
                    type="text"
                    name="author"
                    id="author"
                    autocomplete="author"
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={bookAuthors()}
                    onChange={(e) => {
                      setBookAuthors(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div class="col-span-4 sm:col-span-full">
                <label
                  for="about"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div class="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows="3"
                    class="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                    value={bookDescription()}
                    onChange={(e) => {
                      setBookDescription(e.target.value);
                    }}
                  ></textarea>
                </div>
                <p class="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about the book
                </p>
              </div>

              <div class="col-span-4 sm:col-span-1">
                <label
                  for="quantity"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Quantity
                </label>
                <div class="mt-2">
                  <input
                    id="quantity"
                    name="quantity"
                    min={minQuantity()}
                    type="number"
                    autocomplete="quantity"
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={bookQuantity()}
                    onChange={(e) => {
                      setBookQuantity(parseInt(e.target.value));
                    }}
                  />
                </div>
              </div>

              <div class="col-span-4 sm:col-span-1">
                <label
                  for="quantity"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Shelf
                </label>
                <div class="mt-2">
                  <input
                    id="shelf"
                    name="shelf"
                    min={1}
                    type="number"
                    autocomplete="quantity"
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={bookShelf()}
                    onChange={(e) => {
                      setBookShelf(parseInt(e.target.value));
                    }}
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label
                  for="genre"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Genre
                </label>
                <div class="mt-2">
                  <input
                    id="genre"
                    name="genre"
                    type="text"
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={bookGenre()}
                    onChange={(e) => {
                      setBookGenre(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6 mb-10">
          <A href={`/book/Detail/${params.id}`}>
            <button
              type="button"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </A>
          <button
            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
            onClick={handleBookSave}
          >
            {loading() && (
              <svg
                class="animate-spin mr-2"
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
            Save
          </button>
        </div>
      </div>
    </main>
  );
}
