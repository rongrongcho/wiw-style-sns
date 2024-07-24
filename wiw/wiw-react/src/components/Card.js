import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../assets/styles/Card.css";
import Detail from "./Detail";
import ChatModal from "./ChatModal";
import io from "socket.io-client";
const socket = io("http://localhost:8080");

function Card({ post, getHashTag, setStopFetch }) {
  const [showDetailModal, setDetailModal] = useState(false);
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const postUsername = post.username;
  const [liked, setLiked] = useState(false);
  const likedBtn = "/images/scrap-on-btn.png";
  const unlikedBtn = "/images/scrap-off-btn.png";
  const [cLayoutKey, setCLayoutKey] = useState(0);
  const btnImage = liked ? likedBtn : unlikedBtn;
  // 채팅 기능을 위한 상태 변수
  const [chatRoom, setChatRoom] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false); // 여기 수정
  useEffect(() => {
    if (loginUserInfo && loginUserInfo.username) {
      setLiked(post.likes.includes(loginUserInfo.username));
    }
  }, [loginUserInfo]);

  useEffect(() => {
    setCLayoutKey((prevKey) => prevKey + 1);
  }, [setLiked]);

  const hashtags = post.hashtags.map((hashtag, index) => (
    <span key={index} className="hash-tag" onClick={() => getHashTag(hashtag)}>
      #{hashtag}
    </span>
  ));

  const handleChatRoom = async () => {
    try {
      if (!loginUserInfo || !loginUserInfo.username) {
        alert("로그인이 필요한 기능입니다.");
        return;
      } else if (loginUserInfo.username === postUsername) {
        alert("본인에게 메시지를 전송할 수 없습니다.");
        return;
      }
      const response = await axios.post("/chatroom", {
        loginUsername: loginUserInfo.username,
        postUsername: postUsername,
      });
      console.log("채팅방 생성 성공", response.data.chatroom.roomName);
      setChatRoom(response.data.chatroom);
      socket.emit("ask-join", response.data.chatroom.roomName);
      setShowChatModal(true);
    } catch (error) {
      console.error("채팅방 입장 실패: ", error);
    }
  };

  const handleLikes = async () => {
    try {
      if (!loginUserInfo || !loginUserInfo.username) {
        alert("로그인이 필요한 기능입니다.");
        return;
      } else if (loginUserInfo.username === post.username) {
        alert("본인 게시글입니다. 좋아요를 누를 수 없습니다!");
        return;
      } else {
        const response = await axios.post("/addLikes", {
          username: loginUserInfo.username,
          postId: post._id,
        });
        setLiked(!liked);
        setStopFetch(false);
        console.log(response.data);
      }
    } catch (error) {
      console.error("좋아요 요청 실패:", error);
    }
  };

  return (
    <div className="card-box">
      <a>
        <p
          className="card-img-box"
          onClick={() => {
            setDetailModal(true);
          }}
        >
          <img
            className="card-img"
            src={post.images[0].url}
            alt="카드 이미지"
          />
        </p>
      </a>
      <div className="card-content-box">
        <p className="user-info">@{post.username}</p>
        <p className="scrap-btn">
          <span className="scrap-cout-text">{post.likes.length}</span>
          <br />
          <img src={btnImage} onClick={handleLikes} alt="좋아요 버튼" />
        </p>
        <p className="chat-btn" onClick={handleChatRoom}>
          <img src="images/chat-btn.png" alt="채팅 버튼" />
        </p>
        <div className="hash-tag-box">{hashtags}</div>
      </div>
      {showDetailModal && (
        <Detail
          key={cLayoutKey}
          post={post}
          setDetailModal={setDetailModal}
          setLiked={setLiked}
          handleLikes={handleLikes}
          hashtags={hashtags}
          chatRoom={chatRoom}
          setShowChatModal={setShowChatModal}
          setStopFetch={setStopFetch}
        />
      )}
      {showChatModal && (
        <ChatModal
          chatRoom={chatRoom}
          setShowChatModal={setShowChatModal}
          showChatModal={showChatModal}
          handleChatRoom={handleChatRoom}
        />
      )}
    </div>
  );
}

export default Card;
