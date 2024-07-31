import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/ChatLayout.css";
// import "../assets/styles/Detail.css";

import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

function ChatModal({ setShowChatModal, chatRoom }) {
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [chatText, setChatText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const receiver = chatRoom.member.filter((m) => m !== loginUserInfo.username);
  const chatHistoryRef = useRef(null);
  const [isSending, setIsSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/chat-history/${chatRoom._id}`);
        setChatHistory(response.data);
      } catch (error) {
        console.error("대화 이력 가져오기 실패:", error);
      }
    };

    fetchChatHistory();

    socket.on("new-message", (message) => {
      setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    });

    return () => {
      socket.off("new-message");
      socket.emit("leave-room", chatRoom.roomName);
    };
  }, [chatRoom._id]);

  useEffect(() => {
    const chatHistoryElement = chatHistoryRef.current;
    if (chatHistoryElement) {
      if (!userScrolled) {
        chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
      }
    }
  }, [chatHistory, userScrolled]);

  const handleSendMsg = async () => {
    if (!chatText.trim() || isSending) return;
    setIsSending(true);
    try {
      socket.emit("chat-msg", {
        msg: chatText,
        roomName: chatRoom.roomName,
        parent_id: chatRoom._id,
        sender: loginUserInfo.username,
        receiver: receiver.join(","),
      });
      setChatText("");
    } catch (error) {
      console.error("메시지 전송 오류:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();
      handleSendMsg();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleScroll = () => {
    const chatHistoryElement = chatHistoryRef.current;
    if (chatHistoryElement) {
      const atBottom =
        chatHistoryElement.scrollHeight - chatHistoryElement.scrollTop ===
        chatHistoryElement.clientHeight;
      setUserScrolled(!atBottom);
    }
  };

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
      <div className="modal-chat-area">
        <div
          className="modal-chat-history"
          ref={chatHistoryRef}
          onScroll={handleScroll}
        >
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${
                message.sender === loginUserInfo.username ? "sent" : "received"
              }`}
            >
              <p className="bubble-content">
                <span
                  className={`${
                    message.sender === loginUserInfo.username
                      ? "sent-strong"
                      : "received-strong"
                  }`}
                >
                  {message.sender}
                </span>
                <span>{message.msg}</span>
                <br />
                <span className="bubble-date-info">{message.date}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="modal-input-area">
          <input
            className="modal-send-msg-input"
            type="text"
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <p className="modal-send-msg-btn" onClick={handleSendMsg}>
            <img src="images/submit-btn-icon.png" alt="Send" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
