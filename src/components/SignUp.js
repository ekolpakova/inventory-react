import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import img from "../images/code.jpg";

const SignUp = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const tableRef = useRef(null);

  const handleRegister = async (e, username, password) => {
    e.preventDefault();
    const api = `http://localhost:8080/api/v1/public/signUp`;
    const json = JSON.stringify({ username: username, password: password })
    const res = await axios.post(api, json, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.data;

    navigate(from, { replace: true });

    if (res) {
      console.log("User has signed up");
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
            <h1>Регистрация</h1>
            <div className="form-container">
              <form onSubmit={(e) => handleRegister(e, username, password)}>
                <div className="input-Container">
                  <i></i>
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
                  <i></i>
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
                  <input
                    type="submit"
                    name=""
                    value="Создать аккаунт"
                    className="button"
                  ></input>
                </div>
                <Link to="/signin" className="link create-account">
                  Уже зарегистрированы?
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

SignUp.propTypes = {};

export default SignUp;
