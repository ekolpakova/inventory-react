import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";


import img from "../images/code.jpg";
import { hover } from "@testing-library/user-event/dist/hover";

const SignIn = () => {
  const { setAuth, rememberMe, setRememberMe } = useAuth();
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

  const toggleRememberMe = () => {
    setRememberMe((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe);
  }, [rememberMe]);

  const handleLogin = async (e) => {
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

    const accessToken = data["access_token"];
    const roles = data["roles"][0];
    const id = data["id"];
    const usernameDb = data["username"];

    setAuth({ accessToken });
    setAuth({ roles });
    setAuth({ id });
    setAuth({ usernameDb });

    if (data) {
      console.log(data);
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
            <h1>Вход</h1>
            <div className="form-container">
              <form onSubmit={(e) => handleLogin(e)}>
                <div className="input-Container">
                  <i></i>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    className="text"
                    placeholder="Имя пользователя"
                    onChange={(e) => usernameHandler(e)}
                    onClick={(e) => clickHandler(e)}
                  >
                  </input>
                </div>
               {(usernameClicked && usernameError) && <div style={{ color: 'red'}}>{usernameError}</div>}
                <div className="input-Container">
                  <i></i>
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
                    disabled={!formValid}
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


SignIn.propTypes = {};

export default SignIn;
