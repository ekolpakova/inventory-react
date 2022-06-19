import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import Inventory from "./Inventory";

import Admin from "./Admin";
import InventoryByClassrooms from "./InventoryByClassrooms";
import Profile from "./Profile";
import Documents from "./Documents"
import Fix from "./Fix";
import BelongsTo from "./BelongsTo";
import axios from "axios";
import useAuth from "../hooks/useAuth";

const Nav = () => {
  const {auth} = useAuth();

  const logout = async (e) => {
    e.preventDefault();
    axios.get("http://localhost:8080/api/v1/public/logout",{
     withCredentials: true
    })
  }

  return (
    <div className="navbar">
      {" "}
      <div className="navbarLinks">
        <Link to="signin" element={<SignIn />} className="link link__bright">
          Вход
        </Link>
        <Link to="inventory" element={<Inventory />} className="link link__bright">
          Инвентарь
        </Link>
        <Link to="fixes" element={<Fix />} className="link link__bright">Ремонт</Link>
        <Link to="belongsTo" element={<BelongsTo />} className="link link__bright">Принадлежность оборудования</Link>
        <Link to="documents" element={<Documents />} className="link link__bright">Документы</Link>
        <Link to="classrooms" element={<InventoryByClassrooms />} className="link link__bright">Кабинеты</Link>
        <Link to="admin" element={<Admin />} className="link link__bright">
          Управление
        </Link>
      </div>
      <div className="profile">
        <button  onClick={(e) => logout(e)}> <span class="material-symbols-outlined" style={{color: '#fff', transform: 'scale(1.3)'}}>
          logout
        </span></button>
      </div>
    </div>
  );
};

export default Nav;
