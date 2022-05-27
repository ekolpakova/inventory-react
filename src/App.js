import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Inventory from "./components/Inventory";
import ToDo from "./components/ToDo";
import SignUp from "./components/SignUp";
import Admin from "./components/Admin";
import RememberMe from "./components/RememberMe";

const ROLES = {
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  READER: 'READER',
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="signIn" element={<SignIn />}></Route>
        <Route path="signUp" element={<SignUp />}></Route>

        <Route element={<RememberMe />}>
          <Route element={<RequireAuth roles={['MODERATOR']} />}>
            <Route path="inventory" element={<Inventory />}></Route>
          </Route>
          <Route element={<RequireAuth roles={['ADMIN']} />}>
            <Route path="admin" element={<Admin />}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
