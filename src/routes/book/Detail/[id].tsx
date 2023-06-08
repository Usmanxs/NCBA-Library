import { A } from "@solidjs/router";
import { createEffect, createSignal, onMount, Accessor, Show } from "solid-js";
import { useNavigate, useParams } from "solid-start";
import {User,Users} from "~/components/User";
import { UserType ,BooksWithMetaData } from "../../../types/type";
import {readDetailServer,deleteBookServer,handleBookLendingServer,handleReturnBookServer} from "../../../Server/Services";

const BookView = () => {
  return (
    <div class="w-full">
      <div class="sm:flex mx-auto">
        <div class="w-2/7">
          <img
            src={book()?.cover}
            class="h-96 w-64 object-cover border-2 border-gray-800 rounded-md shadow-lg object-center"
          />
          <div class=" sm:block mt-4 flex flex-col justify-between w-full sm:w-96">
            <p class="text-md mt-10 text-gray-600">
              Authors: {book()?.authors}
            </p>
            <p class="text-md text-gray-600">Genre: {book()?.genre}</p>
            <p class="text-md text-gray-600">Available: {book()?.quantity}</p>
            <p class="text-md text-gray-600">Shelf: {book()?.shelf}</p>
            <p class="text-md text-gray-600">
              Added By: {book()?.addedBy.username}
            </p>
            <p class="text-md text-gray-600">
              Added on:{" "}
              {book()?.createdAt && (book()?.createdAt as any).split("T")[0]}
            </p>
          </div>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-2">
          <h3 class="font-bold text-3xl mb-10">{book()?.title}</h3>
          <p class="text-md text-gray-500 mt-2">{book()?.description}</p>
          <div class="sm:hidden mt-4 flex flex-col justify-between w-full sm:w-96">
            <p class="text-md mt-10 text-gray-600">
              Authors: {book()?.authors}
            </p>
            <p class="text-md text-gray-600">Genre: {book()?.genre}</p>
            <p class="text-md text-gray-600">Available: {book()?.quantity}</p>
            <p class="text-md text-gray-600">Shelf: {book()?.shelf}</p>
            <p class="text-md text-gray-600">
              Added By: {book()?.addedBy.username}
            </p>
            <p class="text-md text-gray-600">
              Added on:{" "}
              {book()?.createdAt && (book()?.createdAt as any).split("T")[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const [book, setBook] = createSignal<BooksWithMetaData>();

export default function Book() {
  const { user, logout } = Users();
  const navigate = useNavigate();
  const [loading, setLoading] = createSignal(false);
  const [deleteTitle, setDeleteTitle] = createSignal("");
  const [borrowerName, setBorrowerName] = createSignal("");
  const [borrowerEmail, setBorrowerEmail] = createSignal("");
  const [borrowerReturnDate, setBorrowerReturnDate] = createSignal("");
  const [lendingError, setLendingError] = createSignal("");
  const [lendingLoading, setLendingLoading] = createSignal<{
    id: number | undefined;
    loading: boolean;
  }>({
    id: undefined,
    loading: false,
  });

  const params = useParams();

  onMount(async () => {
    if (!user()) return navigate("/login");

    setLoading(true);
    const book = await readDetailServer(parseInt(params.id));

    if (!book) return navigate("/");

    setBook(book);
    setLoading(false);
  });

  createEffect(() => {
    if (!user()) return navigate("/login");
  });

  const handleDeleteBook = async () => {
    setLoading(true);

    if (book()?.title === deleteTitle()) {
      const book = await deleteBookServer(parseInt(params.id));
      navigate("/");
    }

    setLoading(false);
  };

  const handleBookLending = async () => {
    const name = borrowerName();
    const email = borrowerEmail();
    const returnDate = borrowerReturnDate();

    if (!name) return setLendingError("Borrower name is required !");
    if (!email) return setLendingError("Borrower email is required !");
    if (!returnDate) return setLendingError("Return date is required !");
    if (!book()?.quantity) return setLendingError("No books left to Lend !");

    const adminId = user()?.id;

    if (!adminId) return;

    setLoading(true);

    await handleBookLendingServer({
      adminId,
      bookId: parseInt(params.id),
      name,
      email,
      due: new Date(returnDate),
    });

    const bk = await readDetailServer(parseInt(params.id));
    if (bk) setBook(bk);
    setBorrowerEmail("");
    setBorrowerReturnDate("");
    setBorrowerName("");
    setLoading(false);
  };

  const handleBookReturn = async (id: number) => {
    setLendingLoading({ id, loading: true });
    await handleReturnBookServer(id);
    const bk = await readDetailServer(parseInt(params.id));
    if (bk) setBook(bk);
    setLendingLoading({ id, loading: false });
  };

  return (
    <main class="mx-4 sm:mx-24 mt-10">
      {user() && <User user={user() as UserType} logout={logout} />}
      <div class="mt-10">
        <div class="flex items-center">
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
          <A href={`/book/Edit/${params.id}`}>
            <button
              type="button"
              class="bg-indigo-600 ml-10 flex items-center rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
                  d="M5 23.7q-.825 0-1.413-.587T3 21.7v-14q0-.825.588-1.413T5 5.7h8.925l-2 2H5v14h14v-6.95l2-2v8.95q0 .825-.588 1.413T19 23.7H5Zm7-9Zm4.175-8.425l1.425 1.4l-6.6 6.6V15.7h1.4l6.625-6.625l1.425 1.4l-7.2 7.225H9v-4.25l7.175-7.175Zm4.275 4.2l-4.275-4.2l2.5-2.5q.6-.6 1.438-.6t1.412.6l1.4 1.425q.575.575.575 1.4T22.925 8l-2.475 2.475Z"
                ></path>
              </svg>
              Edit
            </button>
          </A>
        </div>
        <div class="h-12 w-full mt-4">
          {loading() && (
            <svg
              class="animate-spin"
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
        <BookView />
        <div class="mt-24">
          <div>
            <div class="sm:flex-auto">
              <h1 class="text-base font-semibold leading-6 text-gray-900">
                Lendings
              </h1>
              <p class="mt-2 text-sm text-gray-700">List of all borrowers</p>
            </div>
          </div>
          <div class="mt-2 flow-root">
            <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle">
                <table class="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Due
                      </th>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Given By
                      </th>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Given On
                      </th>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
                      >
                        Returned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {book()?.Lendings &&
                      book()?.Lendings.map((l) => {
                        return (
                          <tr>
                            <td
                              class={`whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 `}
                            >
                              {l.name}
                            </td>
                            <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                              {l.email}
                            </td>
                            <td
                              class={`whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 ${
                                isPassedDue(l.due as any, l.returned) &&
                                " text-red-500"
                              }`}
                            >
                              {(l.due as any).split("T")[0]}
                            </td>
                            <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                              {l.by.username}
                            </td>
                            <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                              {(l.on as any).split("T")[0]}
                            </td>
                            <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                              {lendingLoading()?.id === l.id &&
                              lendingLoading()?.loading ? (
                                <svg
                                  class="animate-spin"
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
                              ) : (
                                <div class="relative flex items-start">
                                  <div class="flex h-6 items-center">
                                    <input
                                      checked={l.returned}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          handleBookReturn(l.id);
                                        } else {
                                          e.target.checked = true;
                                        }
                                      }}
                                      id="comments"
                                      aria-describedby="comments-description"
                                      name="comments"
                                      type="checkbox"
                                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {shouldShowLendingEntry(book()) && (
            <>
              <div class="mt-4 flex items-start">
                <div>
                  <input
                    value={borrowerName()}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    type="name"
                    name="name"
                    required
                    id="name"
                    class="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Jhon Doe"
                  />
                  <p class="mt-2 text-sm text-gray-500" id="email-description">
                    Name of the borrower
                  </p>
                </div>
                <div class="ml-4">
                  <input
                    value={borrowerEmail()}
                    onChange={(e) => setBorrowerEmail(e.target.value)}
                    type="email"
                    name="email"
                    id="email"
                    required
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="you@example.com"
                    aria-describedby="email-description"
                  />
                  <p class="mt-2 text-sm text-gray-500" id="email-description">
                    Email of the borrower
                  </p>
                </div>
                <div class="ml-4">
                  <input
                    value={borrowerReturnDate()}
                    onChange={(e) => setBorrowerReturnDate(e.target.value)}
                    type="date"
                    name="return"
                    id="return"
                    required
                    class="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="2023-10-34"
                  />
                  <p class="mt-2 text-sm text-gray-500" id="email-description">
                    Date on which borrower will return the book
                  </p>
                </div>
                <button
                  type="button"
                  class="ml-auto flex items-center  rounded-md bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-300"
                  onClick={handleBookLending}
                >
                  {loading() ? (
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
                  ) : (
                    <svg
                      class="mr-2"
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
                  )}
                  Lend
                </button>
              </div>
              {lendingError() && (
                <p class="mt-2 text-sm text-red-500">{lendingError()}</p>
              )}
            </>
          )}
        </div>
        {/* Delete Book */}
        <div class="mt-24 font-bold text-red-500">Delete Book</div>
        <div class="text-sm mt-4">
          {shouldAllowDelete(book())
            ? "Enter the title of the book to delete it permanently !"
            : "Note: Can not delete the book if it's due !"}
        </div>
        <div class="mt-2 flex rounded-md shadow-sm w-72 mb-16">
          <div class="relative flex flex-grow items-stretch focus-within:z-10">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  fill="gray"
                  d="M21 5c-1.11-.35-2.33-.5-3.5-.5c-1.95 0-4.05.4-5.5 1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5c.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5c1.35-.85 3.8-1.5 5.5-1.5c1.65 0 3.35.3 4.75 1.05c.1.05.15.05.25.05c.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5c-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5c1.2 0 2.4.15 3.5.5v11.5z"
                ></path>
                <path
                  fill="gray"
                  d="M17.5 10.5c.88 0 1.73.09 2.5.26V9.24c-.79-.15-1.64-.24-2.5-.24c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99zM13 12.49v1.66c1.13-.64 2.7-.99 4.5-.99c.88 0 1.73.09 2.5.26V11.9c-.79-.15-1.64-.24-2.5-.24c-1.7 0-3.24.3-4.5.83zm4.5 1.84c-1.7 0-3.24.29-4.5.83v1.66c1.13-.64 2.7-.99 4.5-.99c.88 0 1.73.09 2.5.26v-1.52c-.79-.16-1.64-.24-2.5-.24z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              name="title"
              id="text"
              class="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Title"
              onInput={(e) => setDeleteTitle(e.target.value)}
            />
          </div>
          <button
            type="button"
            class={`relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-red-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ${
              shouldAllowDelete(book()) ? "" : "line-through"
            }`}
            onClick={handleDeleteBook}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M7 21q-.825 0-1.413-.588T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.588 1.413T17 21H7Zm2-4h2V8H9v9Zm4 0h2V8h-2v9Z"
              ></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </main>
  );
}

const shouldShowLendingEntry = (book?: BooksWithMetaData) => {
  if (!book) return false;
  return book.quantity <= 0 ? false : true;
};

const isPassedDue = (date: string, returned: boolean) => {
  if (returned) return false;
  const current = Date.now();
  const toCheck = new Date(date).getTime();

  return current > toCheck;
};

const shouldAllowDelete = (book?: BooksWithMetaData) => {
  if (!book) return false;

  for (let l of book.Lendings) {
    if (!l.returned) return false;
  }

  return true;
};
