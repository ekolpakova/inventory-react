import React, { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { instance } from "../hooks/useSetInterceptors";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authed, setAuthed] = useState(false);
  const [moderator, setModerator] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [authorities, setAuthorities] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const signIn = async (e, username, password) => {
    e.preventDefault();
    const result = await getTokens(username, password);

    if (result) {
      console.log("User has signed in");
      //setAuthed(true);
      //localStorage.setItem("authed", true);
      //setAccessToken({accessToken});
    }

    console.log(authed);
  };

  const isModerator = async (e) => {
    e.preventDefault();
    const result = await getAccessTokenAuthorities();

    if (result) {
      console.log("User is moderator");
      setModerator(true);
    }
  };

  const getTokens = async (username, password) => {
    const api = `http://localhost:8080/api/v1/public/signIn?username=${username}&password=${password}`;

    const res = await instance.get(api, {
      withCredentials: true,
      params: {
        username: username,
        password: password,
      },
    });
    const data = await res.data;

    setAccessToken(data["access_token"]);
    setRefreshToken(data["refresh_token"]);

    console.log(data);
    console.log(accessToken);

    //return accessToken, refreshToken;
    navigate(from, { replace: true });
  };

  const getAccessTokenAuthorities = async () => {
    const api = `http://localhost:8080/api/v1/public/getAccessTokenAuthorities`;

    const res = await instance.get(api, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.data;

    //switch case for 3 roles?
    const check = data.filter((item) => item.toString() === "MODERATOR");
    if (check.length > 0) setModerator(true);

    console.log(moderator);

    return moderator;
  };

  return (
    <AuthContext.Provider
      value={{
        authed,
        setAuthed,
        moderator,
        setModerator,
        getTokens,
        getAccessTokenAuthorities,
        username,
        password,
        setUsername,
        setPassword,
        signIn,
        isModerator,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
