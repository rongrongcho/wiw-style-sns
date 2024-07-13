const express = require("express");
const path = require("path");
const app = express();

//초기 셋팅 코드 ===========================================================
//=======================================================================

app.listen(8080, () => {
  console.log("http://localhost:8080 에서 서버 실행중");
});

app.use(express.static(path.join(__dirname, "wiw-react/build")));

app.get("/", function (요청, 응답) {
  응답.sendFile(path.join(__dirname, "/wiw-react/build/index.html"));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//==================================================================================================
//==================================================================================================
//==================================================================================================

app.get("/login", function (요청, 응답) {});
