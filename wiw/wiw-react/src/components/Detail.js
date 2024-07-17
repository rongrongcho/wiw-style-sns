import React from "react";
import "../assets/styles/Detail.css";

function Detail({ postData, setShowDetail }) {
  return (
    <div className="detail-modal">
      <p className="close-btn">
        <img src="/images/close-btn.png" alt="모달창 닫기 버튼" />
      </p>
      <div className="post-content">
        <h2>게시글 상세</h2>
        <div className="images">
          {postData.images.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`게시글 이미지 ${index + 1}`}
            />
          ))}
        </div>
        <div className="hashtags">
          {postData.hashtags.map((hashtag, index) => (
            <span key={index}>{`#${hashtag}`}</span>
          ))}
        </div>
        <div className="user-info">
          <p>작성자: {postData.userInfo.username}</p>
        </div>
      </div>
    </div>
  );
}

export default Detail;
