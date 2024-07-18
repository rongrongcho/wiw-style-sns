import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../assets/styles/Card.css";
import Detail from "./Detail";

function Card({ post }) {
  const [showDetailModal, setDetailModal] = useState(false);
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [liked, setLiked] = useState(
    loginUserInfo &&
      loginUserInfo.username &&
      post.likes.includes(loginUserInfo.username)
  );

  const likedBtn = "/images/scrap-on-btn.png";
  const unlikedBtn = "/images/scrap-off-btn.png";
  const btnImage = liked ? likedBtn : unlikedBtn;

  const handleLikes = async () => {
    try {
      if (!loginUserInfo || !loginUserInfo.username) {
        alert("로그인이 필요한 기능입니다.");
        return;
      } else if (loginUserInfo.username == post.username) {
        alert("본인 게시글 입니다. 좋아요를 누를 수 없습니다!");
      } else {
        const response = await axios.post("/addLikes", {
          username: loginUserInfo.username,
          postId: post._id,
        });
        // 좋아요 상태를 토글
        setLiked(!liked);
        console.log(response.data);
      }
    } catch (error) {
      console.error("좋아요 요청 실패:", error);
    }
  };

  return (
    <div className="card-box">
      <a href="#">
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
        <p className="user-info">{post.username}</p>
        <p className="scrap-btn">
          <span className="scrap-cout-text">{post.likes.length}</span>
          <br />
          <img src={btnImage} onClick={handleLikes} alt="좋아요 버튼" />
        </p>
        <a className="chat-btn">
          <img src="images/chat-btn.png" alt="채팅 버튼" />
        </a>
        <div className="hash-tag-box">
          <a className="hash-tag" href="">
            {" "}
            #ootd
          </a>
        </div>
      </div>
      {showDetailModal && (
        <Detail
          post={post}
          setDetailModal={setDetailModal}
          setLiked={setLiked}
          handleLikes={handleLikes}
        />
      )}
    </div>
  );
}

export default Card;
