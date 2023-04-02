import { Component,createSignal } from "solid-js"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "solid-start";


const Login: Component = () => {
  const [error,setError] = createSignal(false);
  const [email,setEmail] = createSignal("");
  const [password,setPassword] = createSignal("");
  const navigate = useNavigate();
  const handleLogin = (e: Event) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email(), password())
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
         navigate("/admin")
         console.log (user)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("eorr");
        setError(true);
      });
  };

  return (
    <div>
      <div class="min-h-screen  flex justify-center h-full items-center bg-fuchsia-800 ">
        <img src="./assets/logo.png" alt="admin" class="w-20 absolute top-20  justify-center " />
        <div class="w-96 p-2 bg-white rounded-md  static" >
          <form onSubmit={handleLogin} class="my-5">
            <div class="pb-5 text-xl text-center text-fuchsia-700 font-bold ">
              <h1>SIGN IN</h1>
            </div>
            <div class="pb-5">
              <label for="email" class="text-left block text-fuchsia-700">Email</label>
              <input type="email" class="block w-full p-2 rounded shadow bg-gray-100 focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent focus:outline-none" 
              placeholder="Enter Email" value={email()} onInput={e=>setEmail(e.target.value)} required/>
            </div>
            <div class="pb-5">
              <label for="password" class="text-left block text-fuchsia-700">Password</label>
              <input type="password" class="block w-full p-2 rounded shadow bg-gray-100 focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent focus:outline-none" placeholder="Enter Password" value={password()} onInput={e=>setPassword(e.target.value)} required/>
            </div>
            <button type="submit" class="bg-fuchsia-500 p-2 w-full text-white rounded active:bg-fuchsia-900">Log In</button>
            {error() && <span class ="text-red-500">Wrong email or password</span> }
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
