import React, { useState } from "react";
import "../assets/styles/LoginSignUp.css";
import axios from "axios";

function SignUp({ setModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [vMsg, setVMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // axios를 사용하여 서버에 POST 요청
      const response = await axios.post("/register", {
        username, // 사용자 이름
        password, // 비밀번호
      });

      setVMsg("회원가입 성공!");
      alert("회원 가입 성공! 로그인 해주세요!");

      // 회원가입 성공 시 모달 닫기
      setModal(false);
    } catch (error) {
      console.error("회원가입 실패", error.response.data);
      // 회원가입 실패 시 에러 메시지
      setVMsg("회원가입 실패: " + error.response.data.message);
    }
  };
  return (
    <div className="login-sign-modal">
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
        <form className="modal-box" onSubmit={handleSubmit}>
          <h4 className="modal-text-info">회원가입</h4>
          <input
            className="user-input"
            name="username"
            placeholder="  아이디(Id)를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="[A-Za-z0-9]+"
            title="영문자와 숫자만 입력 가능합니다."
            minlength="8"
            maxlength="20"
            required
          />
          <input
            className="user-input"
            name="password"
            type="password"
            placeholder="  패스워드(Password)를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pattern="[A-Za-z0-9]+"
            title="영문자와 숫자만 입력 가능합니다. "
            minlength="8"
            maxlength="20"
            required
          />
          <button type="submit" className="submit-btn">
            <img src="images/submit-btn-icon.png" alt="제출 버튼" />
          </button>
          <span className="validation-msg">{vMsg}</span>
        </form>
        <div className="sign-up-info">
          <span>이미 회원이신가요?</span>
          <p
            onClick={() => {
              setModal("login");
            }}
          >
            로그인 하기
          </p>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
