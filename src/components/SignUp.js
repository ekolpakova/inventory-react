import React, { useRef, useState, useEffect } from "react";
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

  const [usernameClicked, setUsernameClicked] = useState(false);
  const [passwordClicked, setPasswordClicked] = useState(false);

  const [usernameError, setUsernameError] = useState("Логин не может быть пустым");
  const [passwordError, setPasswordError] = useState("Пароль не может быть пустым");

  const [formValid, setFormValid] = useState(false);

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

  const clickHandler = (e) => {
    switch (e.target.name) {
      case 'username':
        setUsernameClicked(true)
        break
      case 'password':
        setPasswordClicked(true)  
        break
    }
  }

  const usernameHandler = (e) => {
    setUsername(e.target.value)
    const re = /([A-Za-z0-9])\w+/
    if(!re.test(String(e.target.value).toLowerCase())) {
      setUsernameError("Логин должен содержать только цифры и буквы английского алфавита")
      if(!e.target.value) {
        setPasswordError("Логин не может быть пустым")
      }
    } else {
      setUsernameError("")
    }
  }

  const passwordHandler = (e) => {
    setPassword(e.target.value)
    if(e.target.value.length < 4) { 
      setPasswordError("Пароль должен содержать не меньше 4 символов"); 
      if(!e.target.value) {
        setPasswordError("Пароль не может быть пустым")
      }
   }
   else {
    setPasswordError("")
   }
  }

  useEffect(() => {
    if (usernameError || passwordError) {
      setFormValid(false)
    }
    else {
      setFormValid(true)
    }
  }, [usernameError, passwordError])

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
                <i><span className="material-symbols-outlined">search</span></i>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    className="text"
                    placeholder="Имя пользователя"
                    onChange={(e) => usernameHandler(e)}
                    onClick={(e) => clickHandler(e)}
                  ></input>
                </div>
                {(usernameClicked && usernameError) && <div style={{ color: 'red'}}>{usernameError}</div>}
                <div className="input-Container">
                <i><span className="material-symbols-outlined">lock</span></i>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    className="text"
                    placeholder="Пароль"
                    onChange={(e) => passwordHandler(e)}
                    onClick={(e) => clickHandler(e)}
                  ></input>
                </div>
                {(passwordClicked && passwordError) && <div style={{ color: 'red'}}>{passwordError}</div>}
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
