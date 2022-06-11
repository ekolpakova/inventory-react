import axios from "axios";
import { useEffect, useState } from "react";
import useUpdate from "../hooks/useUpdate";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import useSetInterceptors from "../hooks/useSetInterceptors";

const Fix = () => {
    const { handleUpdate, handleDropdown } = useUpdate();
    const [fixes, setFixes] = useState([]);
    const { get } = useGet();
    const { auth } = useAuth();
    const setInterceptors = useSetInterceptors();
    
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
            { fixes.map((fix) => 
            fix.inventoryItems.map((item) => <div className="contents">
                <div>
                   {item.name}
                </div>
                <div>{fix.description}</div>
                <div>
                    {fix.responsiblePerson}
                </div>
                <div>{fix.phone}</div>
            </div> ))
            }
           
        </div>
        </div>
    </div>
};

export default Fix;