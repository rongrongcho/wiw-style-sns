import React, { useState } from "react";
// import "../assets/styles/LoginSignUp.css";
import { setUser } from "../store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function Logout({ setMember }) {
  const dispatch = useDispatch();
  const setUserInfo = useSelector((state) => state.user.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/logout");
      dispatch(setUser(null));
      setMember(false);
    } catch (error) {
      console.error("로그인 실패", error.response.data);
    }
  };
  return (
    <div>
      <button onClick={handleSubmit}>로그아웃</button>
    </div>
  );
}

export default Logout;
