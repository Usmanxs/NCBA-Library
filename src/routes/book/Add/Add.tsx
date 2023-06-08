import { A } from "@solidjs/router";
import { createEffect, createSignal, onMount } from "solid-js";
import { useNavigate } from "solid-start";
import {User,Users} from "~/components/User";
import { UserType,BookOption } from "../../../types/type";
import {addBookServer} from "../../../Server/Services";


async function searchGoogleBooks(bookName: string): Promise<BookOption[]> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${bookName}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!data.items) {
    console.log("No results found.");
    return [];
  }

  const booksOptions = [];

  for (let i of data.items) {
    let authors = "";

    if (i.volumeInfo.authors) {
      authors = i.volumeInfo.authors.join(",");
    }

    const book = {
      title: i.volumeInfo.title,
      authors: authors || "Unknown",
      cover: i.volumeInfo.imageLinks?.thumbnail || "",
      description: i.volumeInfo.description || "",
      genre: i.volumeInfo.categories?.[0],
    };

    booksOptions.push(book);
  }

  return booksOptions;
}

export default function AddBook() {
  const { user, logout } = Users();
  const [error, setError] = createSignal<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);

  // book related fields
  const [coverPhoto, setCoverPhoto] = createSignal<string>();
  const [coverPhotoType, setCoverPhotoType] = createSignal<string>("");
  const [coverPhotoName, setCoverPhotoName] = createSignal<string>("");
  const [bookTitle, setBookTitle] = createSignal<string>("");
  const [bookDescription, setBookDescription] = createSignal<string>("");
  const [bookAuthors, setBookAuthors] = createSignal<string>("");
  const [bookQuantity, setBookQuantity] = createSignal<number>(1);
  const [bookGenre, setBookGenre] = createSignal<string>("");
  const [bookShelf, setBookShelf] = createSignal<number>(1);

  // google
  const [bookOptions, setBookOptions] = createSignal<BookOption[]>([]);
  const [googleBookSearch, setGoogleBookSearch] = createSignal("");

  onMount(() => {
    if (!user()) return navigate("/login");
  });

  createEffect(() => {
    if (!user()) return navigate("/login");
  });

  createEffect(async () => {
    const searchTerm = googleBookSearch();

    if (searchTerm) {
      const options = await searchGoogleBooks(searchTerm);
      setBookOptions(options);
    } else {
      setBookOptions([]);
    }
  });

  const handleBookCreate = async () => {
    const bookPayload = {
      cover: coverPhoto() as string,
      title: bookTitle(),
      description: bookDescription(),
      authors: bookAuthors(),
      quantity: bookQuantity(),
      genre: bookGenre(),
      shelf: bookShelf(),
    };

    if (!bookPayload.cover) return setError("Book cover must be there !");
    if (!bookPayload.title) return setError("Book title must be there !");
    if (!bookPayload.description)
      return setError("Book description must be there !");
    if (!bookPayload.authors) return setError("Book author must be there !");
    if (!bookPayload.quantity) return setError("Book quantity must be there !");
    if (!bookPayload.genre) return setError("Book genre must be there !");

    setLoading(true);

    const book = await addBookServer(
      {
        ...bookPayload,
        adminId: user()?.id as any,
      },
      coverPhotoName(),
      coverPhotoType()
    );

    setLoading(false);

    navigate("/");
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
              Add Book Details
            </h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">
              Please fill out the form below to add a new book to the library
            </p>
            {error() && (
              <p class="mt-1 text-sm leading-6 text-red-600">{error()}</p>
            )}
            <div class="flex mt-10">
              <div>
                <label
                  for="booksearch"
                  class=" text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  Search book on{" "}
                  <svg
                    class="ml-4 mt-0.5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="3.05em"
                    height="1em"
                    viewBox="0 0 512 168"
                  >
                    <path
                      fill="#FF302F"
                      d="m496.052 102.672l14.204 9.469c-4.61 6.79-15.636 18.44-34.699 18.44c-23.672 0-41.301-18.315-41.301-41.614c0-24.793 17.816-41.613 39.308-41.613c21.616 0 32.206 17.193 35.633 26.475l1.869 4.735l-55.692 23.049c4.236 8.348 10.84 12.584 20.183 12.584c9.345 0 15.823-4.61 20.495-11.525ZM452.384 87.66l37.19-15.45c-2.056-5.17-8.16-8.845-15.45-8.845c-9.281 0-22.176 8.223-21.74 24.295Z"
                    ></path>
                    <path
                      fill="#20B15A"
                      d="M407.407 4.931h17.94v121.85h-17.94V4.93Z"
                    ></path>
                    <path
                      fill="#3686F7"
                      d="M379.125 50.593h17.318V124.6c0 30.711-18.128 43.357-39.558 43.357c-20.183 0-32.33-13.58-36.878-24.606l15.885-6.604c2.865 6.79 9.78 14.827 20.993 14.827c13.767 0 22.24-8.535 22.24-24.482v-5.98h-.623c-4.112 4.983-11.961 9.468-21.928 9.468c-20.807 0-39.87-18.128-39.87-41.488c0-23.486 19.063-41.8 39.87-41.8c9.905 0 17.816 4.423 21.928 9.282h.623v-5.98Zm1.245 38.499c0-14.702-9.78-25.417-22.239-25.417c-12.584 0-23.174 10.715-23.174 25.417c0 14.514 10.59 25.042 23.174 25.042c12.46.063 22.24-10.528 22.24-25.042Z"
                    ></path>
                    <path
                      fill="#FF302F"
                      d="M218.216 88.78c0 23.984-18.688 41.613-41.613 41.613c-22.924 0-41.613-17.691-41.613-41.613c0-24.108 18.689-41.675 41.613-41.675c22.925 0 41.613 17.567 41.613 41.675Zm-18.19 0c0-14.95-10.84-25.23-23.423-25.23c-12.583 0-23.423 10.28-23.423 25.23c0 14.826 10.84 25.23 23.423 25.23c12.584 0 23.423-10.404 23.423-25.23Z"
                    ></path>
                    <path
                      fill="#FFBA40"
                      d="M309.105 88.967c0 23.984-18.689 41.613-41.613 41.613c-22.925 0-41.613-17.63-41.613-41.613c0-24.108 18.688-41.613 41.613-41.613c22.924 0 41.613 17.443 41.613 41.613Zm-18.253 0c0-14.95-10.839-25.23-23.423-25.23c-12.583 0-23.423 10.28-23.423 25.23c0 14.826 10.84 25.23 23.423 25.23c12.646 0 23.423-10.466 23.423-25.23Z"
                    ></path>
                    <path
                      fill="#3686F7"
                      d="M66.59 112.328c-26.102 0-46.534-21.056-46.534-47.158c0-26.101 20.432-47.157 46.534-47.157c14.079 0 24.357 5.544 31.957 12.646l12.522-12.521C100.479 7.984 86.338.258 66.59.258C30.833.259.744 29.414.744 65.17c0 35.758 30.089 64.912 65.846 64.912c19.312 0 33.889-6.354 45.289-18.19c11.711-11.712 15.324-28.158 15.324-41.489c0-4.174-.498-8.472-1.059-11.649H66.59v17.318h42.423c-1.246 10.84-4.672 18.253-9.718 23.298c-6.105 6.168-15.76 12.958-32.705 12.958Z"
                    ></path>
                  </svg>
                </label>
                <div class="mt-2">
                  <input
                    value={googleBookSearch()}
                    onChange={(e) => setGoogleBookSearch(e.target.value)}
                    type="text"
                    name="search"
                    id="booksearch"
                    class=" p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {bookOptions().length > 0 && (
                <>
                  <div class="ml-4">
                    <label
                      for="location"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Choose
                    </label>
                    <select
                      id="location"
                      name="location"
                      onChange={(e) => {
                        for (let bo of bookOptions()) {
                          if (bo.title === e.target.value) {
                            setCoverPhoto(bo.cover);
                            setBookTitle(bo.title);
                            setBookDescription(bo.description);
                            setBookAuthors(bo.authors);
                            setBookGenre(bo.genre);
                            setGoogleBookSearch("");
                            setBookOptions([]);
                          }
                        }
                      }}
                      class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {bookOptions().map((e) => {
                        return (
                          <>
                            <option value={e.title}>{e.title}</option>
                          </>
                        );
                      })}
                    </select>
                  </div>
                </>
              )}
            </div>
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
                    min={1}
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
                    autocomplete="shelf"
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
                  for="quantity"
                  class="block text-sm font-medium leading-6 text-gray-900"
                >
                  Genre
                </label>
                <div class="mt-2">
                  <input
                    id="genere"
                    name="genere"
                    type="text"
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={bookGenre()}
                    onInput={(e) => {
                      setBookGenre(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6 mb-10">
          <A href="/">
            <button
              type="button"
              class="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </A>
          <button
            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center"
            onClick={handleBookCreate}
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
