import React, { useState, useEffect } from "react";
import "../assets/styles/Detail.css";

function Detail({ post, setDetailModal }) {
  const [currentImgIdx, setcurrentImgIdx] = useState(0);
  const images = post.images || []; // images 기본값 빈 배열 설정
  const [liked, setLiked] = useState(false);
  const likedBtn = "/images/scrap-on-btn.png";
  const unlikedBtn = "/images/scrap-off-btn.png";
  const btnImage = liked ? likedBtn : unlikedBtn;
  console.log("이미지:" + images);
  console.log("이미지가있는지 " + images[0]);

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
        <div className="hash-tag-box">{hashtags}</div>
      </div>
    </div>
  );
}

export default Detail;
