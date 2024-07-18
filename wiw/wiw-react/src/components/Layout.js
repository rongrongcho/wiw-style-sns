import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../assets/styles/Layout.css";
import Login from "./Login";
import SignUp from "./SignUp";
import Card from "./Card";
import Logout from "./Logout";
import Write from "./Write";

// 이미지 및 버튼 텍스트 경로 상수화
const IMAGES = {
  LOGO: "images/top-logo-1px.png",
  MENU_BTN: "images/menu_active_btn.png",
  LOGIN_BTN: "images/loginbtn.png",
  CLOSE_BTN: "images/close-btn.png",
  SEARCH_BTN: "images/search-btn.png",
};

function Layout() {
  const [posts, setPosts] = useState([]);
  const [showModal, setModal] = useState(null);
  const [showSideMenu, setSideMenu] = useState(false);
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [showMember, setMember] = useState(false);
  const [showWrite, setWrite] = useState(false);

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

  function openSideMenu() {
    setSideMenu(true);
  }

  function closeSideMenu() {
    setSideMenu(false);
  }

  const cards = posts.map((post, index) => (
    <div key={index} className="content-item">
      <Card post={post} />
    </div>
  ));

  return (
    <div className="container">
      <nav>
        <div className="top-nav">
          <h1 className="top-logo-area">
            <a href="/">
              <img src={IMAGES.LOGO} alt="wiw 로고 이미지" />
            </a>
          </h1>
          <div className="top-nav-btns">
            <p onClick={openSideMenu} className="menu-active-btn">
              <img src={IMAGES.MENU_BTN} alt="menu 활성화 버튼" />
            </p>

            {loginUserInfo !== null && loginUserInfo.username ? (
              <div className="user-logged-in">
                <img
                  src={IMAGES.LOGIN_BTN}
                  alt="로그인 유저 이미지"
                  onClick={() => {
                    setMember(true);
                  }}
                />
              </div>
            ) : (
              <div className="user-box">
                <p
                  onClick={() => {
                    setModal("login");
                  }}
                  className="user-active-btn"
                >
                  login
                </p>

                <p
                  onClick={() => {
                    setModal("sign-up");
                  }}
                  className="user-active-btn"
                >
                  sign/up
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showModal === "login" && <Login setModal={setModal} />}
      {showModal === "sign-up" && <SignUp setModal={setModal} />}

      {showMember && (
        <div className="member-box">
          <p
            className="member-close-btn"
            onClick={() => {
              setMember(false);
              setWrite(false);
            }}
          >
            <img src={IMAGES.CLOSE_BTN} alt="사이드 메뉴 닫기 버튼" />
          </p>
          <Logout setMember={setMember} />

          <button
            onClick={() => {
              setWrite(true);
            }}
          >
            글쓰기
          </button>
          {showWrite && (
            <div className="write-modal">
              <p
                className="write-close-btn"
                onClick={() => {
                  setWrite(false);
                }}
              >
                <img src={IMAGES.CLOSE_BTN} alt="사이드 메뉴 닫기 버튼" />
              </p>
              <Write setWrite={setWrite} />
            </div>
          )}
        </div>
      )}

      {showSideMenu && (
        <div className="side-menu-area">
          <ul className="main-menu-box">
            <li className="main-menu-btns">
              <a href="/">Home</a>
            </li>
            <li className="main-menu-btns closet-btn">
              <a href="#">Closet</a>
              <ul className="sub-menu-box">
                <li className="sub-menu-btns">
                  <a href="#">My Codi</a>
                </li>
                <li className="sub-menu-btns">
                  <a href="#">Scrap</a>
                </li>
              </ul>
            </li>
            <li className="main-menu-btns">
              <a href="#">Chat</a>
            </li>
            <li className="main-menu-btns">
              <a href="#">...</a>
            </li>
          </ul>
          <p className="menu-close-btn" onClick={closeSideMenu}>
            <img src={IMAGES.CLOSE_BTN} alt="사이드 메뉴 닫기 버튼" />
          </p>
        </div>
      )}

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
    </div>
  );
}

export default Layout;
