import React, { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = () => {
  const [user, setUser] = useState({});

  return <AuthContext.Provider>{props.children}</AuthContext.Provider>;
};
