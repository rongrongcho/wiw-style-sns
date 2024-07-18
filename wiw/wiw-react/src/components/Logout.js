import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../store/slices/userSlice"; // logoutUser 액션 import
function Logout({ setMember }) {
  const dispatch = useDispatch();
  const loginUserInfo = useSelector((state) => state.user.userInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/logout");

      dispatch(setUser({ userInfo: null })); // Redux store에서 사용자 정보 초기화
      sessionStorage.removeItem("jwtToken");
      alert("로그아웃 성공");
      setMember(false); // 로그아웃 성공 시 모달 닫기
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("로그아웃 오류 :", error.response.data);
      } else {
        console.error("로그아웃 오류 :", error.message);
      }
    }
  };

  return (
    <div className="logout-btn-box">
      <button onClick={handleSubmit}>로그아웃</button>
    </div>
  );
}

export default Logout;
