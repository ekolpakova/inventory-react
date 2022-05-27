import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Items from "./Items";
import Item from "./Item";

const Table = ({ title }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await getInventoryItems();
      setItems(items);
    };

    fetchItems();
  }, []);

  // Fetch Inventory Items
  const getInventoryItems = async () => {
    const res = await fetch("http://localhost:8080/api/v1/moderator/inventory");
    const data = await res.json();
    return data;
  };

  const getInventoryItem = async () => {
    const res = await fetch(
      "http://localhost:8080/api/v1/moderator/inventoryItemById/${id}"
    );
    const data = await res.json();
    return data;
  };

  return (
    <div>
      <h1>{title}</h1>
      <div className="container">
        <form method="GET">
          <div className="input_container">
            <i className="icon-search"></i>
            <input
              type="text"
              className="search"
              placeholder="Поиск по словам..."
            ></input>
          </div>
        </form>
        <div className="items_wrapper">
          <div className="item">
            <div className="headings">
              <div>Название</div>
              <div>Характеристики</div>
            </div>
            <div className="contents">
              <div>No name here...</div>
              <div>No specs here...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Table.propTypes = {
  title: PropTypes.string,
};

export default Table;
