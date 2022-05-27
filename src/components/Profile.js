import React, { createRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const Profile = (props) => {
  const profilePicture = createRef();

  const saveProfilePicture = async (e) => {
    const api = "";
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(api, {
      data: formData,
    });
    const data = res.data;

    profilePicture.src = data.url;
  };
  return (
    <>
      <h1>Profile Page</h1>
      <img
        alt="Profile Picture"
        id="profile-picture"
        ref={profilePicture}
      ></img>
      <form encType="multipart/form-data" onSubmit={(e) => saveProfilePicture(e)}>
        <label htmlFor="image">Загрузить фото профиля</label>
        <br />
        <input
          type="file"
          name="image"
          id="image"
        ></input>
        Загрузить<input type="submit"></input>
      </form>
    </>
  );
};

Profile.propTypes = {};

export default Profile;
