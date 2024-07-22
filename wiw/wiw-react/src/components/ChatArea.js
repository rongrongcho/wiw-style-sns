import React, { useState, useEffect } from "react";
import "../assets/styles/ChatArea.css";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8080");
function ChatArea({ chatRoomId, chatRoom, setUpdate }) {
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [chatText, setChatText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const receiver = chatRoom.member.filter((m) => m !== loginUserInfo.username);
  useEffect(() => {
    // 대화 가져오기
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/chat-history/${chatRoomId}`);
        setChatHistory(response.data);
      } catch (error) {
        console.error("대화 이력 가져오기 실패:", error);
      }
    };

    fetchChatHistory();

    // 새로운 메시지를 받을 때
    socket.on("new-message", (message) => {
      setChatHistory((prevChatHistory) => [...prevChatHistory, message]);
    });
    setUpdate(true);

    // 소켓 연결끊기
    return () => {
      socket.off("new-message");
      socket.emit("leave-room", chatRoom.roomName);
    };
  }, [chatHistory]);

  const handleSendMsg = async () => {
    try {
      socket.emit("chat-msg", {
        msg: chatText,
        roomName: chatRoom.roomName,
        parent_id: chatRoom._id,
        sender: loginUserInfo.username,
        receiver: receiver.join(","), // 배열 -> string
      });

      // 채팅 텍스트 비우기
      setChatText("");
    } catch (error) {
      console.error("메시지 전송 오류:", error);
    }
  };

  return (
    <div>
      <div className="chat-history">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === loginUserInfo.username ? "sent" : "received"
            }`}
          >
            <strong>{message.sender}:</strong> {message.msg}
          </div>
        ))}
      </div>

      <div>
        <input
          className="send-msg-input"
          type="text"
          value={chatText}
          onChange={(e) => setChatText(e.target.value)}
        />
        <button className="send-msg-btn" onClick={handleSendMsg}>
          전송
        </button>
      </div>
    </div>
  );
}

export default ChatArea;
