import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import useSetInterceptors from "../hooks/useSetInterceptors";
import Constants from "../constants/Constants";

import AddCircleIcon from "@mui/icons-material/AddCircle";

const Admin = () => {
  const ROLES = {
    ADMIN: "ADMIN",
    MODERATOR: "MODERATOR",
    READER: "READER",
  };

  const [users, setUsers] = useState({});
  const setInterceptors = useSetInterceptors();

  const useConstants = Constants();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const api = `http://localhost:8080/api/v1/admin/users`;

        const res = await setInterceptors.get(api, {
          signal: controller.signal,
        });

        const data = await res.data;
        isMounted && setUsers(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="main">
      <div>
        <h1>Пользователи</h1>
        <div className="wrapper">
          <div className="headings-first">
            <div>Id</div>
            <div>Роль</div>
            <div>Новая роль</div>
            <div>Действие</div>
          </div>
          {users.length > 0 ? (
            users.map((user) => (
              <div className="table">
                <div className="contents">
                  <div>{user.id}</div>
                  <div>
                    <select className="dropdown">
                      {user.roles
                        .map((role) => role.name)
                        .map((r) => (
                          <option>{r}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <select className="dropdown">
                      {["ADMIN", "MODERATOR", "READER"].map((constant) => (
                        <option>{constant}</option>
                      ))}
                    </select>
                  </div>
                  <div><i><AddCircleIcon className="circleBlue"/></i></div>
                </div>
              </div>
            ))
          ) : (
            <div>Загрузка пользователей...</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Admin;
