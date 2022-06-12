//import 'react-hot-loader'
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
import Welcome from "./components/Welcome";
import InventoryByClassrooms from "./components/InventoryByClassrooms";
import Select from "./components/Select";
import Profile from "./components/Profile";
import Documents from "./components/Documents";
import Fix from "./components/Fix";
import BelongsTo from "./components/BelongsTo";

const ROLES = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  READER: "READER",
};

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Welcome />}></Route>
        <Route path="signIn" element={<SignIn />}></Route>
        <Route path="signUp" element={<SignUp />}></Route>
        <Route path="todo" element={<ToDo />}></Route>
        <Route path="select" element={<Select />}></Route>

        <Route element={<RememberMe />}>
          <Route element={<RequireAuth roles={["MODERATOR", "READER"]} />}>
            <Route path="inventory" element={<Inventory />}></Route>
            <Route path="fixes" element={<Fix />}>Ремонт</Route>
            <Route path="belongsTo" element={<BelongsTo />}>Принадлежность оборудования</Route>
            <Route
              path="classrooms"
              element={<InventoryByClassrooms />}
            ></Route>
            <Route
              path="documents"
              element={<Documents />}
            ></Route>
          </Route>
          <Route element={<RequireAuth roles={["ADMIN"]} />}>
            <Route path="admin" element={<Admin />}></Route>
          </Route>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
