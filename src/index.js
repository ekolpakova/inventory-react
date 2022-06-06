import React from "react";
import ReactDOM from "react-dom/client";
import ".//index.css";
import reportWebVitals from ".//reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inventory from ".//components/Inventory";
import SignIn from ".//components/SignIn";
import { AuthProvider } from "./context/AuthProvider";
import App from "./App";
import Profile from "./components/Profile";
import RequireAuth from "./components/RequireAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
