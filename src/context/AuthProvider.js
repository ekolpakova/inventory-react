import React, { useState, createContext, useContext } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  /*const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");*/
  const [auth, setAuth] = useState({});
  const [rememberMe, setRememberMe] = useState(
    JSON.parse(localStorage.getItem("rememberMe")) || false
  );

  return (
    <AuthContext.Provider
      value={{
        /*username,
        password,
        setUsername,
        setPassword,
        accessToken,
        setAccessToken,*/
        auth,
        setAuth,
        rememberMe,
        setRememberMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
