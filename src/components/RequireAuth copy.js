import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRoles from "../hooks/useRoles";
import { instance } from "../hooks/useSetInterceptors";

const RequireAuth = ({ roles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  //const userRoles = useRoles();
  const userRoles = ["MODERATOR"];

  const canAccess = userRoles.find((role) => roles.includes(role));

  const getAccessTokenAuthorities = async () => {
    const api = "http://localhost:8080/api/v1/public/getAccessTokenAuthorities";
    const res = await instance.get(api, {
      withCredentials: true,
    });
    const authorities = await res.data;
    return authorities;
  };

  /*useEffect(() => {
    const useRoles = async () => {
      let res = await auth.roles
        .map((role) => role.name)
        .find((role) => roles.includes(role));
      return res;  
    };
    console.log(useRoles);
    return useRoles;
  });
  */

  return (
    //canAccess
    //console.log(typeof(auth.roles))
    //typeof(auth.roles) //

    auth.roles.length > 0 ?
    auth.roles.map((role) => role.name).find((role) => roles.includes(role)) : null ? (
      //auth.roles.find(role => roles.includes(role))
      /*getAccessTokenAuthorities() ===
      roles.includes(getAccessTokenAuthorities())*/
      <Outlet />
    ) : auth.accessToken ? (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
      <Navigate to="/signin" state={{ from: location }} replace />
    )
  );
};

export default RequireAuth;
