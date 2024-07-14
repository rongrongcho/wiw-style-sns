import React, { useState } from "react";
import "../assets/styles/Login.css";
import axios from "axios";

function Login({ setModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [vMsg, setVMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username);
    console.log(password);

    try {
      // axios를 사용하여 서버에 POST 요청을 보냅니다.
      const response = await axios.post("/login", {
        username, // 사용자 이름
        password, // 비밀번호
      });

      console.log("로그인 성공일까 아닐까?", response.data);
      // 로그인 성공 시 메시지를 설정합니다.
      setVMsg("로그인 성공!");

      // 로그인 성공 시 모달을 닫습니다.
      setModal(false);

      // 추가적으로 로그인 성공 시 수행할 동작을 여기에 작성합니다.
    } catch (error) {
      console.error("로그인 실패", error.response.data);
      // 로그인 실패 시 에러 메시지를 설정합니다.
      setVMsg("로그인 실패: " + error.response.data.message);
    }
  };

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
        <form className="login-box" onSubmit={handleSubmit}>
          <h4 className="login-text-info">로그인</h4>
          <input
            className="login-input"
            name="username"
            placeholder="  아이디(Id)를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login-input"
            name="password"
            type="password"
            placeholder="  패스워드(Password)를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-submit-btn">
            <img src="images/submit-btn-icon.png" alt="제출 버튼" />
          </button>
          <span className="validation-msg">{vMsg}</span>
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
