import React, { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useSetInterceptors from "../hooks/useSetInterceptors";
import axios from "axios";
import { AuthContext } from "../hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useGetNewAccessToken from "../hooks/useGetNewAccessToken";
import useAuth from "../hooks/useAuth";
import "../index.css";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { IconButton } from "@material-ui/core";
import AddCircleIcon from "@mui/icons-material/AddCircle";

//Потестить интерцептор реквеста здесь - должен автоматически передать в реквест токен
const Inventory = (props) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryItem, setInventoryItem] = useState("");
  const prevInventoryItem = useRef("");

  const [name, setName] = useState("");
  const [specs, setSpecs] = useState("");
  const [commentary, setCommentary] = useState("");

  const setInterceptors = useSetInterceptors();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const refresh = useGetNewAccessToken();

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const [inputs, setInputs] = useState([{ name: "Default" }]);

  const [isEditable, setIsEditable] = useState(true);

  const wrapperRef = useRef();
  const [numChildren, setNumChildren] = useState(0);

  useEffect(() => {
    prevInventoryItem.current = inventoryItem;
  }, [inventoryItem]);

  const handleAddInputs = () => {
    setNumChildren(numChildren + 1);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const api = `http://localhost:8080/api/v1/moderator/addInventoryItem`;
    const json = JSON.stringify({
      name: name,
      specs: specs,
      commentary: commentary,
    });
    const res = await setInterceptors.post(api, json, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.data;

    if (res) {
      console.log("Item was created");
    }
  };

  const handleUpdate = async (e, id, name) => {
    e.preventDefault();
    const arr = [...inventoryItems];
    arr[id][name] = inventoryItem;
    setInventoryItems(arr);
    console.log(arr);

    await handleDbUpdate(id, name, inventoryItem);

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

  const handleDelete = async (e, key) => {
    e.preventDefault();
    console.log("Delete " + key);

    const api = `http://localhost:8080/api/v1/moderator/deleteInventoryItem`;
    const res = await setInterceptors.delete(
      api,
      { params: { id: key + 1 } },
      null
    );

    if (res.data === 1) {
      console.log("Элемент удалён");
    } else {
      console.log("Элемент не удалён");
    }
  };

  const handleDbUpdate = async (id, col, colVal) => {
    const api = `http://localhost:8080/api/v1/moderator/updateInventoryItemCell`;
    const res = await setInterceptors.put(api, null, {
      params: {
        id: id,
        col: col,
        colVal: colVal,
      },
    });
    const data = await res.data;

    console.log({ id, col, colVal });

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
      {" "}
      <Link to="/">Главная</Link>
      <h1>Инвентарь</h1>
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

          <div className="wrapper" ref={wrapperRef}>
            <div className="headings-first">
              <div>Наименование</div>
              <div>Характеристики</div>
              <div>Комментарий</div>
              <div>Действие</div>
            </div>
            {inventoryItems.map((inventoryItem, i) => (
              <div className="table">
                <div className="headings">
                  <div>Наименование</div>
                  <div>Характеристики</div>
                  <div>Комментарий</div>
                  <div>Действие</div>
                </div>

                <div className="contents">
                  <div>
                    {props.roles !== "MODERATOR" ? (
                      <textarea
                        disabled="true"
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
                    ) : (
                      <textarea
                        disabled="false"
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
                    )}
                  </div>
                  <div>
                    {props.roles !== "MODERATOR" ? (
                      <textarea
                        disabled="true"
                        defaultValue={inventoryItem.specs}
                        onChange={(e) => {
                          setInventoryItem(e.target.value);
                        }}
                        onClick={() =>
                          (prevInventoryItem.current = inventoryItem.specs)
                        }
                        onDoubleClick={(e) => {
                          handleUpdate(
                            e,
                            i,
                            "specs",
                            prevInventoryItem.current
                          );
                        }}
                      ></textarea>
                    ) : (
                      <textarea
                        disabled="false"
                        defaultValue={inventoryItem.specs}
                        onChange={(e) => {
                          setInventoryItem(e.target.value);
                        }}
                        onClick={() =>
                          (prevInventoryItem.current = inventoryItem.specs)
                        }
                        onDoubleClick={(e) => {
                          handleUpdate(
                            e,
                            i,
                            "specs",
                            prevInventoryItem.current
                          );
                        }}
                      ></textarea>
                    )}
                  </div>
                  <div>
                    {props.roles !== "MODERATOR" ? (
                      <textarea
                        disabled="true"
                        defaultValue={inventoryItem.commentary}
                        onChange={(e) => {
                          setInventoryItem(e.target.value);
                        }}
                        onClick={() =>
                          (prevInventoryItem.current = inventoryItem.commentary)
                        }
                        onDoubleClick={(e) => {
                          handleUpdate(
                            e,
                            inventoryItem.id,
                            "commentary",
                            prevInventoryItem.current
                          );
                        }}
                      ></textarea>
                    ) : (
                      <textarea
                        disabled="false"
                        defaultValue={inventoryItem.commentary}
                        onChange={(e) => {
                          setInventoryItem(e.target.value);
                        }}
                        onClick={() =>
                          (prevInventoryItem.current = inventoryItem.commentary)
                        }
                        onDoubleClick={(e) => {
                          handleUpdate(
                            e,
                            inventoryItem.id,
                            "commentary",
                            prevInventoryItem.current
                          );
                        }}
                      ></textarea>
                    )}
                  </div>

                  <div>
                    {props.roles !== "MODERATOR" ? (
                      <IconButton
                        onClick={(e) => handleDelete(e, i)}
                        disabled="true"
                      >
                        <RemoveCircleIcon></RemoveCircleIcon>
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={(e) => handleDelete(e, i)}
                        disabled="false"
                      >
                        <RemoveCircleIcon></RemoveCircleIcon>
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {props.children}

            <div className="table">
              <div className="headings">
                <div>Наименование</div>
                <div>Характеристики</div>
                <div>Комментарий</div>
                <div>Действие</div>
              </div>

              <form id="addForm" className="contents">
                <div>
                  {props.roles !== "MODERATOR" ? (
                    <input
                      disabled="true"
                      type="text"
                      className="table-input"
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                  ) : (
                    <input
                      disabled="false"
                      type="text"
                      className="table-input"
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                  )}
                </div>
                <div>
                  {props.roles !== "MODERATOR" ? (
                    <input
                      disabled="true"
                      type="text"
                      className="table-input"
                      onChange={(e) => setSpecs(e.target.value)}
                    ></input>
                  ) : (
                    <input
                      disabled="false"
                      type="text"
                      className="table-input"
                      onChange={(e) => setSpecs(e.target.value)}
                    ></input>
                  )}
                </div>
                <div>
                  {props.roles !== "MODERATOR" ? (
                    <input
                      disabled="true"
                      type="text"
                      className="table-input"
                      onChange={(e) => setCommentary(e.target.value)}
                    ></input>
                  ) : (
                    <input
                      disabled="false"
                      type="text"
                      className="table-input"
                      onChange={(e) => setCommentary(e.target.value)}
                    ></input>
                  )}
                </div>
                <div>
                  {props.roles !== "MODERATOR" ? (
                    <IconButton
                      onClick={(e) => handleCreate(e)}
                      disabled="true"
                    >
                      <AddCircleIcon></AddCircleIcon>
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={(e) => handleCreate(e)}
                      disabled="false"
                    >
                      <AddCircleIcon></AddCircleIcon>
                    </IconButton>
                  )}
                </div>
              </form>
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
