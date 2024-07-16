import React, { useState } from "react";
// import "../assets/styles/LoginSignUp.css";
import { setUser } from "../store/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function Write({}) {
  const dispatch = useDispatch();
  const setUserInfo = useSelector((state) => state.user.user);

  return <div></div>;
}

export default Write;
