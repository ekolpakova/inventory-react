import useSetInterceptors from "./useSetInterceptors";
import useAuth from "./useAuth";

const useUpdate = () => {
    const setInterceptors = useSetInterceptors();
    const { auth } = useAuth();
    
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
        //const api = `http://localhost:8080/api/v1/moderator/inventoryDTO/${itemId}`;
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

      return { handleUpdate, handleDropdown };
    
}

export default useUpdate;