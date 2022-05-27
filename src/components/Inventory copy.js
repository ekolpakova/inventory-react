import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useSetInterceptors from "../hooks/useSetInterceptors";
import axios from "axios";
import { AuthContext } from "../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useGetNewAccessToken from "../hooks/useGetNewAccessToken";
import useAuth from "../hooks/useAuth";
import "../index.css";

//Потестить интерцептор реквеста здесь - должен автоматически передать в реквест токен
const Inventory = (props) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItem, setInventoryItem] = useState("");
  const prevInventoryItem = useRef("");

  const setInterceptors = useSetInterceptors();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const refresh = useGetNewAccessToken();

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [inputs, setInputs] = useState([{ name: "Default" }]);

  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    prevInventoryItem.current = inventoryItem;
  }, [inventoryItem]);

  const handleAddInput = () => {
    console.log("Test");
    setInputs([...inputs, { name: "" }]);
    console.log(inputs);
  };

  const handleUpdate = async (e, i, name, prev) => {
    e.preventDefault();
    const arr = [...inventoryItems];
    arr[i][name] = inventoryItem;
    setInventoryItems(arr);
    console.log(arr);

    await handleDbUpdate(prev, name, inventoryItem);

    /*console.log(1);
    setTodos((prev) =>
      prev.map((item) => (item.key === key ? { ...item, name: "Jake" } : item))
    );*/
  };

  const handleChange = (e, key) => {
    e.preventDefault();
    console.log("Test II");
    //setIsEditable(true);

    setInventoryItems(
      (prev) => console.log(prev)
      /*{ 
      inventoryItems: prev.inventoryItems.map((item) =>
        item.key === key ? { ...item, name: "Дом Периньон" } : item
      ),
    }*/
    );
  };

  const handleDbUpdate = async (prev, col, colVal) => {
    const api = `http://localhost:8080/api/v1/moderator/updateInventoryItemCell`;
    const res = await setInterceptors.put(api, null, {
      params: {
        prev: prev,
        col: col,
        colVal: colVal,
      },
    });
    const data = await res.data;

    console.log({ prev, col, colVal });

    if (data === 1) {
      console.log("Value has changed");
    } else {
      console.log("Value has not changed");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getInventoryItems = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/inventory`;

        const res = await setInterceptors.get(api, {
          signal: controller.signal,
        });

        const data = await res.data;
        isMounted && setInventoryItems(data);
        console.log(data);
      } catch (err) {
        console.log(err);
        //navigate("/signIn", { state: { from: location }, replace: true });
      }
    };

    getInventoryItems();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <h1>Инвентарь</h1>
      <Link to="/">Главная</Link>
      {inventoryItems.length ? (
        <div className="main">
          <div className="container">
            <div className="filter-Form">
              <button className="filter-Button" id="filter-Button">
                <i className="icon-plus"></i>Фильтр
              </button>
              <form>
                <div className="input-Container">
                  <i className="icon-search"></i>
                  <input
                    type="text"
                    className="search"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по словам..."
                  ></input>
                </div>
              </form>
            </div>
            <form>
              <div className="input-Container">
                <i className="icon-filter"></i>
                <input
                  type="text"
                  id="filter-Add"
                  className="filter-Add"
                  name="filter-Add"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Добавить фильтр"
                ></input>
              </div>
            </form>
          </div>

          <div className="wrapper">
            <div className="headings-first">
              <div>Наименование</div>
              <div>Тип</div>
              <div>Комментарий</div>
              <div>Действие</div>
            </div>
            {inventoryItems.map((inventoryItem, i) => (
              <div className="table">
                <div className="headings">
                  <div>Наименование</div>
                  <div>Тип</div>
                  <div>Комментарий</div>
                  <div>Действие</div>
                </div>

                <div className="contents">
                  <div>
                    <textarea
                      defaultValue={inventoryItem.name}
                      onChange={(e) => {
                        setInventoryItem(e.target.value);
                      }}
                      onClick={() =>
                        (prevInventoryItem.current = inventoryItem.name)
                      }
                      onDoubleClick={(e) => {
                        handleUpdate(e, i, "name", prevInventoryItem.current);
                      }}
                    ></textarea>
                  </div>
                  <div>
                    <textarea
                      defaultValue={inventoryItem.specs}
                      onChange={(e) => {
                        setInventoryItem(e.target.value);
                      }}
                      onClick={() =>
                        (prevInventoryItem.current = inventoryItem.specs)
                      }
                      onDoubleClick={(e) => {
                        handleUpdate(e, i, "specs", prevInventoryItem.current);
                      }}
                    ></textarea>
                  </div>
                  <div key={i}>
                    <textarea
                      defaultValue={inventoryItem.commentary}
                      onChange={(e) => {
                        setInventoryItem(e.target.value);
                      }}
                      onClick={() =>
                        (prevInventoryItem.current = inventoryItem.commentary)
                      }
                      onDoubleClick={(e) => {
                        handleUpdate(e, i, "commentary", prevInventoryItem.current);
                      }}
                    ></textarea>
                  </div>
                  <div>
                    <input
                      type="submit"
                      value="Изменить"
                      onClick={(e) => handleChange(e, i)}
                    ></input>
                    <input type="submit" value="Удалить"></input>
                  </div>
                </div>
              </div>
            ))}
            <div className="table">
              <div className="headings">
                <div>Наименование</div>
                <div>Тип</div>
                <div>Комментарий</div>
                <div>Действие</div>
              </div>

              <div className="contents">
                <div>
                  <input type="text" className="table-input"></input>
                </div>
                <div>
                  <input type="text" className="table-input"></input>
                </div>
                <div>
                  <input type="text" className="table-input"></input>
                </div>
                <div>
                  <input type="text" className="table-input"></input>
                </div>
              </div>
            </div>

            <div>
              {inputs.map((inp, i) => {
                <div key={i}>
                  <input
                    type="text"
                    name="name"
                    value={inp.name || ""}
                    onChange={handleChange}
                  />
                </div>;
              })}
            </div>
          </div>
          <input
            type="submit"
            value="Добавить"
            className="button"
            onClick={() => handleAddInput()}
          ></input>
        </div>
      ) : (
        /*<div>
          {inventoryItems.map((inventoryItem, i) => (
            <div key={i}>{inventoryItem.specs}</div>
          ))}
        </div>*/
        <div>Нет элементов инвентаря</div>
      )}
    </div>
  );
};

Inventory.propTypes = {};

export default Inventory;
