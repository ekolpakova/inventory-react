import React, { createContext, useState } from "react";

export const AccessTokenContext = createContext();

export const AccessTokenProvider = (props) => {
  const [accessToken, setAccessToken] = useState([]);
  return (
    <AccessTokenContext.Provider value={[accessToken, setAccessToken]}>
      {props.children}
    </AccessTokenContext.Provider>
  );
};
