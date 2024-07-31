import React, { useEffect } from "react";
import "./assets/styles/App.css";
import Layout from "./components/Layout";
import { Routes, Route } from "react-router-dom";
import axios from "axios"; // axios 인스턴스를 사용하여 JWT 토큰 자동 추가
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const loginUserInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("jwtToken");
    if (storedToken) {
      axios
        .post("http://localhost:8080/verifyToken", { token: storedToken })
        .then((response) => {
          if (response.data.valid) {
            dispatch(
              setUser({ token: storedToken, userInfo: response.data.userInfo })
            );
          } else {
            sessionStorage.removeItem("jwtToken");
          }
        })
        .catch(() => {
          sessionStorage.removeItem("jwtToken");
        });
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/my-codi" element={<Layout />} />
        <Route path="/my-scrap" element={<Layout />} />
        <Route path="/chat" element={<Layout />} />
      </Routes>
    </div>
  );
}

export default App;
