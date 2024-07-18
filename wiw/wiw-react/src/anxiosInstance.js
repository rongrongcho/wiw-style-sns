import axios from "axios";

// 기본 설정이 적용된 Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // 실제 API 서버 주소로 변경하세요
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

export default axiosInstance;
