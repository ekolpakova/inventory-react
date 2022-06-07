import axios from "axios";
import { useAuth } from "../context/AuthProvider";

export const useGetNewAccessToken = () => {
  const { auth, setAuth } = useAuth();

  const api = `http://localhost:8080/api/v1/public/getNewAccessToken`;

  const refresh = async () => {
    const res = await axios.get(api, {
      withCredentials: true
    });

    const data = await res.data;

    //const roles = data["roles"][0];

    setAuth({ roles });

    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      //console.log(data["access_token"]);
      return {
        ...prev,
        //accessToken: data["access_token"],
        //roles: data["roles"][0],
        //id: data["id"],
        //username: data["username"]
      };
    });

    //return data["access_token"], data["roles"][0], data["id"]
  };
  return refresh;
};

export default useGetNewAccessToken;
