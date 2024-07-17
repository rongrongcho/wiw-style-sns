import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import axios from "axios";

function Logout({ setMember }) {
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/logout");
      dispatch(setUser(null));
      setMember(false); // 로그아웃 성공 시 모달 닫기
    } catch (error) {
      console.error("로그아웃 실패", error.response.data);
    }
  };

  return (
    <div className="logout-btn-box">
      <button onClick={handleSubmit}>로그아웃</button>
    </div>
  );
}

export default Logout;
