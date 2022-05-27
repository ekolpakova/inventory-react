import axios from "axios";
import useGetTokens from "./useGetTokens";
import useGetNewAccessToken from "./useGetNewAccessToken";
import useAuth from "./useAuth";
import { useContext, useEffect } from "react";
import SignIn, { getRefreshToken } from "../components/SignIn";

//configure 2(3) different routes for each role
export const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
});

export const useSetInterceptors = () => {
  const { auth } = useAuth();
  const refresh = useGetNewAccessToken();
  //const signIn = useGetTokens();
  //const refresh = useGetNewAccessToken();
  //const { refresh } = useContext(AuthContext);
  //взять токен из памяти приложения и направить в Bearer перед отправкой запроса

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response) {
          if (
            //error.response.status === 401 &&
            error.response.status === 403 &&
            !prevRequest.sent
          ) {
            prevRequest.sent = true;
            //const newAccessToken = await refresh();
            const res = await instance.get(
              "http://localhost:8080/api/v1/public/getNewAccessToken`",
              {
                withCredentials: true,
                headers: {
                  "Authorization": `Bearer ${getRefreshToken()}`
                },
              }
            );
            const newAccessToken = res.data["access_token"];
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
            return instance(prevRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.request.eject(responseInterceptor);
    };
  }, [auth, refresh]);

  return instance;
};

export default useSetInterceptors;
