import React, { createRef, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import useSetInterceptors from "../hooks/useSetInterceptors";
import { fontSize } from "@mui/system";

const Profile = (props) => {
  const { auth } = useAuth();
  const setInterceptors = useSetInterceptors();
  const [picture, setPicture] = useState(null);
  const profilePicture = useRef();

  const saveProfilePicture = async (e) => {
    setPicture(e.target.files[0]);
    //profilePicture.src = data.url;
  };

  const uploadProfilePicture = async (e) => {
    e.preventDefault();
    const api = "http://localhost:8080/api/v1/public/addUserImage";

    /*const fd = new FormData();
    fd.append("picture", picture)*/

    const res = await setInterceptors.put(
      api,
      { username: auth.username, image: picture },
      {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  const convertToBase64 = (file) => {
    return new Promise((res, rej) => {
      const rd = new FileReader();
      rd.readAsDataURL(file);

      rd.onload = () => {
        res(rd.result);
      };

      rd.onerror = (err) => {
        rej(err);
      }
    });
  
  };

  useEffect(() => {
    const getProfilePicture = async (e) => {
      const api = `http://localhost:8080/api/v1/public/user/image?username=${auth.username}`;
      const res = await setInterceptors.get(api, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.data;

      //await convertToBase64(data);
      //console.log(convertToBase64(data));
     
      //profilePicture.src = "data:image/jpeg;base64, " +  window.btoa(data);
    };

    getProfilePicture();
  });

  return (
    <>
      <h1>Личный кабинет</h1>
      <img
        alt="Фотография профиля"
        id="profile-picture"
        ref={profilePicture}
      ></img>
      <form
        encType="multipart/form-data"
        onSubmit={(e) => uploadProfilePicture(e)}
      >
        <label htmlFor="image">Загрузить фото профиля</label>
        <br />
        <input
          type="file"
          name="image"
          id="image"
          onChange={(e) => saveProfilePicture(e)}
        ></input>
        Загрузить<input type="submit"></input>
      </form>
    </>
  );
};

Profile.propTypes = {};

export default Profile;
