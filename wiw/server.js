const express = require("express");
const path = require("path");
const app = express();

//초기 셋팅 코드 ===========================================================
//=======================================================================

//===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "wiw-react/build")));

//dotenv 셋팅
require("dotenv").config();

//method-override 셋팅 (mthode=PUT 사용가능 )
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//bcrypt 셋팅
const bcrypt = require("bcrypt");

// session ,connect-mongo 셋팅
const MongoStore = require("connect-mongo");
app.use(passport.initialize());
app.use(
  session({
    secret: "암호화에 쓸 비번",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 }, //세션의 유효시간 설정하기 (밀리세컨드 단위로 입력)
    store: MongoStore.create({
      mongoUrl: "", //DB 접속용 Url
      dbName: "", // db 이름
    }),
  })
);

//==================================================================================================
//==================================================================================================
//==================================================================================================

app.listen(8080, () => {
  console.log("http://localhost:8080 에서 서버 실행중");
});
app.get("/", function (요청, 응답) {
  응답.sendFile(path.join(__dirname, "/wiw-react/build/index.html"));
});

app.get("/login", function (요청, 응답) {});
