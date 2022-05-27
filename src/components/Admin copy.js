import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import useSetInterceptors from "../hooks/useSetInterceptors";
import Constants from "../constants/Constants";

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
          </div>
          {users.length > 0 ? (
            users.map((user) => (
              <div className="table">
                <div className="contents">
                  <div>{user.id}</div>
                  <div>
                    <select>
                      {user.roles
                        .map((role) => role.name)
                        .map((r) => (
                          <option>{r}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <select>
                      {["ADMIN", "MODERATOR", "READER"].map((constant) => (
                        <option>{constant}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No users 4 u</div>
          )}
        </div>
      </div>
      <div className="form-control">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Роль</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={ROLES.READER}
            label="Роль"
          >
            <MenuItem value={ROLES.MODERATOR}>Модератор</MenuItem>
            <MenuItem value={ROLES.READER}>Читатель</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export default Admin;
