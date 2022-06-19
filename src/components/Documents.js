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
  const [filteredItems, setFilteredItems] = useState([]);
  const [inventoryItem, setInventoryItem] = useState("");
  const prevInventoryItem = useRef("");
  const [isChecked, setIsChecked] = useState(false);

  const [categories, setCategories] = useState([]);

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

  const [param, setParam] = useState("name");
  const [value, setValue] = useState("");

  const [users, setUsers] = useState([]);
  const [fixes, setFixes] = useState([]);

  const [contracts, setContracts] = useState([]);
  const [sourcesOfFunds, setSourcesOfFunds] = useState([]);

  const [byReq, setByReq] = useState(false);

  const prevInventoryItems = useRef([]);

  const [values, setValues] = React.useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  useEffect(() => {
    const handleChecked = (checked) => {
      if(checked) setIsChecked(true)
      else setIsChecked(false)
    };
    return handleChecked;
  }, [isChecked])

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
  
  const searchItems = (inventoryItems) => {
    return inventoryItems.filter((item) => item.name === "Stephen");
  };

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

  const handleUpdate = async (e, id, col, colVal) => {
    e.preventDefault();
    console.log("id", id);
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

  const handleDropdown = async (api, id) => {
     const json = JSON.stringify({
       id: id
     });
    const res = await setInterceptors.put(api, json, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    });
    const data = await res.data;

    console.log({ id });

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

    const getContracts = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/contracts`;

        const res = await setInterceptors.get(api, {
          signal: controller.signal,
        });

        const data = await res.data;
        isMounted && setContracts(data);
        console.log("contracts" + data);
      } catch (err) {
        console.log(err);
      }
    };

    getContracts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getSourcesOfFunds = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/sourcesOfFunds`;

        const res = await setInterceptors.get(api, {
          signal: controller.signal,
        });

        const data = await res.data;
        console.log(data);
        isMounted && setSourcesOfFunds(data);
      } catch (err) {
        console.log(err);
      }
    };

    getSourcesOfFunds();

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
  }, []);

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
      <h1>Документы</h1>
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
                placeholder="Поиск по словам..."
              ></input>
            </div>
          </form>
        </div>
      </div>
      <div>
        <div className="wrapper">
          <div className="headings-first">
            <div>Договор</div>
            <div>ИФО</div>
            <div>Ответственное лицо</div>
            <div>Инвентарный номер</div>
            <div>Выдано</div>
            <div>Куплено по заявке</div>
            <div>Номер в кабинете</div>
            <div>Действие</div>
          </div>
          {contracts.inventoryItems !== undefined > 0 &&
            contracts.map((con) =>
              con.inventoryItems.map((i) => (
                <div className="table">
                  <div className="headings">
                    <div>Договор</div>
                    <div>ИФО</div>
                    <div>Ответственное лицо</div>
                    <div>Инвентарный номер</div>
                    <div>Выдано</div>
                    <div>Куплено по заявке</div>
                    <div>Номер в кабинете</div>
                    <div>Действие</div>
                  </div>
                  <div className="contents">
                    <div style={{ display: "grid"}}>
                      <div style={{ padding: "0 0 0.5rem 0.5rem", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', zIndex: '10000', backgroundColor: '#fff'}} className="text_holder">
                        {con.name}
                      </div>
                      <select
                        className="dropdown"
                        onChange={(e) =>
                          handleDropdown(
                            `http://localhost:8080/api/v1/moderator/inventoryDTO/${i.id}`,
                            e.target.value
                          )
                        }
                      >
                        <option>Договор</option>
                        {contracts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "grid" }}>
                      <div style={{ padding: "0 0 0.5rem 0.5rem" }}>
                        {i.sourceOfFunds.name}
                      </div>
                      {sourcesOfFunds.length > 0 && (
                        <select
                          className="dropdown"
                          onChange={(e) =>
                            handleDropdown(
                              `http://localhost:8080/api/v1/moderator/sourcesOfFunds/inventoryDTO/${i.id}`,
                              e.target.value
                            )
                          }
                        >
                          <option>ИФО</option>
                          {sourcesOfFunds.map((s) => (
                            <option value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div style={{ display: "grid" }}>
                      <div style={{ padding: "0 0 0.5rem 0.5rem" }}>
                        {i?.responsiblePerson?.username}
                      </div>
                      {users.length > 0 && (
                        <select
                          className="dropdown"
                          onChange={(e) =>
                            handleDropdown(
                              `http://localhost:8080/api/v1/moderator/sourcesOfFunds/inventoryDTO/${i.id}`,
                              e.target.value
                            )
                          }
                        >
                          <option>Ответственное лицо</option>
                          {users.map((u) => (
                            <option value={u.id}>{u.username!==undefined && u.username}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div>
                      {" "}
                      <textarea
                        defaultValue={i.serialNumber}
                        onChange={(e) => {
                          setInventoryItem(e.target.value);
                        }}
                        onDoubleClick={(e) => {
                          handleUpdate(e, i.id, "serialNumber", e.target.value);
                        }}
                      ></textarea>
                    </div>
                    {i.boughtByRequest === true && (
                      <div>
                        {" "}
                        <input type="checkbox" checked={true}></input>
                      </div>
                    )}
                    {i.given === true && (
                      <div>
                        {" "}
                        <input type="checkbox" checked={true}></input>
                      </div>
                    )}
                    {i.boughtByRequest === false && (
                      <div>
                        {" "}
                        <input type="checkbox" checked={false}></input>
                      </div>
                    )}
                    {i.given === false && (
                      <div>
                        {" "}
                        <input type="checkbox" checked={false}></input>
                      </div>
                    )}
                    <div>
                      <textarea
                        defaultValue={i.numberInClassroom}
                        onDoubleClick={(e) => {
                          handleUpdate(
                            e,
                            i.id,
                            "numberInClassroom",
                            e.target.value
                          );
                        }}
                      ></textarea>
                    </div>
                    <div>
                    <button style={{ borderRadius: '100%', backgroundColor: '#e12a36', color: '#fff', border: 'none' }}
                      onClick={(e) => handleDelete(e, inventoryItem.id)}
                    >
                      <span className="material-symbols-outlined circleRemove">do_not_disturb_on</span>
                    </button>
                  </div>
                  </div>
                </div>
              ))
            )}

<div className="table">
          <div className="headings">
            <div>Договор</div>
            <div>ИФО</div>
            <div>Ответственное лицо</div>
            <div>Инвентарный номер</div>
            <div>Выдано</div>
            <div>Куплено по заявке</div>
            <div>Номер в кабинете</div>
            <div>Действие</div>
          </div>

          <form id="addForm" className="contents">
         
       <div><select
                        className="dropdown"
                        onChange={(e) =>
                          handleDropdown(
                            `http://localhost:8080/api/v1/moderator/inventoryDTO/`,
                            e.target.value
                          )
                        }
                      >
                        <option>Договор</option>
                        {contracts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select></div>
                      <div><select
                          className="dropdown"
                          onChange={(e) =>
                            handleDropdown(
                              `http://localhost:8080/api/v1/moderator/sourcesOfFunds/inventoryDTO/`,
                              e.target.value
                            )
                          }
                        >
                          <option>ИФО</option>
                          {sourcesOfFunds.map((s) => (
                            <option value={s.id}>{s.name}</option>
                          ))}
                        </select></div>
                        <div><select
                          className="dropdown"
                          onChange={(e) =>
                            handleDropdown(
                              `http://localhost:8080/api/v1/moderator/sourcesOfFunds/inventoryDTO/`,
                              e.target.value
                            )
                          }
                        >
                          <option>Ответственное лицо</option>
                          {users.map((u) => (
                            <option value={u.id}>{u.username!==undefined && u.username}</option>
                          ))}
                        </select></div>
                        <div><input type="text" style={{ font: 'inherit', borderRadius: '0.5rem', border: "1px solid rgb(194, 194, 194)", padding: '0.5rem 1rem', width: '100%'  }}></input></div>
                        <div><input type="checkbox"></input></div>
                        <div><input type="checkbox"></input></div>
                        <div><input type="text" style={{ font: 'inherit', borderRadius: '0.5rem', border: "1px solid rgb(194, 194, 194)", padding: '0.5rem 1rem', width: '100%' }}></input></div>
            <div>
            <button style={{ borderRadius: '100%', backgroundColor: '#0ead44', color: '#fff', border: 'none' }} >
                  <span className="material-symbols-outlined circleAdd">add_circle</span>
                  </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

Inventory.propTypes = {};

export default Inventory;
