import axios from "axios";
import { useEffect, useState } from "react";
import useUpdate from "../hooks/useUpdate";
import useGet from "../hooks/useGet";
import useAuth from "../hooks/useAuth";
import useSetInterceptors from "../hooks/useSetInterceptors";



const Fix = () => {
  const { handleUpdate, handleDropdown } = useUpdate();

  const [fixes, setFixes] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  const [item, setItem] = useState();
  const [user, setUser] = useState();
  const [fix, setFix] = useState({});

  const [desc, setDesc] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

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
        isMounted && setItems(data);
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

  const handleFileDownload = async (e) => {
    e.preventDefault();
    const api = "http://localhost:8080/api/v1/moderator/createTable";
    const res = axios.get(api, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`
      }
    })
  };


  const handleAddFix = (e) => {
    e.preventDefault();
    const api = "http://localhost:8080/api/v1/moderator/addFix";
    const json = JSON.stringify({
      description: desc,
      phone: phone,
      date: date
    });
    const res = setInterceptors.post(api, json, {
      params: {
        userId: user,
        itemId: item
      },
      headers: {
        Authorization: `Bearer ${auth.accessToken}`
      }
    })


    if(res) console.log("Item was added")
    
  };

  const handleActDownload = async (fix) => {

  }

  return (
    <div className="main">
      <h1>?????? ???????????????? ???????????????????????? ?? ????????????</h1>
      <div className="wrapper">
        <div className="headings-first">
          <div>????????????????????????</div>
          <div>???????????????? ??????????????</div>
          <div>?????????????????????????? ????????</div>
          <div>???????????????????? ??????????????</div>
          <div>????????</div>
          <div>????????????????</div>
        </div>
        
          {fixes.length > 0 && fix !== undefined && fixes.map((fix) =>
              <div className="table">
              <div className="headings">
                <div>????????????????????????</div>
                <div>???????????????? ??????????????</div>
                <div>?????????????????????????? ????????</div>
                <div>???????????????????? ??????????????</div> 
                <div>????????</div>
                <div>????????????????</div>
              </div>  
              <div className="contents">
                { fix !== undefined && fix.inventoryItem !== null && <div contentEditable="true">{fix.inventoryItem.name}</div>}
                { fix !== undefined && fix.inventoryItem === null && <div contentEditable="true"></div>}
                <div
                  contentEditable="true"
                  onChange={(e) => setFix(e.target.value)}
                  onDoubleClick={(e) =>
                    handleUpdate(
                      e,
                      "http://localhost:8080/api/v1/moderator/updateFixCell",
                      fix !== undefined && fix.id,
                      "description",
                      e.target.innerText
                    )
                  }
                >
                  {fix !== undefined && fix.description}
                </div>
                   <div onChange={(e) => setUser(e.target.innerText)}>{fix.inventoryItem !== undefined &&  fix.inventoryItem !== null && fix?.inventoryItem?.responsiblePerson?.username}</div>
                <div
                  contentEditable="true"
                  onDoubleClick={(e) =>
                    handleUpdate(
                      e,
                      "http://localhost:8080/api/v1/moderator/updateFixCell",
                      fix.id,
                      "phone",
                      e.target.innerText
                    )
                  }
                >
                  {fix !== undefined && fix.phone}
                </div>
                { fix !== undefined && <div>{new Date(fix.date).toLocaleDateString("cv")}</div> }
                <div>
                  <button onClick={() => handleActDownload(fix !== undefined && fix)} style={{ borderRadius: '100%', backgroundColor: '#e12a36', color: '#fff', border: 'none' }}>
                    <span className="material-symbols-outlined circleRemove">do_not_disturb_on</span>
                  </button>
                </div>
              </div>
              </div>
            )
          }

        <div className="table">
          <div className="headings">
            <div>????????????????????????</div>
            <div>???????????????? ??????????????</div>
            <div>?????????????????????????? ????????</div>
            <div>???????????????????? ??????????????</div>
            <div>????????</div>
            <div>????????????????</div>
          </div>

          <form id="addForm" className="contents">
            <div>
              <select className="dropdown" onChange={(e) => setItem(e.target.value)}>
                <option>????????????????????????</option>
                { items.map((item) => <option value={item.id}>{item.name}</option>) }
              </select>
            </div>
            <div><input style={{ font: 'inherit', borderRadius: '0.5rem', border: '1px solid #c2c2c2', padding: '0.5rem 1rem' }}
        type="text"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        
      ></input></div>
            
            <div>
              <select className="dropdown" onChange={(e) => setUser(e.target.value)}>
                <option>?????????????????????????? ????????</option>
                { users.map((user) => <option value={user.id}>{user.username}</option> ) }
              </select>
            </div>
            <div>     <input style={{ font: 'inherit', borderRadius: '0.5rem', border: '1px solid #c2c2c2', padding: '0.5rem 1rem' }}
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      ></input></div>
          


<div>
          <input
                    type="date"
                    className="table-input"
                    onChange={(e) => setDate(e.target.value)}
                  ></input>
                </div>



       
            <div>
            <button style={{ borderRadius: '100%', backgroundColor: '#0ead44', color: '#fff', border: 'none' }} onClick={(e) => handleAddFix(e)}>
                  <span className="material-symbols-outlined circleAdd">add_circle</span>
                  </button>
            </div>
          </form>
        </div>
      </div>
      <button className="button" style={{ marginTop: '1rem' }} onClick={(e) => handleFileDownload(e)}>??????????????</button>
    </div>
  );
};

export default Fix;
