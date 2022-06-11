import axios from "axios";
import { useEffect, useState } from "react";
import useUpdate from "../hooks/useUpdate";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import useSetInterceptors from "../hooks/useSetInterceptors";

import { IconButton } from "@material-ui/core";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

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

  const handleAddFix = () => {

  }

    return <div className="main">
        <h1>Акт передачи оборудования в ремонт</h1>
        <div className="wrapper">
            <div className="headings-first">
                <div>Наименование</div>
                <div>Описание поломки</div>
                <div>Ответственное лицо</div>
                <div>Контактный телефон</div>
                <div>Действие</div>
            </div>
            <div className="table">
            <div className="headings">
                <div>Наименование</div>
                <div>Описание поломки</div>
                <div>Ответственное лицо</div>
                <div>Контактный телефон</div>
                <div>Действие</div>
            </div>
            { fixes.map((fix) => 
            fix.inventoryItems.map((item) => <div className="contents">
                <div contentEditable="true">
                   {item.name}
                </div>
                <div contentEditable="true" onDoubleClick={(e) => handleUpdate(e, "http://localhost:8080/api/v1/moderator/updateFixCell", fix.id, "description", e.target.innerText)}>{fix.description}</div>
                <div>
                    {fix.responsiblePerson}
                </div>
                <div contentEditable="true" onDoubleClick={(e) => handleUpdate(e, "http://localhost:8080/api/v1/moderator/updateFixCell", fix.id, "phone", e.target.innerText)}>{fix.phone}</div>
                <div>
                  <IconButton>
                    <RemoveCircleIcon className="circleRemove"></RemoveCircleIcon>
                  </IconButton>
                </div>
            </div> ))
            }
           
        </div>

        <div className="table">
              <div className="headings">
                <div>Наименование</div>
                <div>Описание поломки</div>
                <div>Ответственное лицо</div>
                <div>Контактный телефон</div>
                <div>Действие</div>
              </div>

              <form id="addForm" className="contents">
                <div><select className="dropdown"><option>1</option></select></div>
                <div contentEditable="true" onChange={() => handleAddFix()}></div>
                <div><select className="dropdown"><option>2</option></select></div>
                <div contentEditable="true"></div>
                <div>
                  <IconButton>
                    <AddCircleIcon className="circleAdd"></AddCircleIcon>
                  </IconButton>
                </div>
              </form>
            </div>

        </div>
    </div>
};

export default Fix;