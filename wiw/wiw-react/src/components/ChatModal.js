import React, { useState, useEffect } from "react";
import "../assets/styles/Detail.css";
import EditPost from "./EditPost";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
const socket = io("http://localhost:8080");

function ChatModal({ setShowChatModal, chatRoom }) {
  return (
    <div className="detail-modal">
      <p
        className="close-btn"
        onClick={() => {
          setShowChatModal(false);
        }}
      >
        <img src="/images/close-btn.png" alt="모달창 닫기 버튼" />
      </p>

      <div>
        <input className="msg" type="text" />
      </div>
    </div>
  );
}

export default ChatModal;
