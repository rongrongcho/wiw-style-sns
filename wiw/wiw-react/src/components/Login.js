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
  const loginUserInfo = useSelector((state) => state.user.userInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 서버에 로그인 요청 보내기
      const response = await axios.post("/login", {
        username,
        password,
      });

      // 정상적인 응답 받은 경우 처리
      const { token, userInfo } = response.data;
      dispatch(setUser({ token, userInfo }));
      sessionStorage.setItem("jwtToken", token);
      alert("환영합니다 " + userInfo.username + "님"); // userInfo에서 username 가져오기
      setModal(false);
    } catch (error) {
      // 오류 처리
      if (error.response && error.response.data) {
        console.error("로그인 실패:", error.response.data);
        setVMsg("로그인 실패: " + error.response.data.message);
      } else {
        console.error("로그인 요청 오류:", error.message);
        setVMsg("로그인 요청 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="login-sign-modal">
      <p className="close-btn" onClick={() => setModal(false)}>
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
          <h4 className="modal-text-info">로그인</h4>
          <input
            className="user-input"
            name="username"
            placeholder="  아이디(Id)를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            pattern="[A-Za-z0-9]+"
            title="영문자와 숫자만 입력 가능합니다."
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
            title="영문자와 숫자만 입력 가능합니다."
            required
          />
          <button type="submit" className="submit-btn">
            <img src="images/submit-btn-icon.png" alt="제출 버튼" />
          </button>
          <span className="validation-msg">{vMsg}</span>
        </form>
        <div className="sign-up-info">
          <span>아직 회원이 아니신가요?</span>
          <p onClick={() => setModal("sign-up")}>회원가입 하기</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
