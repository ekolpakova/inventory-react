import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useSetInterceptors from "../hooks/useSetInterceptors";

const InventoryByClassrooms = () => {
  const auth = useAuth();
  const setInterceptors = useSetInterceptors();
  const [classrooms, setClassrooms] = useState([]);

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
      <div className="wrapper">
        {classrooms.length > 0}
        {classrooms.map((classroom) => (
          <div className="table">
            <div>
              <div>{classroom.name}</div>
              <ul>
              {classroom.inventoryItems.map((item) => (
                <li>{item.name}</li>
              ))}</ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryByClassrooms;
