import React, { useState } from "react";
import "../assets/styles/LoginSignUp.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../store/slices/userSlice";
function Login({ setModal }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [vMsg, setVMsg] = useState("");
  const dispatch = useDispatch();
  const setUserInfo = useSelector((state) => state.user.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // axios를 사용하여 서버에 POST 요청
      const response = await axios.post("/login", {
        username, // 사용자 이름
        password, // 비밀번호
      });

      setVMsg("로그인 성공!");
      dispatch(setUser(response.data.userInfo));

      // 로그인 성공 시 모달 닫기
      setModal(false);
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
          <h4 className="login-text-info">회원가입</h4>
          <input
            className="login-input"
            name="username"
            placeholder="  아이디(Id)를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="[A-Za-z0-9]+"
            title="영문자와 숫자만 입력 가능합니다."
            required
          />
          <input
            className="login-input"
            name="password"
            type="password"
            placeholder="  패스워드(Password)를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            pattern="[A-Za-z0-9]+"
            title="영문자와 숫자만 입력 가능합니다. "
            required
          />
          <button type="submit" className="login-submit-btn">
            <img src="images/submit-btn-icon.png" alt="제출 버튼" />
          </button>
          <span className="validation-msg">{vMsg}</span>
        </form>
        <div className="sign-up-info">
          <span>아직 회원이 아니신가요?</span>
          <p
            href="/sign-up-modal"
            onClick={() => {
              setModal("sign-up");
            }}
          >
            회원가입 하기
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
