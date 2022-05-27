import { useAuth } from "../context/AuthProvider";
import axios from "axios";

export const useRoles = () => {
  const api = "http://localhost:8080/api/v1/public/getAccessTokenAuthorities";

  const getRoles = async () => {
    const res = await axios.get(api, {
      withCredentials: true,
    });
    const roles = await res.data;
  };

  return getRoles;
};

export default useRoles;
