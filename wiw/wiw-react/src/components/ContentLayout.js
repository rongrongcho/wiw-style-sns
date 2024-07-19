import Card from "./Card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../assets/styles/ContentLayout.css";

function ContentLayout({ showSideMenu, IMAGES }) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("게시글 가져오기 실패:", error);
      }
    };

    fetchPosts();
  }, []);

  const cards = posts.map((post, index) => (
    <div key={index} className="content-item">
      <Card post={post} />
    </div>
  ));
  return (
    <div className="content-area">
      <div
        className={
          showSideMenu ? " sort-search-area-narrow" : "sort-search-area"
        }
      >
        <div className="sort-box">
          <p className="sort-btns sort-scrap">스크랩</p>
          <p className="sort-btns sort-day">날짜순</p>
        </div>
        <div className="search-box">
          <input type="text" className="search-bar" />
          <button type="submit" className="search-btn">
            <img src={IMAGES.SEARCH_BTN} alt="검색 버튼" />
          </button>
        </div>
      </div>
      <div className={showSideMenu ? " content-box-narrow" : "content-box"}>
        {cards}
      </div>
    </div>
  );
}
export default ContentLayout;
