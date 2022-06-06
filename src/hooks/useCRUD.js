import axios from "axios";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import useSetInterceptors from "../hooks/useSetInterceptors";

const useCRUD = () => {
  const { auth } = useAuth();
  const [value, setValue] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const setInterceptors = useSetInterceptors();

  const handleFilter = async (e, param, value) => {
    e.preventDefault();
    console.log(value);
    let isMounted = true;
    const controller = new AbortController();

    const api = "http://localhost:8080/api/v1/moderator/searchItem";
    const res = await setInterceptors.get(api, {
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

  return { handleFilter, filteredItems, setFilteredItems };
};

export default useCRUD;
