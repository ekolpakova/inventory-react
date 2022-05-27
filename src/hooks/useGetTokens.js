import axios from "axios";
import { useEffect } from "react";

const useGetTokens = () => {
  const api = `http://localhost:8080/api/v1/public/signIn`;

  console.log("Sign In");

  const signIn = async (username, password, e) => {
    e.preventDefault();
    const access_token = "";

    console.log("Inside");

    const res = await axios.get(api, {
      withCredentials: true,
      params: {
        username: username,
        password: password,
      },
    });
    const data = await res.data;
    access_token = data["access_token"];

    console.log(data);

    return access_token;
  };

  return signIn;
};

export default useGetTokens;


