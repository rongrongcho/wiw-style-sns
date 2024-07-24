import React, { useState, useEffect } from "react";
import "../assets/styles/Detail.css";
import EditPost from "./EditPost";
import ChatModal from "./ChatModal";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
const socket = io("http://localhost:8080");

function Detail({ post, setDetailModal, handleLikes, hashtags, setStopFetch }) {
  const [currentImgIdx, setcurrentImgIdx] = useState(0);
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const images = post.images || []; // images 기본값 빈 배열 설정
  const postUsername = post.username;
  const [liked, setLiked] = useState(false);
  const likedBtn = "/images/scrap-on-btn.png";
  const unlikedBtn = "/images/scrap-off-btn.png";
  const btnImage = liked ? likedBtn : unlikedBtn;
  const [editModal, setEditModal] = useState(false);
  const [postMaster, setPostMaster] = useState(false); // false 로그인한 유저의 게시글 x
  // 채팅 기능 구현
  const [chatRoom, setChatRoom] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false); // 여기 수정
  useEffect(() => {
    if (loginUserInfo && loginUserInfo.username) {
      setLiked(post.likes.includes(loginUserInfo.username));
    }
    if (
      loginUserInfo &&
      loginUserInfo.username &&
      post.username == loginUserInfo.username
    ) {
      setPostMaster(true);
    }
  }, [loginUserInfo, post.likes, post]);

  //채팅 함수
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
  // 이미지 변경 핸들러
  const handlePrevImage = () => {
    setcurrentImgIdx((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setcurrentImgIdx((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 이미지 요소 생성
  const imgArr = [];
  for (let i = 0; i < images.length; i++) {
    imgArr.push(
      <img
        key={i}
        src={images[i].url}
        alt={`슬라이드 ${i + 1}`}
        className="slide-image"
      />
    );
  }
  // =====

  //게시글 수정기능 그런데 이제...음
  const editPost = (e) => {
    e.preventDefault();
    try {
      setEditModal(true);
      // setDetailModal(false);
      setStopFetch(true);
    } catch (error) {}
  };

  //게시글 삭제기능 그런데 이제 s3도 곁들인

  const deletePost = async (e) => {
    e.preventDefault();

    try {
      // 게시글 삭제 요청 보내기
      const response = await axios.post("/deletePost", {
        loginUser: loginUserInfo.username,
        postWriter: post.username,
        postId: post._id,
      });
      alert("삭제완료!");
      setDetailModal(false);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제 실패. 나중에 다시 시도해주세요.");
    }
  };

  return editModal ? (
    <div>
      <EditPost setEditModal={setEditModal} post={post} />
    </div>
  ) : (
    <div className="detail-modal">
      <p
        className="close-btn"
        onClick={() => {
          setDetailModal(false);
          setStopFetch(false);
        }}
      >
        <img src="/images/close-btn.png" alt="모달창 닫기 버튼" />
      </p>
      <div className="slider">
        {images.length > 0 && (
          <>
            <button className="prev-btn" onClick={handlePrevImage}>
              &lt;
            </button>
            <div className="slider-images">{imgArr[currentImgIdx]}</div>
            <button className="next-btn" onClick={handleNextImage}>
              &gt;
            </button>
          </>
        )}
      </div>
      {showChatModal && (
        <ChatModal
          chatRoom={chatRoom}
          setShowChatModal={setShowChatModal}
          showChatModal={showChatModal}
          handleChatRoom={handleChatRoom}
        />
      )}
      <div className="detail-content-box">
        {postMaster ? (
          <div>
            <p className="d-user-info">{post.username}</p>
            <p className="scrap-btn">
              <span className="scrap-cout-text">{post.likes.length}</span>
              <br />
              <img src={btnImage} onClick={handleLikes} alt="좋아요 버튼" />
            </p>
            <span className="edit-post-btn" onClick={editPost}>
              edit
            </span>
            <span className="delete-post-btn" onClick={deletePost}>
              delete
            </span>
            <div className="hash-tag-box">{hashtags}</div>
          </div>
        ) : (
          <div>
            <p className="d-user-info">{post.username}</p>
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
        )}
      </div>
    </div>
  );
}

export default Detail;
