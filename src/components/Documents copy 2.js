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

  const [contracts, setContracts] = useState([]);
  const [sourcesOfFunds, setSourcesOfFunds] = useState([]);

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

    console.log(1);
    setTodos((prev) =>
      prev.map((item) => (item.key === key ? { ...item, name: "Jake" } : item))
    );
  };
*/

  const handleChang = (e, key) => {
    e.preventDefault();
    console.log("Test II");

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
     const json = JSON.stringify({
       id: id,
       col: col,
       category: { id: colVal }
     });
    const res = await setInterceptors.put(api, json, {
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

    const getContracts = async () => {
      try {
        const api = `http://localhost:8080/api/v1/moderator/contracts`;

        const res = await setInterceptors.get(api, {
          signal: controller.signal,
        });

        const data = await res.data;
        isMounted && setContracts(data);
        //setCategories(data);
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
  });

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
        <form></form>
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
          </div>
          {contracts.map((con) =>
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
                </div>
                <div className="contents">
                  <div style={{ display: "grid" }}>
                    <select
                      style={{ marginBottom: "1rem" }}
                      className="dropdown"
                    >
                      <option value={con.id}>{con.name}</option>
                    </select>
                    <select className="dropdown" onChange={(e) => handleUpdate(e, i.id, "contract",  { id: e.target.value } )}>
                      {contracts.map((c) => (
                        <option value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: "grid" }}>
                    <select
                      style={{ marginBottom: "1rem" }}
                      className="dropdown"
                    >
                      <option value={i.sourceOfFunds.id}>
                        {i.sourceOfFunds.name}
                      </option>
                    </select>
                    <select className="dropdown">
                      {sourcesOfFunds.map((s) => (
                        <option value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>{i.responsiblePerson.username}</div>
                  <div>{i.serialNumber}</div>
                  {i.boughtByRequest === true && <div>Да</div>}
                  {i.given === true && <div>Да</div>}
                  {i.boughtByRequest === false && <div>Нет</div>}
                  {i.given === false && <div>Нет</div>}
                  <div>{i.numberInClassroom}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

Inventory.propTypes = {};

export default Inventory;
