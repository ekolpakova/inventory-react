import { useEffect, useState } from "react";
import useSetInterceptors from "../hooks/useSetInterceptors";
import Constants from "../constants/Constants";
import useAuth from "../hooks/useAuth";


const Admin = () => {
  const ROLES = {
    ADMIN: "ADMIN",
    MODERATOR: "MODERATOR",
    READER: "READER",
  };

  const [users, setUsers] = useState({});
  const setInterceptors = useSetInterceptors();
  const { auth } = useAuth();

  const useConstants = Constants();

  //const CRUD = useCRUD();
  const handleAddRoleToUser = async (username, name) => {
    const api = `http://localhost:8080/api/v1/admin/addRoleToUser`;
    const res = await setInterceptors.put(api, null, {
      params: {
        username: username,
        name: name
      },
      headers: {
        Authorization: `Bearer ${auth.accessToken}`
      }
    })

    const data = await res.data;

    setUsers((prev) => [...prev, data]);

    console.log(data);
  };

  const handleRemoveRoles = async (username) => {
    const api = `http://localhost:8080/api/v1/admin/removeRolesFromUser`;
    const res = await setInterceptors.delete(api, {
      params: {
        username: username,
      },
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const api = `http://localhost:8080/api/v1/admin/users`;

        const res = await setInterceptors.get(api, {
          signal: controller.signal,
          headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
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
                      {user?.roles !== undefined && user?.roles
                        .map((role) => role.name)
                        .map((r) => (
                          <option>{r}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <select
                      className="dropdown"
                      onChange={(e) =>
                        handleAddRoleToUser(user.username, e.target.value)
                      }
                    >
                      {["ADMIN", "MODERATOR", "READER"].map((constant) => (
                        <option value={constant}>{constant}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <i>
                      <button className="circleRemove" onClick={(e) => handleRemoveRoles(user.username)}/>
                    </i>
                  </div>
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
