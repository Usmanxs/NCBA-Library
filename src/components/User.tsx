import { UserType } from "../types/type";
import { createSignal, onMount } from "solid-js";



const Users = () => {
  const [user, setUser] = createSignal<UserType>();

  onMount(() => {
    try {
      setUser(JSON.parse(localStorage.auth));
    } catch (e) {
      console.log("user not found !");
    }
  });

  const logout = () => {
    localStorage.setItem("auth", "");
    localStorage.setItem("user", "");
    setUser(undefined);
  };

  return {
    user,
    logout,
  };
};



 function User({
  user,
  logout,
}: {
  user: UserType;
  logout?: () => void;
}) {
  return (
    <>
      <div class="flex items-center w-full">
        <div class="font-semibold mr-auto">Library Management System</div>
        <div class="flex items-center">
          <span class="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
            <svg
              class="h-full w-full text-gray-300"
              fill="gray"
              viewBox="0 0 24 24"
            >
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </span>
          <div class="ml-4">
            <div class="text-sm text-gray-900">admin@{user.username}</div>
          </div>
          <button
            type="button"
            class="ml-4 rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
export {User,Users}