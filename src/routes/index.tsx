
import Login from "~/pages/Login";
import Admin from "~/pages/admin"
import { Routes, A, Route } from "solid-start";

export default function Home() {
  return (
    <div>

<Routes>
      <Route path="/" component={Login} />
      <Route path="/admin" component={Admin} />
      
    </Routes>
    </div>
 
  );
}
