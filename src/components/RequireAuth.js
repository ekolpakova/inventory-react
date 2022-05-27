import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SignIn from "./SignIn";

const RequireAuth = ({ roles }) => {
  const { auth } = useAuth();

  return auth?.roles
    ?.map((role) => role.name)
    .find((role) => roles?.includes(role)) ? (
    <Outlet />
  ) : (
    <SignIn />
  );
};

export default RequireAuth;
