import { useContext, useDebugValue } from "react";
import AuthenticationContext from "../context/AuthProvider";


export const setAuthenticationContext = () => {
  const { authentication } = useContext(AuthenticationContext);
  useDebugValue(authentication, (authentication) =>
    authentication?.user ? "Signed In" : "Signed Out"
  );
  return useContext(AuthenticationContext);
};

export default setAuthenticationContext;
