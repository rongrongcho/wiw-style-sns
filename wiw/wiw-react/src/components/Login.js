import React from "react";
import "../assets/styles/Login.css";

function Login({ setModal }) {
  return (
    <div className="login-modal">
      <p
        className="close-btn"
        onClick={() => {
          setModal(false);
        }}
      >
        <img src="/images/close-btn.png" alt="모달창 닫기 버튼" />
      </p>
      <div className="modal-content">
        <div className="welcome-text-box">
          <p className="welcome-text">
            What I Wore?
            <br />
            Lets Check WiW!
          </p>
        </div>
        <form className="login-box" action="#" method="post">
          <h4 className="login-text-info">로그인</h4>
          <input
            className="login-input"
            name="username"
            placeholder="  아이디(Id)를 입력하세요"
          />
          <input
            className="login-input"
            name="password"
            type="password"
            placeholder="  패스워드(Password)를 입력하세요"
          />
          <button type="submit" className="login-submit-btn">
            <img src="images/submit-btn-icon.png"></img>
          </button>
          <span className="validation-messag">유효성 검사 문구</span>
        </form>
        <div className="sign-up-info">
          <p>아직 회원이 아니신가요?</p>
          <a href="#">회원가입 하기 </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
