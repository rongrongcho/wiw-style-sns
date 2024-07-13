import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../assets/styles/Layout.css";
import Content from "./Content";
import Login from "./Login";
import Card from "./Card";

function Layout() {
  // 로그인 모달창 제어 on/off state
  const [showModal, setModal] = useState(false);
  // 사이드 메뉴 제어 on/off state
  const [showSideMenu, setSideMenu] = useState(false);

  // 사이드 메뉴 열기 함수
  function openSideMenu() {
    setSideMenu(true);
  }

  // 사이드 메뉴 닫기 함수
  function closeSideMenu() {
    setSideMenu(false);
  }

  // Card 컴포넌트 반복문 생성
  const cards = Array.from({ length: 8 }).map((_, index) => (
    <div key={index} className="content-item">
      <Card />
    </div>
  ));

  return (
    <div className="container">
      <nav>
        <div className="top-nav">
          <h1 className="top-logo-area">
            <a href="App.js">
              <img src="images/top-logo-1px.png" alt="wiw 로고 이미지" />
            </a>
          </h1>
          <div className="top-nav-btns">
            <p onClick={openSideMenu} className="menu-active-btn">
              <img src="images/menu_active_btn.png" alt="menu 활성화 버튼" />
            </p>
            <p
              onClick={() => {
                setModal(true);
              }}
              className="login-active-btn"
            >
              <img src="images/loginbtn.png" alt="로그인 활성화 버튼" />
            </p>
          </div>
        </div>
      </nav>
      {/* 로그인 모달 */}
      {showModal && <Login setModal={setModal} />}

      {/* 사이드 메뉴 */}
      {showSideMenu && (
        <div className="side-menu-area">
          <ul className="main-menu-box">
            <li className="main-menu-btns">
              <a href="App.js">Home</a>
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
            <img src="images/close-btn.png" alt="사이드 메뉴 닫기 버튼" />
          </p>
        </div>
      )}

      {/* Content 영역 */}
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
              <img src="images/search-btn.png" />
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
