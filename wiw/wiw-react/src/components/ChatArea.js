import React, { useState, useEffect, useRef } from "react";
import "../assets/styles/ChatArea.css";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

function ChatArea({ chatRoomId, chatRoom, setUpdate }) {
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [chatText, setChatText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const receiver = chatRoom.member.filter((m) => m !== loginUserInfo.username);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/chat-history/${chatRoomId}`);
        setChatHistory(response.data);
      } catch (error) {
        console.error("대화 이력 가져오기 실패:", error);
      }
    };

    fetchChatHistory();

    const handleNewMessage = (message) => {
      setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.emit("leave-room", chatRoom.roomName);
    };
  }, [chatRoomId, chatRoom.roomName, setUpdate]);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

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
      e.preventDefault(); // 기본 동작 방지
      handleSendMsg();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="chat-area">
      <div className="chat-history" ref={chatHistoryRef}>
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

      <div className="bubble-input-area">
        <input
          className="send-msg-input"
          type="text"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <p className="send-msg-btn" onClick={handleSendMsg}>
          <img src="images/submit-btn-icon.png" alt="Send" />
        </p>
      </div>
    </div>
  );
}

export default ChatArea;
