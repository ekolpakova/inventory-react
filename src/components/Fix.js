import axios from "axios";
import { useEffect, useState } from "react";
import useUpdate from "../hooks/useUpdate";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import useSetInterceptors from "../hooks/useSetInterceptors";

import { IconButton } from "@material-ui/core";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const Fix = () => {
  const { handleUpdate, handleDropdown } = useUpdate();

  const [fixes, setFixes] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  const [item, setItem] = useState({});
  const [user, setUser] = useState({});
  const [fix, setFix] = useState({});

  const { get } = useGet();
  const { auth } = useAuth();
  const setInterceptors = useSetInterceptors();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getFixes = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/fixes`;

        const res = await setInterceptors.get(api, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          signal: controller.signal,
        });

        const data = await res.data;
        isMounted && setFixes(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    getFixes();

    return () => {
      isMounted = false;
      controller.abort();
    };
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getInventoryItems = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/inventory`;

        const res = await setInterceptors.get(api, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          signal: controller.signal,
        });

        const data = await res.data;
        isMounted && setItems(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    getInventoryItems();

    return () => {
      isMounted = false;
      controller.abort();
    };
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/users`;

        const res = await setInterceptors.get(api, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
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
  });

  const handleCreate = async (e, itemId, fix) => {
    e.preventDefault();
    const api = `http://localhost:8080/api/v1/moderator/inventory/fix/${itemId}`;
    const json = JSON.stringify({
      fix: fix
    });
    const res = await setInterceptors.post(api, json, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.data;

    setFixes((prev) => [...prev, data]);

    if (res) {
      console.log("Item was created");
      alert("Item was created");
    }
  };

  const handleAddFix = () => {};

  return (
    <div className="main">
      <h1>Акт передачи оборудования в ремонт</h1>
      <div className="wrapper">
        <div className="headings-first">
          <div>Наименование</div>
          <div>Описание поломки</div>
          <div>Ответственное лицо</div>
          <div>Контактный телефон</div>
          <div>Действие</div>
        </div>
        <div className="table">
          <div className="headings">
            <div>Наименование</div>
            <div>Описание поломки</div>
            <div>Ответственное лицо</div>
            <div>Контактный телефон</div>
            <div>Действие</div>
          </div>
          {fixes.map((fix) =>
            fix.inventoryItems.map((item) => (
              <div className="contents">
                <div contentEditable="true">{item.name}</div>
                <div
                  contentEditable="true"
                  onChange={(e) => setFix(e.target.value)}
                  onDoubleClick={(e) =>
                    handleUpdate(
                      e,
                      "http://localhost:8080/api/v1/moderator/updateFixCell",
                      fix.id,
                      "description",
                      e.target.innerText
                    )
                  }
                >
                  {fix.description}
                </div>
                <div>{fix.responsiblePerson}</div>
                <div
                  contentEditable="true"
                  onDoubleClick={(e) =>
                    handleUpdate(
                      e,
                      "http://localhost:8080/api/v1/moderator/updateFixCell",
                      fix.id,
                      "phone",
                      e.target.innerText
                    )
                  }
                >
                  {fix.phone}
                </div>
                <div>
                  <IconButton>
                    <RemoveCircleIcon className="circleRemove"></RemoveCircleIcon>
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="table">
          <div className="headings">
            <div>Наименование</div>
            <div>Описание поломки</div>
            <div>Ответственное лицо</div>
            <div>Контактный телефон</div>
            <div>Действие</div>
          </div>

          <form id="addForm" className="contents">
            <div>
              <select className="dropdown" onChange={(e) => setItem(e.target.value)}>
                { items.map((item) => <option value={item.id}>{item.name}</option>) }
              </select>
            </div>
            <div contentEditable="true" onChange={() => handleAddFix()}></div>
            <div>
              <select className="dropdown" onChange={(e) => setUser(e.target.value)}>
                { users.map((user) => <option value={user.id}>{user.username}</option> ) }
              </select>
            </div>
            <div contentEditable="true"></div>
            <div>
              <IconButton onClick={(e) => handleCreate(e, { id: item.id }, { description: fix })}>
                <AddCircleIcon className="circleAdd"></AddCircleIcon>
              </IconButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Fix;
