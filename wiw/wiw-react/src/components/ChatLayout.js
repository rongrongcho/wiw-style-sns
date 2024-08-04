import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import "../assets/styles/ChatLayout.css";
import ChatArea from "./ChatArea";

const socket = io("http://localhost:8080");

function ChatLayout() {
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [myChatList, setMyChatList] = useState([]);
  const [chatRoom, setChatRoom] = useState(null);
  const [info, setInfo] = useState(false);
  const [chatRoomId, setRoomId] = useState(null);
  const [upDate, setUpdate] = useState(false);

  useEffect(() => {
    if (!loginUserInfo) {
      setInfo(true);
      return;
    }

    const getMyChatList = async () => {
      try {
        const response = await axios.get(
          `/chat-list/${loginUserInfo.username}`
        );
        setMyChatList(response.data);
      } catch (error) {
        console.error("채팅 목록을 불러오는데 실패:", error);
      }
    };

    getMyChatList();
    setUpdate(false);
  }, [loginUserInfo, upDate]);

  useEffect(() => {
    socket.on("new-chat-room", (newChatRoom) => {
      setChatRoom(newChatRoom);
    });

    return () => {
      socket.off("new-chat-room");
    };
  }, []);

  function goToChatRoom(room) {
    setRoomId(room._id);
    setChatRoom(room);
  }

  function getChatRoomTitle(chatRoom, username) {
    return chatRoom ? chatRoom.member.filter((m) => m !== username) : [];
  }

  return (
    <div className="chat-container">
      {info ? (
        <div className="need-to-login">
          로그인이 필요한 서비스입니다. 로그인을 완료해주세요!
        </div>
      ) : (
        <>
          <div className="chat-list-area">
            {myChatList.map((room) => (
              <div key={room._id} className="chat-room-menu">
                <a
                  onClick={() => {
                    goToChatRoom(room);
                  }}
                >
                  <p className="chat-room-title">
                    {getChatRoomTitle(room, loginUserInfo.username).join(", ")}
                  </p>
                  <p className="text-preview">
                    {room.textPreview
                      ? room.textPreview.msg
                      : "최신 메시지가 존재하지 않습니다."}
                  </p>
                </a>
              </div>
            ))}
          </div>
          <div className="chat-room-area">
            {chatRoomId ? (
              <div className="chat-area">
                <ChatArea
                  chatRoomId={chatRoomId}
                  chatRoom={chatRoom}
                  setUpdate={setUpdate}
                />
              </div>
            ) : (
              <div className="no-select-room">채팅방을 선택하세요.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ChatLayout;
