// import { Component,createSignal } from "solid-js"
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../auth/firebase";


// const Login: Component = () => {
//   const [error,setError] = createSignal(false)
//   const [email,setEmail] = createSignal()
//   const [password,setPassword] = createSignal()


//   signInWithEmailAndPassword(auth email(), password())
//     .then((userCredential) => {
//       // Signed in 
//       const user = userCredential.user;
//       console.log (user);
//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log('error')
//       // ..
//     });

//     const handlelogin = (e)=>{
//      e.preventDefault()
     
//     }

//   return (
//     <div>
//         <div class="min-h-screen  flex justify-center h-full items-center bg-fuchsia-800 ">
//           <img src="./assets/logo.png" alt="admin" class="w-20 absolute top-20  justify-center " />
//           <div class="w-96 p-2 bg-white rounded-md  static" >

//           <form onSubmit={handlelogin} class="my-5">
//       <div class="pb-5 text-xl text-center text-fuchsia-700 font-bold ">
//         <h1>SIGN IN</h1>
//       </div>
      
//       <div class="pb-5">
//         <label for="Email" class="text-left block text-fuchsia-700">Email</label>
//         <input type="Email" class="block w-full p-2 rounded shadow bg-gray-100 focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent focus:outline-none" placeholder="Username or email" value={email()}  onInput={e=>setEmail(e.target.value)}/>
//       </div>

//       <div class="pb-5">
//         <label for="password" class="text-left block text-fuchsia-700">Password</label>
//         <input type="password" class="block w-full p-2 rounded shadow bg-gray-100 focus:ring-2 focus:ring-fuchsia-300 focus:border-transparent focus:outline-none" placeholder="Password"value={password()} onInput={e=>setPassword(e.target.value)}/>
//       </div>
  

//       <button type="submit" class="bg-fuchsia-500 p-2 w-full text-white rounded active:bg-fuchsia-900">LogIn</button>
//       {error() && <span>Wrong email or password</span> }
//     </form>
    

     
   
          
//         </div>
//           </div>





//   </div>
//   )
// }

// export default Login