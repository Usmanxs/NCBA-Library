
import Login from "~/pages/Login";
import Admin from "~/pages/admin"
import { Routes, A, Route,  } from "solid-start";
import AddBooks from "~/components/AddBooks";


export default function Home() {
   const currentUser = false;
  

   
  return (
    <div>

<Routes>
      <Route path="/Login" element={Login} />
      <Route path="/" component={AddBooks} />
      <Route path="/Admin" element={Admin} />
      
    </Routes>
    </div>
 
  );
}
