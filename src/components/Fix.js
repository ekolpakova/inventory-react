import axios from "axios";
import { useEffect, useState } from "react";
import useUpdate from "../hooks/useUpdate";

const Fix = () => {
    const { handleUpdate, handleDropdown } = useUpdate();
    const [fixes, setFixes] = useState([]);

    useEffect(() => {
        
    });

    return <div className="main">
        <h1>Акт передачи оборудования в ремонт</h1>
        <div className="wrapper">
            <div className="headings-first">
                <div>Наименование</div>
                <div>Описание поломки</div>
                <div>Ответственное лицо</div>
                <div>Контактный телефон</div>
            </div>
            <div className="table">
            <div className="headings">
                <div>Наименование</div>
                <div>Описание поломки</div>
                <div>Ответственное лицо</div>
                <div>Контактный телефон</div>
            </div>
            <div className="contents">
                <div>
                    <select className="dropdown" onChange={(e) =>
                          handleDropdown(
                            `http://localhost:8080/api/v1/moderator/inventoryDTO/`,
                            e.target.value
                          )
                        }>
                        <option>1</option>
                    </select>
                </div>
                <div>Описание</div>
                <div>
                    <select className="dropdown">
                        <option>А.А. Афанасьева</option>
                    </select>
                </div>
                <div>123456789</div>
            </div>
        </div>
        </div>
    </div>
};

export default Fix;