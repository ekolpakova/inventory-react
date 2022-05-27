import { Link } from "react-router-dom";
import SignIn from "./SignIn";
import Inventory from "./Inventory";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Admin from "./Admin";

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
