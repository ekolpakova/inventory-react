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

  const [categories, setCategories] = useState("");

  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState(1);

  const [name, setName] = useState("");
  const [specs, setSpecs] = useState("");
  const [commentary, setCommentary] = useState("");
  const [commentaryChernega, setCommentaryChernega] = useState("");

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

  /*useEffect(() => {
    setInventoryItems(
      inventoryItems.filter((item) => item.name.toLowerCase().includes(search))
    );
  }, [search]);*/

  const handleSearch = () => {
    setInventoryItems(
      inventoryItems.filter((item) => item.name.toLowerCase().includes(search))
    );
  };

  const handleAddInputs = () => {
    setNumChildren(numChildren + 1);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const api = `http://localhost:8080/api/v1/moderator/addInventoryItem`;
    const json = JSON.stringify({
      category_id: categoryId,
      name: name,
      specs: specs,
      commentary: commentary,
      commentaryChernega: commentaryChernega
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

  /*const handleUpdate = async (e, id, name) => {
    e.preventDefault();
    const arr = [...inventoryItems];
    arr[id][name] = inventoryItem;
    setInventoryItems(arr);
    console.log(arr);

    await handleDbUpdate(id, name, inventoryItem);

    /*console.log(1);
    setTodos((prev) =>
      prev.map((item) => (item.key === key ? { ...item, name: "Jake" } : item))
    );
  };
  */

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
      { params: { id: key } },
      null
    );

    if (res.data === 1) {
      console.log("Элемент удалён");
    } else {
      console.log("Элемент не удалён");
    }
  };

  const handleUpdate = async (e, id, col, colVal) => {
    e.preventDefault();
    const api = `http://localhost:8080/api/v1/moderator/updateInventoryItemCell`;
    const res = await setInterceptors.put(api, null, {
      params: {
        id: id,
        col: col,
        colVal: colVal,
      },
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
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
    const getCategories = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/categories`;

        const res = await setInterceptors.get(api, {
          
        });

        const data = await res.data;
        setCategories(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getInventoryItems = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/inventory`;

        const res = await setInterceptors.get(api, {
          /*headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsaXNhIiwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6Ik1PREVSQVRPUiJ9LHsiYXV0aG9yaXR5IjoiUkVBREVSIn0seyJhdXRob3JpdHkiOiJVU0VSUzpSRUFEIn0seyJhdXRob3JpdHkiOiJVU0VSUzpVUERBVEUifSx7ImF1dGhvcml0eSI6IlVTRVJTOldSSVRFIn1dLCJyb2xlcyI6WyJNT0RFUkFUT1IiLCJSRUFERVIiLCJVU0VSUzpSRUFEIiwiVVNFUlM6VVBEQVRFIiwiVVNFUlM6V1JJVEUiXSwiaWF0IjoxNjUzNDk4NjMyLCJleHAiOjE2NTM0OTg5MzJ9.LuzBJsnxOQ2SYUgho6Y_uqkBxelVsuJ5JJmGunBfsDY`,
          },*/
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
  }, [inventoryItems]);

  return (
    <div className="main">
      {" "}
      <h1>Инвентарь</h1>
      <div className="container">
        <div className="filter-Form">
          <form onSubmit={console.log("Test...")}>
            <div className="input-Container">
              <i className="icon-search"></i>

              <input
                type="text"
                className="search"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onDoubleClick={(e) => handleSearch(e)}
                placeholder="Поиск по словам..."
              ></input>
            </div>
          </form>
        </div>
        <form></form>
      </div>
      {inventoryItems.length ? (
        <div>
          <div className="wrapper" ref={wrapperRef}>
            <div className="headings-first">
              <div>Категория</div>
              <div>Наименование</div>
              <div>Характеристики</div>
              <div>Комментарий</div>
              <div>Комментарий А.М.Чернега</div>
              <div>Действие</div>
            </div>
            {inventoryItems.map((inventoryItem) => (
              <div className="table">
                <div className="headings">
                  <div>Категория</div>
                  <div>Наименование</div>
                  <div>Характеристики</div>
                  <div>Комментарий</div>
                  <div>Комментарий А.М.Чернега</div>
                  <div>Действие</div>
                </div>

                <div className="contents">

                  <div>
                    <option>{inventoryItem.category.name}</option>
                  </div>

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
                        handleUpdate(
                          e,
                          inventoryItem.id,
                          "name",
                          prevInventoryItem.current
                        );
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
                        handleUpdate(
                          e,
                          inventoryItem.id,
                          "specs",
                          prevInventoryItem.current
                        );
                      }}
                    ></textarea>
                  </div>
                  <div>
                    <textarea
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
                          e.target.value
                        );
                      }}
                    ></textarea>
                  </div>

                  <div>
                    <textarea
                      defaultValue={inventoryItem.commentaryChernega}
                      onChange={(e) => {
                        setInventoryItem(e.target.value);
                      }}
                      onClick={() =>
                        (prevInventoryItem.current =
                          inventoryItem.commentaryChernega)
                      }
                      onDoubleClick={(e) => {
                        handleUpdate(
                          e,
                          inventoryItem.id,
                          "commentaryChernega",
                          e.target.value
                        );
                      }}
                    ></textarea>
                  </div>

                  <div>
                    <IconButton
                      onClick={(e) => handleDelete(e, inventoryItem.id)}
                    >
                      <RemoveCircleIcon className="circleRemove"></RemoveCircleIcon>
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}

            {props.children}

            <div className="table">
              <div className="headings">
                <div>Категория</div>
                <div>Наименование</div>
                <div>Характеристики</div>
                <div>Комментарий</div>
                <div>Комментарий А.М.Чернега</div>
                <div>Действие</div>
              </div>

              <form id="addForm" className="contents">
                <div>

                 {categories.map((cat, i) => (
                   <select onChange={() => setCategoryId(i)}>
                     <option>{cat.name}</option>
                   </select> 
                 ))}       

                <select className="dropdown" onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat, i) => (
                  <option onSelect={() => setCategoryId(i)}>{cat.name}</option>
                ))} 
                </select>
                </div>
                <div>
                  <input
                    type="text"
                    className="table-input"
                    onChange={(e) => setName(e.target.value)}
                  ></input>
                </div>
                <div>
                  <input
                    type="text"
                    className="table-input"
                    onChange={(e) => setSpecs(e.target.value)}
                  ></input>
                </div>
                <div>
                  <input
                    type="text"
                    className="table-input"
                    onChange={(e) => setCommentary(e.target.value)}
                  ></input>
                </div>
                <div>
                  <input
                    type="text"
                    className="table-input"
                    onChange={(e) => setCommentaryChernega(e.target.value)}
                  ></input>
                </div>
                <div>
                  <IconButton onClick={(e) => handleCreate(e)}>
                    <AddCircleIcon className="circleAdd"></AddCircleIcon>
                  </IconButton>
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
        <>
          {" "}
          <div>Загрузка элементов инвентаря...</div>
          <div className="table">
            <div className="headings-first">
              <div>Наименование</div>
              <div>Характеристики</div>
              <div>Комментарий</div>
              <div>Действие</div>
            </div>

            <form id="addForm" className="contents">
              <div>
                <input
                  type="text"
                  className="table-input"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
              <div>
                <input
                  type="text"
                  className="table-input"
                  onChange={(e) => setSpecs(e.target.value)}
                ></input>
              </div>
              <div>
                <input
                  type="text"
                  className="table-input"
                  onChange={(e) => setCommentary(e.target.value)}
                ></input>
              </div>
              <div>
                <IconButton onClick={(e) => handleCreate(e)}>
                  <AddCircleIcon className="circleAdd"></AddCircleIcon>
                </IconButton>
              </div>
            </form>
          </div>
          <input type="submit" value="Добавить" className="button"></input>
        </>
      )}
    </div>
  );
};

Inventory.propTypes = {};

export default Inventory;
