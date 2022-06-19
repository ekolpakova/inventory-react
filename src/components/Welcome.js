import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Profile from "./Profile";

const Welcome = () => {
    const { auth } = useAuth();
    return (<div className="main"><h1>Добро пожаловать!</h1> { auth.roles === undefined && <div>
        <h3>Уважаемый гость, дождитесь выдачи прав администратором системы</h3>
        <Link to="profile" element={<Profile />}>Личный кабинет</Link>
    </div>} 
</div>)
};

export default Welcome;