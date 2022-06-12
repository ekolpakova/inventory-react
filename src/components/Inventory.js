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
import { Select } from "@mui/material";

//Потестить интерцептор реквеста здесь - должен автоматически передать в реквест токен
const Inventory = (props) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [inventoryItem, setInventoryItem] = useState("");
  const prevInventoryItem = useRef("");

  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [id, setId] = useState();

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
  const [date, setDate] = useState("");

  const [inputs, setInputs] = useState([{ name: "Default" }]);

  const [isEditable, setIsEditable] = useState(true);

  const wrapperRef = useRef();
  const [numChildren, setNumChildren] = useState(0);

  const [param, setParam] = useState("name");
  const [value, setValue] = useState("");

  const prevInventoryItems = useRef([]);

  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    prevInventoryItem.current = inventoryItem;
  }, [inventoryItem]);

  /*useEffect(() => {
    setInventoryItems(
      inventoryItems.filter((item) => item.name.toLowerCase().includes(search))
    );
  }, [search]);*/

  const handleDate = (date) => {
    const tmp = date.getTime();
    const dateParsed = new Date(tmp);
    return dateParsed.toLocaleString("sv");
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    let isMounted = true;
    const controller = new AbortController();

    const api = "http://localhost:8080/api/v1/moderator/searchItem";
    const res = await axios.get(api, {
      params: {
        param: param,
        value: value,
      },
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
      signal: controller.signal,
    });
    console.log(value);
    const data = await res.data;
    console.log("data", data);
    isMounted && setFilteredItems(data);

    return () => {
      isMounted = false;
      controller.abort();
    };
  };

  const handleFilterLive = (e) => {
          setInventoryItems([
            ...inventoryItems.filter((item) => item.category.name !== value),
          ]);
  };

  /*useEffect(() => {
    setInventoryItems(
      //...inventoryItems,
      inventoryItems.filter((item) => item.name.includes(search))
    );
  }, [search]);*/

  const searchItems = (inventoryItems) => {
    return inventoryItems.filter((item) => item.name === "Stephen");
  };

  /*const handleSearch = (e) => {
    e.preventDefault();
    setInventoryItems(
      inventoryItems.filter((item) => item.name.toLowerCase().includes(search))
    );
  };*/

  const handleAddInputs = () => {
    setNumChildren(numChildren + 1);
  };

  const handleCategoryFilter = (e) => {
    e.preventDefault();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const api = `http://localhost:8080/api/v1/moderator/addInventoryItem`;
    const json = JSON.stringify({
      category: { id: categoryId },
      name: name,
      specs: specs,
      commentary: commentary,
      commentaryChernega: commentaryChernega,
    });
    const res = await setInterceptors.post(api, json, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.data;

    setInventoryItems((prev) => [...prev, data]);

    if (res) {
      console.log("Item was created");
      alert("Item was created");
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

  const handleChang = (e, key) => {
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
    let isMounted = true;
    const controller = new AbortController();

    const getCategories = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/categories`;

        const res = await setInterceptors.get(api, {
          signal: controller.signal,
        });

        const data = await res.data;
        console.log(data);
        isMounted && setCategories(data);
        //setCategories(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };

    getCategories();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

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
        isMounted && setInventoryItems(data);
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
  }, []);

  const handleDelete = async (e, key) => {
    e.preventDefault();
    console.log("Delete " + key);

    const api = `http://localhost:8080/api/v1/moderator/deleteInventoryItem`;
    const res = await setInterceptors.delete(
      api,
      { params: { id: key } },
      null
    );

    let isDelete = window.confirm("Удалить запись?");
    alert(isDelete);

    setInventoryItems([...inventoryItems.filter((item) => item.id !== key)]);

    if (res.data === 1) {
      console.log("Элемент удалён");
    } else {
      console.log("Элемент не удалён");
    }
  };

  return (
    <div className="main">
      {" "}
      <h1>Инвентарь</h1>
      <form onSubmit={(e) => handleFilter(e)}>
        <div>
          <div className="input-Container">
            <i className="icon-search"></i>
            <input
              type="text"
              className="search"
              onChange={(e) => setValue(e.target.value)}
              placeholder="Поиск по наименованию..."
              value={value}
            ></input>
            <input
              type="submit"
              value="Найти"
              className="button buttonFilter"
            ></input>
          </div>
        </div>
      </form>
      <div className="container">
        <div className="filter-Form">
          <form>
            <div className="input-Container">
              <i className="icon-search"></i>

              <input
                type="text"
                className="search"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                //onDoubleClick={(e) => handleSearch(e)}
                placeholder="Поиск по словам..."
              ></input>
            </div>
          </form>
        </div>
        <form></form>
      </div>
      {filteredItems.length === 0 && inventoryItems.length > 0 ? (
        <div>
          <div className="wrapper" ref={wrapperRef}>
            <div className="headings-first">
              <div>№ п/п</div>
              <div>Категория</div>
              <div>Наименование</div>
              <div>Характеристики</div>
              <div>Комментарий</div>
              <div>Комментарий А.М.Чернега</div>
              <div>Дата принятия к учёту</div>
              <div>Действие</div>
            </div>

            {inventoryItems.map((inventoryItem, idx) => (
              <div className="table" key={idx}>
                <div className="headings">
                  <div>№ п/п</div>
                  <div>Категория</div>
                  <div>Наименование</div>
                  <div>Характеристики</div>
                  <div>Комментарий</div>
                  <div>Комментарий А.М.Чернега</div>
                  <div>Дата принятия к учёту</div>
                  <div>Действие</div>
                </div>

                <div className="contents">
                  <div>
                    <textarea
                      defaultValue={inventoryItem.id}
                      onChange={(e) => {
                        setInventoryItem(e.target.value);
                      }}
                      onClick={() =>
                        (prevInventoryItem.current = inventoryItem.id)
                      }
                      onDoubleClick={(e) => {
                        handleUpdate(e, inventoryItem.id, "id", e.target.value);
                      }}
                    ></textarea>
                  </div>

                  {inventoryItem.category !== undefined && (
                    <div>
                      <textarea
                        defaultValue={inventoryItem.category.name}
                        onChange={(e) => {
                          setInventoryItem(e.target.value);
                        }}
                        onClick={() =>
                          (prevInventoryItem.current =
                            inventoryItem.category.name)
                        }
                        onDoubleClick={(e) => {
                          handleUpdate(
                            e,
                            {
                              id: inventoryItem.category.id,
                              name: inventoryItem.category.name,
                            },
                            "category",
                            e.target.value
                          );
                        }}
                      ></textarea>
                    </div>
                  )}

                  <div>
                    <textarea
                      key={idx}
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
                          e.target.value
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
                          e.target.value
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
                    <textarea
                      defaultValue={new Date(
                        inventoryItem.dateTaken
                      ).toLocaleDateString("cv")}
                      onChange={(e) => {
                        setInventoryItem(e.target.value);
                      }}
                      onClick={() =>
                        (prevInventoryItem.current = inventoryItem.dateTaken)
                      }
                      onDoubleClick={(e) => {
                        handleUpdate(
                          e,
                          inventoryItem.id,
                          "dateTaken",
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
                  <input
                    type="text"
                    className="table-input"
                    onChange={(e) => setId(e.target.value)}
                  ></input>
                </div>
                <div>
                  <select
                    className="dropdown"
                    name="dropdown"
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.length > 0} ? (
                    {categories.map((cat) => (
                      <option value={cat.id}>{cat.name}</option>
                    ))}
                    )
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
                  <input
                    type="date"
                    className="table-input"
                    onChange={(e) => setDate(e.target.value)}
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
          {filteredItems.map((item) => {
            <div>{item.name}</div>;
          })}
        </>
      )}
      {filteredItems.length > 0 ? (
        <div className="headings-first">
          <div>№ п/п</div>
          <div>Категория</div>
          <div>Наименование</div>
          <div>Характеристики</div>
          <div>Комментарий</div>
          <div>Комментарий А.М.Чернега</div>
          <div>Дата принятия к учёту</div>
          <div>Действие</div>
        </div>
      ) : null}
      {filteredItems.map((inventoryItem, idx) => (
        <>
          <div className="table">
            <div className="headings">
              <div>№ п/п</div>
              <div>Категория</div>
              <div>Наименование</div>
              <div>Характеристики</div>
              <div>Комментарий</div>
              <div>Комментарий А.М.Чернега</div>
              <div>Дата принятия к учёту</div>
              <div>Действие</div>
            </div>
            <div className="contents">
              <div>
                <textarea
                  defaultValue={inventoryItem.id}
                  onChange={(e) => {
                    setInventoryItem(e.target.value);
                  }}
                  onClick={() => (prevInventoryItem.current = inventoryItem.id)}
                  onDoubleClick={(e) => {
                    handleUpdate(e, inventoryItem.id, "id", e.target.value);
                  }}
                ></textarea>
              </div>

              {inventoryItem.category !== undefined && (
                <div>
                  <textarea
                    defaultValue={inventoryItem.category.name}
                    onChange={(e) => {
                      setInventoryItem(e.target.value);
                    }}
                    onClick={() =>
                      (prevInventoryItem.current = inventoryItem.category.name)
                    }
                    onDoubleClick={(e) => {
                      handleUpdate(
                        e,
                        {
                          id: inventoryItem.category.id,
                          name: inventoryItem.category.name,
                        },
                        "category",
                        e.target.value
                      );
                    }}
                  ></textarea>
                </div>
              )}

              <div>
                <textarea
                  key={idx}
                  defaultValue={inventoryItem.name}
                  onChange={(e) => {
                    setInventoryItem(e.target.value);
                  }}
                  onClick={() =>
                    (prevInventoryItem.current = inventoryItem.name)
                  }
                  onDoubleClick={(e) => {
                    handleUpdate(e, inventoryItem.id, "name", e.target.value);
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
                    handleUpdate(e, inventoryItem.id, "specs", e.target.value);
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
                <textarea
                  defaultValue={new Date(
                    inventoryItem.dateTaken
                  ).toLocaleDateString("cv")}
                  onChange={(e) => {
                    setInventoryItem(e.target.value);
                  }}
                  onClick={() =>
                    (prevInventoryItem.current = inventoryItem.dateTaken)
                  }
                  onDoubleClick={(e) => {
                    handleUpdate(
                      e,
                      inventoryItem.id,
                      "dateTaken",
                      e.target.value
                    );
                  }}
                ></textarea>
              </div>

              <div>
                <IconButton onClick={(e) => handleDelete(e, inventoryItem.id)}>
                  <RemoveCircleIcon className="circleRemove"></RemoveCircleIcon>
                </IconButton>
              </div>
            </div>
          </div>
        </>
      ))}{" "}
    </div>
  );
};

Inventory.propTypes = {};

export default Inventory;
