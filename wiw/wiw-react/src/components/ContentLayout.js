import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import "../assets/styles/ContentLayout.css";

function ContentLayout({ showSideMenu, IMAGES }) {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("default"); // 정렬 상태 추가

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

  // 정렬 버튼 기능
  const sortPosts = (posts, order) => {
    switch (order) {
      case "date":
        return [...posts].sort(
          (a, b) => new Date(b.postedAt) - new Date(a.postedAt)
        );
      case "scrap":
        return [...posts].sort((a, b) => b.likes.length - a.likes.length);
      default:
        return posts;
    }
  };
  // 정렬된 포스트들
  const sortedPosts = sortPosts(posts, sortOrder);
  // 정렬 버튼 클릭 핸들러
  const handleSortChange = (order) => {
    if (sortOrder === order) {
      // 현재 정렬 기준과 동일하면 디폴트 상태로 리셋
      setSortOrder("default");
    } else {
      // 새로운 정렬 기준으로 변경
      setSortOrder(order);
    }
  };

  // 해시태그 검색
  const searchHashtag = async (hashtag) => {
    try {
      const response = await axios.get(`/search/${hashtag}`);
      setPosts(response.data);
    } catch (error) {
      console.error(`해시태그 검색 실패: ${hashtag}`, error);
    }
  };

  const cards = sortedPosts.map((post, index) => (
    <div key={index} className="content-item">
      <Card post={post} getHashTag={searchHashtag} />
    </div>
  ));

  return (
    <div className="content-area">
      <div
        className={
          showSideMenu ? "sort-search-area-narrow" : "sort-search-area"
        }
      >
        <div className="sort-box">
          <p
            className={`sort-btns ${sortOrder === "scrap" ? "active" : ""}`}
            onClick={() => handleSortChange("scrap")}
          >
            스크랩순
          </p>
          <p
            className={`sort-btns ${sortOrder === "date" ? "active" : ""}`}
            onClick={() => handleSortChange("date")}
          >
            날짜순
          </p>
        </div>
        <div className="search-box">
          <input type="text" className="search-bar" />
          <button type="submit" className="search-btn">
            <img src={IMAGES.SEARCH_BTN} alt="검색 버튼" />
          </button>
        </div>
      </div>
      <div className={showSideMenu ? "content-box-narrow" : "content-box"}>
        {cards}
      </div>
    </div>
  );
}

export default ContentLayout;
