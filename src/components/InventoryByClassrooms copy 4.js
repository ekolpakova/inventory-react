import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useSetInterceptors from "../hooks/useSetInterceptors";
import { Grid } from "@mui/material";
import useCRUD from "../hooks/useCRUD";

const InventoryByClassrooms = () => {
  const { auth } = useAuth();
  const setInterceptors = useSetInterceptors();
  const [classrooms, setClassrooms] = useState([]);
  const [classnum, setClassnum] = useState();
  const [categories, setCategories] = useState([]);
  const { handleFilter, filteredItems, setFilteredItems } = useCRUD();
  const [param, setParam] = useState("name");
  const [value, setValue] = useState("");
  //const [inventoryItems, setInventoryItems] = useState([{ category_id: 1 }]);

  const handleFilterLive = (key) => {
    console.log(key);
    setFilteredItems([
      ...filteredItems.filter((item) => item.category.id === key),
    ]);
    console.log(filteredItems);
  };

  const handleSelect = (e, num) => {
    setClassnum(num);
    console.log(classnum);
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
    //let isMounted = false;
    //let controller = new AbortController();
    const getClassrooms = async () => {
      const api = "http://localhost:8080/api/v1/moderator/classrooms";
      const res = await setInterceptors.get(api, {
        //signal: controller.signal,
      });
      const data = await res.data;
      //isMounted && setClassrooms(data);
      setClassrooms(data);
      console.log(data);
    };

    getClassrooms();

    //return () => {
    // isMounted = false;
    // controller.abort();
    //};
  }, []);
  return (
    <div className="main">
      <h1>Инвентарь по кабинетам</h1>
      {classnum === undefined && <h3>Аудитория не выбрана</h3>}
      {classnum !== undefined && <h3>Аудитория выбрана</h3>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "150px 1fr",
          gap: "2rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: "0.5rem",
          }}
        >
          {filteredItems.length === 0 &&
            classrooms.map((classroom) => (
              <>
                <div
                  key={classroom.id}
                  style={{
                    borderRadius: "0.5rem",
                  }}
                >
                  <button
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: "0.5rem",
                      height: "100%",
                    }}
                    onClick={(e) => handleSelect(e, classroom.name)}
                  >
                    {classroom.name}
                  </button>
                </div>
              </>
            ))}
        </div>

        <div
          style={{
            backgroundColor: "aliceblue",
            padding: "1rem",
          }}
        >
          {classnum === undefined && (
            <div>Выберите аудиторию для просмотра оборудования</div>
          )}
          {categories.length > 0}
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              gridTemplateColumns: "150px 1fr",
            }}
          >
            <select
              className="dropdown"
              onChange={(e) => handleFilterLive(e.target.value)}
            >
              {categories.map((cat) => (
                <option value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <form onSubmit={(e) => handleFilter(e, param, value)}>
              <div>
                <div className="input-Container">
                  <i className="icon-search"></i>
                  <input
                    type="text"
                    className="search"
                    placeholder="Инвентарный номер"
                    style={{ background: "#fff" }}
                    onChange={(e) => setValue(e.target.value)}
                  ></input>
                  <input
                    type="submit"
                    value="Найти"
                    className="button buttonFilter"
                  ></input>
                </div>
              </div>
            </form>
          </div>
          {classrooms.length > 0 &&
            filteredItems.length === 0 &&
            classrooms.map((classroom) => (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  backgroundColor: "aliceblue",
                  borderRadius: "0.5rem",
                }}
              >
                {classroom.name === classnum &&
                  classroom.inventoryItems.map((item) => (
                    <div>
                      {" "}
                      <div>{item.name}</div>
                      <div>{item.category.name}</div>
                    </div>
                  ))}
              </div>
            ))}
          {filteredItems.length > 0 &&
            filteredItems.map((item) => (
              <div key={item.id}>
                {" "}
                <div>{item.name}</div>
                <div>{item.category.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryByClassrooms;
