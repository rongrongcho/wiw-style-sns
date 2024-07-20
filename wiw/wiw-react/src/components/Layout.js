import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "../assets/styles/Layout.css";
import Login from "./Login";
import SignUp from "./SignUp";
import Logout from "./Logout";
import Write from "./Write";
import ContentLayout from "./ContentLayout";
import ChatLayout from "./ChatLayout";

// 이미지 및 버튼 텍스트 경로 상수화
const IMAGES = {
  LOGO: "images/top-logo-1px.png",
  MENU_BTN: "images/menu_active_btn.png",
  LOGIN_BTN: "images/loginbtn.png",
  CLOSE_BTN: "images/close-btn.png",
  SEARCH_BTN: "images/search-btn.png",
};

function Layout() {
  const [showModal, setModal] = useState(null);
  const [showSideMenu, setSideMenu] = useState(false);
  const loginUserInfo = useSelector((state) => state.user.userInfo);
  const [showMember, setMember] = useState(false);
  const [showWrite, setWrite] = useState(false);
  const location = useLocation();
  const urlPath = location.pathname; // 현재 path 경로만 저장

  function openSideMenu() {
    setSideMenu(true);
  }

  function closeSideMenu() {
    setSideMenu(false);
  }

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
              <a href="/chat">Chat</a>
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

      {urlPath === "/chat" ? (
        <ChatLayout />
      ) : (
        <ContentLayout showSideMenu={showSideMenu} IMAGES={IMAGES} />
      )}
    </div>
  );
}

export default Layout;
