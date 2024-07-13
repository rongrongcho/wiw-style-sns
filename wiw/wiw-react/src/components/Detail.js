import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../assets/styles/Detail.css";

function Detail({ setModal }) {
  return (
    <div className="detail-modal">
      <p
        className="close-btn"
        onClick={() => {
          setModal(false);
        }}
      >
        <img src="/images/close-btn.png" alt="모달창 닫기 버튼" />
      </p>
    </div>
  );
}

export default Detail;
