
import { A } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import { useNavigate } from "solid-start";
import {User,Users} from "~/components/User";
import { UserType } from "../../../types/type";
import {readLendingsServer } from "../../../Server/Services";




export default function LendingPage() {
  const navigate = useNavigate();
  const { user, logout } = Users();
  const [loading, setLoading] = createSignal(false);
  const [lendings, setLendings] = createSignal<
    {
      email: string;
      name: string;
      bookId: number;
      due: Date;
    }[]
  >();

  onMount(async () => {
    if (!user()) return navigate("/login");
    setLoading(true);
    const ls = await readLendingsServer();
    setLendings(ls);
    setLoading(false);
  });

  return (
    <main class="mx-4 sm:mx-24 mt-10">
      {user() && <User user={user() as UserType} logout={logout} />}
      <A href="/">
        <button
          type="button"
          class="mt-10 inline-flex items-center gap-x-1.5 rounded-md text-sm text-gray-500 hover:text-black"
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
      <div class="bg-white">
        <div class="mt-10">
          <div>
            <div class="sm:flex-auto">
              <h1 class="text-base font-semibold leading-6 text-gray-900 flex items-center">
                Lendings
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
              </h1>
              <p class="mt-8 mb-1 text-sm text-gray-700">
                List of all borrowers that are due
              </p>
            </div>
          </div>
          <div class="mt-1 flow-root">
            <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full py-2 align-middle">
                <table class="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      >
                        Link
                      </th>
                      <th
                        scope="col"
                        class="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter"
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
                    </tr>
                  </thead>
                  <tbody>
                    {lendings() &&
                      lendings()?.map((l) => {
                        return (
                          <tr>
                            <td
                              class={`whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8 `}
                            >
                              <A href={`/book/${l.bookId}`}>book</A>
                            </td>
                            <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                              {l.name}
                            </td>
                            <td class="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                              {l.email}
                            </td>
                            <td
                              class={`whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 ${
                                isPassedDue(l.due as any) && " text-red-500"
                              }`}
                            >
                              {(l.due as any).split("T")[0]}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const isPassedDue = (date: string) => {
  const current = Date.now();
  const toCheck = new Date(date).getTime();

  return current > toCheck;
};
