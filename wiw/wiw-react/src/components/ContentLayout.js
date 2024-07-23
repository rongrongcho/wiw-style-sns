import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";
import "../assets/styles/ContentLayout.css";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ContentLayout({ showSideMenu, IMAGES }) {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("default"); // 정렬 상태
  const [searchKey, setSearchKey] = useState("");
  const location = useLocation();
  const urlPath = location.pathname; // 현재 path 경로만 저장
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [info, setInfo] = useState(false);

  // 게시글 데이터를 가져오는 함수
  const fetchPosts = async () => {
    try {
      let response;
      // URL 경로에 따라 API 요청을 다르게 설정
      if (urlPath === "/home" || urlPath === "/") {
        response = await axios.get("/api/posts");
      } else if (urlPath === "/my-codi" && loginUserInfo) {
        response = await axios.get(
          `/api/posts?where=my-codi&loginUser=${loginUserInfo.username}`
        );
      } else if (urlPath === "/my-scrap" && loginUserInfo) {
        response = await axios.get(
          `/api/posts?where=my-scrap&loginUser=${loginUserInfo.username}`
        );
      }

      if (response && response.data.length > 0) {
        setPosts(response.data);
        setInfo(false);
      } else {
        setPosts([]);
        setInfo(true);
      }
    } catch (error) {
      console.error("게시글 가져오기 실패:", error);
      setPosts([]);
      setInfo(true);
    }
  };

  // 페이지 로드 시 게시글을 가져오고 폴링 시작
  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 100);

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 정리
  }, [urlPath, loginUserInfo]);

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

  // 검색창 검색
  const search = async (keyword) => {
    try {
      const response = await axios.get(`/search-bar`, {
        params: { keyword },
      });
      if (response.data.length > 0) {
        setPosts(response.data);
        setInfo(false);
      } else {
        setPosts([]);
        setInfo(true);
      }
    } catch (error) {
      console.error(`검색 실패: ${keyword}`, error);
      setPosts([]);
      setInfo(true);
    }
  };

  // 해시태그 검색
  const searchHashtag = async (hashtag) => {
    try {
      const response = await axios.get(`/search-bar`, {
        params: { keyword: `#${hashtag}` }, // 해시태그 포함
      });
      if (response.data.length > 0) {
        setPosts(response.data);
        setSearchKey("#" + hashtag);
        setInfo(false);
      } else {
        setPosts([]);
        setSearchKey("#" + hashtag);
        setInfo(true);
      }
    } catch (error) {
      console.error(`해시태그 검색 실패: ${hashtag}`, error);
      setPosts([]);
      setInfo(true);
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
          <input
            type="text"
            className="search-bar"
            onChange={(e) => setSearchKey(e.target.value)}
            onFocus={() => setSearchKey("")}
            value={searchKey}
          />
          <button
            type="submit"
            className="search-btn"
            onClick={() => search(searchKey)}
          >
            <img src={IMAGES.SEARCH_BTN} alt="검색 버튼" />
          </button>
        </div>
      </div>
      {info ? (
        <div className="info-to-client">검색 결과가 존재하지 않습니다.</div>
      ) : (
        <div className={showSideMenu ? "content-box-narrow" : "content-box"}>
          {cards}
        </div>
      )}
    </div>
  );
}

export default ContentLayout;
