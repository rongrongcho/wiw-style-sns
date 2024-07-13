import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../assets/styles/Card.css";
import Detail from "./Detail";

function Card() {
  const [showModal, setModal] = useState(false);
  return (
    <div className="card-box">
      <a href="#">
        <p
          className="card-img-box"
          onClick={() => {
            setModal(true);
          }}
        >
          <img className="card-img" src="images/uzacha.png" />
        </p>
      </a>
      <div className="card-content-box">
        <p className="user-info">chorong_lee</p>
        <p className="scrap-btn">
          <span className="scrap-cout-text">11.1k</span>
          <br />
          <img src="images/scrap-off-btn.png" />
        </p>
        <a className="chat-btn">
          <img src="images/chat-btn.png" />
        </a>
        <div className="hash-tag-box">
          <a className="hash-tag" href="">
            {" "}
            #ootd
          </a>
          <a className="hash-tag" href="">
            {" "}
          </a>

          <a className="hash-tag" href="">
            {" "}
            #ootd
          </a>
          <a className="hash-tag" href="">
            {" "}
            #ootd
          </a>

          <a className="hash-tag" href="">
            {" "}
            #ootd
          </a>
          <a className="hash-tag" href="">
            {" "}
            #ootdasdasd
          </a>
          <a className="hash-tag" href="">
            {" "}
            #ootd
          </a>
        </div>
      </div>
      {/* 로그인 모달 */}
      {showModal && <Detail setModal={setModal} />}
    </div>
  );
}

export default Card;
