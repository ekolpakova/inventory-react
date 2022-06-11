import useAuth from "./useAuth";
import axios from "axios";

const useGet = () => {
    const { auth } = useAuth();
    const get = async (api) => {
        const res = await axios.get(api, {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`
            }
        })
        return res.data;
    }
    return { get };
};

export default useGet;