import { createSignal } from "solid-js";
import { useNavigate } from "solid-start";
import server$ from "solid-start/server";
import prisma from "~/prisma";

const signInServer = server$(async (username: string, password: string) => {
  const user = await prisma.admin.findUnique({ where: { username } });

  if (!user) return { success: false, error: "User not found !" };

  if (password !== user.password)
    return { success: false, error: "Incorrect password !" };

  return {
    success: true,
    user: user,
    error: null,
  };
});

export default function SiginIn() {
  const [username, setUsername] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [error, setError] = createSignal<string>("");
  const navigate = useNavigate();

  const signInHandler = async () => {
    if (username().length < 5) return setError("Invalid username !");
    if (password().length < 5) return setError("Invalid password !");

    // signin server
    const result = await signInServer(username(), password());
    if (result.error) return setError(result.error);

    setError("");
    localStorage.setItem("auth", JSON.stringify(result.user));
    navigate("/");
  };

  return (
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <svg
          class="mx-auto mb-10"
          xmlns="http://www.w3.org/2000/svg"
          width="6em"
          height="6em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M5.8 10C5.4 8.8 4.3 8 3 8c-1.7 0-3 1.3-3 3s1.3 3 3 3c1.3 0 2.4-.8 2.8-2H7v2h2v-2h2v-2H5.8M3 12c-.6 0-1-.4-1-1s.4-1 1-1s1 .4 1 1s-.4 1-1 1m13-8c-2.2 0-4 1.8-4 4s1.8 4 4 4s4-1.8 4-4s-1.8-4-4-4m0 6.1c-1.2 0-2.1-.9-2.1-2.1c0-1.2.9-2.1 2.1-2.1c1.2 0 2.1.9 2.1 2.1s-.9 2.1-2.1 2.1m0 2.9c-2.7 0-8 1.3-8 4v3h16v-3c0-2.7-5.3-4-8-4m6.1 5.1H9.9V17c0-.6 3.1-2.1 6.1-2.1c3 0 6.1 1.5 6.1 2.1v1.1Z"
          ></path>
        </svg>
        <h2 class="mt-6 text-center text-2xl tracking-tight text-gray-900">
          Sign in with your admin account
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div class="space-y-6">
            {error() && <div class="text-red-500">{error()}</div>}
            <div>
              <label
                for="username"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div class="mt-2">
                <input
                  value={username()}
                  id="username"
                  name="username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  autocomplete="username"
                  required
                  class="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div class="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  required
                  class="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={password()}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={signInHandler}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
