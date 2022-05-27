const signIn = async (e, username, password) => {
  e.preventDefault();
  const result = await getTokens(username, password);

  if (result) {
    console.log("User has signed in");
  }
};

const isModerator = async (e) => {
  e.preventDefault();
  const result = await getAccessTokenAuthorities();

  if (result) {
    console.log("User is moderator");
    setModerator(true);
  }
};

const getTokens = async (username, password) => {
  const api = `http://localhost:8080/api/v1/public/signIn?username=${username}&password=${password}`;

  const res = await instance.get(api, {
    withCredentials: true,
    params: {
      username: username,
      password: password,
    },
  });
  const data = await res.data;

  setAccessToken(data["access_token"]);
  //setRefreshToken(data["refresh_token"]);

  console.log(data);
  console.log(accessToken);

  //return accessToken, refreshToken;
  navigate(from, { replace: true });
  return data["access_token"];
};

const getAccessTokenAuthorities = async () => {
  const api = `http://localhost:8080/api/v1/public/getAccessTokenAuthorities`;

  const res = await instance.get(api, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.data;

  //switch case for 3 roles?
  const check = data.filter((item) => item.toString() === "MODERATOR");
  if (check.length > 0) setModerator(true);

  console.log(moderator);

  return moderator;
};

const refresh = async () => {
  const api = `http://localhost:8080/api/v1/public/getNewAccessToken`;
  const res = await axios.get(api);
  const data = await res.data;
  const accessToken = data;
  setAccessToken(accessToken);
  return accessToken;
};
