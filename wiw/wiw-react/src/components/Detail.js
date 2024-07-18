import React from "react";
import "../assets/styles/Detail.css";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";

function Detail({ post, setDetailModal }) {
  const setUserInfo = useSelector((state) => state.user.user);
  return (
    <div className="detail-modal">
      <p
        className="close-btn"
        onClick={() => {
          setDetailModal(false);
        }}
      >
        <img src="/images/close-btn.png" alt="모달창 닫기 버튼" />
      </p>
    </div>
  );
}

export default Detail;
