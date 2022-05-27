import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useGetNewAccessToken from "../hooks/useGetNewAccessToken";
import useAuth from "../hooks/useAuth";

const RememberMe = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useGetNewAccessToken();
    const { auth, rememberMe } = useAuth();

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.log(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth.accessToken && rememberMe ? verifyRefreshToken() : setIsLoading(false);

        return () => isMounted = false;
    }, [])

      useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`);
        console.log(`ROLES: ${JSON.stringify(auth?.roles)}`)
      }, [isLoading]);

      return (
         <>
         {
             !rememberMe
                ? <Outlet />
                : isLoading
                    ? <p>Загрузка...</p>
                    : <Outlet />
         }
         </>
      )
}

export default RememberMe;