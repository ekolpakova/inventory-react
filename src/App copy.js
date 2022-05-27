import "./App.css";
import { Link } from "react-router-dom";
//import { setInterceptors } from "./hooks/useSetInterceptors";
import axios from "axios";
import { useState } from "react";

/*export let access_token = "";
export let refresh_token = "";
export let authorities = [];
let isModerator = false;*/

const App = (props) => {
  return (
    <div className="App">
      <h1>Главная</h1>
      <Link to="api/v1/public/signIn">SignIn</Link>
      <br />
      {getAccessTokenAuthorities() === true ? (
        <Link to="api/v1/moderator/inventory">Inventory</Link>
      ) : (
        <Link to="api/v1/public/signIn">SignIn</Link>
      )}
    </div>
  );
};

/*export const getTokens = async (e, username, password) => {
  e.preventDefault();
  const api = `http://localhost:8080/api/v1/public/signIn`;

  const res = await axios.get(api, {
    withCredentials: true,
    params: {
      username: username,
      password: password,
    },
  });
  const data = await res.data;
  access_token = data["access_token"];
  refresh_token = data["refresh_token"];

  console.log(data);

  return access_token, refresh_token;
};

const getAccessTokenAuthorities = async () => {
  const api = `http://localhost:8080/api/v1/public/getAccessTokenAuthorities`;

  const res = await axios.get(api, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const data = await res.data;
  authorities = data;

  let vals = [];

  authorities.forEach((authority) => {
    vals.push(Object.values(authority));
  });

  const check = vals.filter((val) => val.toString() === "MODERATOR");
  if (check.length > 0) return !isModerator;

  console.log(authorities);

  return isModerator;
};*/

export default App;
