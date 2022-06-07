import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

import img from "../images/code.jpg";

const SignIn = () => {
  const { setAuth, rememberMe, setRememberMe } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe);
  }, [rememberMe]);

  //const tableRef = useRef(null);

  /*const handleLogin = async (e, username, password) => {
    e.preventDefault();
    const api = `https://inventory-spring-postgres.herokuapp.com/api/v1/public/signIn`;
    const res = await axios.get(api, {
      withCredentials: true,
      params: {
        username: username,
        password: password,
      },
    });
    const data = await res.data;

    const accessToken = data["access_token"];
    const roles = data["roles"][0];
    const id = data["id"];
    const usernameDb = data["username"];

    localStorage.setItem("roles", roles);
    setAuth({ accessToken });
    setAuth({ roles });
    setAuth({ id });
    setAuth({ usernameDb });

    //navigate(from, { replace: true });

    if (res) {
      console.log("User has signed in");
    }
  };*/

  const handleLogin = async (e, username, password) => {
    e.preventDefault();
    const api = `https://inventory-spring-postgres.herokuapp.com/api/v1/public/tests`;
    const res = await axios.get(api, {
      withCredentials: true,
      params: {
        username: username,
        password: password,
      },
    });
    const data = await res.data;

    //const accessToken = data["access_token"];
    //const roles = data["roles"][0];
    //const id = data["id"];
    //const usernameDb = data["username"];

    //localStorage.setItem("roles", roles);
    //setAuth({ accessToken });
    //setAuth({ roles });
    //setAuth({ id });
    //setAuth({ usernameDb });

    //navigate(from, { replace: true });

    if (data) {
      console.log(data);
    }
  };

  return (
    <>
      <div className="main center">
        <div className="login-container">
          <div className="img-container">
            <img src={img}></img>
          </div>
          <div>
            <h1>Вход</h1>
            <div className="form-container">
              <form onSubmit={(e) => handleLogin(e, username, password)}>
                <div className="input-Container">
                  <i>{<PersonIcon />}</i>
                  <input
                    type="text"
                    name=""
                    value={username}
                    className="text"
                    placeholder="Имя пользователя"
                    onChange={(e) => setUsername(e.target.value)}
                  ></input>
                </div>
                <div className="input-Container">
                  <i>{<LockIcon />}</i>
                  <input
                    type="password"
                    name=""
                    value={password}
                    className="text"
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
                <div className="remember-me-container">
                  <div>
                    <label htmlFor="remember-me">Запомнить меня</label>
                    <input
                      type="checkbox"
                      className="remember-me"
                      name=""
                      value=""
                      id="remember-me"
                      onChange={toggleRememberMe}
                      checked={rememberMe}
                    ></input>
                  </div>
                  <input
                    type="submit"
                    name=""
                    value="Войти"
                    className="button"
                  ></input>
                </div>
                <Link to="/signup" className="link create-account">
                  Создать аккаунт?
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getJwtToken = () => {
  localStorage.getItem("jwt");
};

export const setJwtToken = (token) => {
  localStorage.setItem("jwt", token);
};

export const getRefreshToken = () => {
  localStorage.getItem("refreshToken");
};

export const setRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token);
};

SignIn.propTypes = {};

export default SignIn;
