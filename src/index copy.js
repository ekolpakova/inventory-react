import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inventory from "./components/Inventory";
import SignIn from "./components/SignIn";
import axios from "axios";
import { AuthProvider } from "./hooks/useAuth";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="api/v1/public/signIn" element={<SignIn />}></Route>
          <Route
            path="api/v1/moderator/inventory"
            element={<Inventory />}
          ></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

/*axios.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      console.log("Yasss");
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
