import { Link } from "react-router-dom";
import Profile from "./Profile";
const Guest = () => {
  return (
    <div className="main">
      <h1>Гость</h1>
      <h3>Уважаемый гость, дождитесь выдачи прав администратором системы</h3>
      <Link to="profile" element={<Profile />}>
        Личный кабинет
      </Link>
    </div>
  );
};

export default Guest;
