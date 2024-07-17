import React, { useState } from "react";
import { useSelector } from "react-redux";
import "../assets/styles/Layout.css";
import Login from "./Login";
import SignUp from "./SignUp";
import Card from "./Card";
import Logout from "./Logout";
import Write from "./Write";

function Layout() {
  // 멤머 모달창 제어 on/off state
  const [showModal, setModal] = useState(null);
  // 사이드 메뉴 제어 on/off state
  const [showSideMenu, setSideMenu] = useState(false);

  // 로그인 비로그인 화면 구분
  const setUserInfo = useSelector((state) => state.user.user);
  // 멤버 기능 활성화 (로그인한 유저)
  const [showMember, setMember] = useState(false);

  const [showWrite, setWrite] = useState(false);

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

            {setUserInfo ? (
              <div className="user-logged-in">
                <img
                  src="images/loginbtn.png"
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
      {/* 로그인 모달 */}
      {showModal === "login" && <Login setModal={setModal} />}
      {/* 회원가입 모달 */}
      {showModal === "sign-up" && <SignUp setModal={setModal} />}
      {/* 멤버기능 모달 */}
      {showMember && (
        <div className="member-box">
          <p
            className="member-close-btn"
            onClick={() => {
              setMember(false);
            }}
          >
            <img src="images/close-btn.png" alt="사이드 메뉴 닫기 버튼" />
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
            <div className="wirte-modal">
              <p
                className="write-close-btn"
                onClick={() => {
                  setWrite(false);
                }}
              >
                <img src="images/close-btn.png" alt="사이드 메뉴 닫기 버튼" />
              </p>
              <Write setWrite={setWrite} />
            </div>
          )}
        </div>
      )}

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
