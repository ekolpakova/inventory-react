import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import Inventory from "./Inventory";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Admin from "./Admin";
import InventoryByClassrooms from "./InventoryByClassrooms";
import Profile from "./Profile";
import Documents from "./Documents"
import Fix from "./Fix";
import BelongsTo from "./BelongsTo";

const Nav = () => {
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
        <AccountCircleIcon />
      </div>
    </div>
  );
};

export default Nav;
