const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const cors = require("cors");
const { check, validationResult } = require("express-validator");
require("dotenv").config();

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "wiw-react/build")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
      dbName: process.env.DB_Name,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

let connectDB = require("./database.js");
const { ObjectId } = require("mongodb");
const { error } = require("console");
let db;

connectDB
  .then((client) => {
    console.log("DB 연결 성공");
    db = client.db(process.env.DB_Name);
  })
  .catch((err) => {
    console.log(err);
  });

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { user_id: user._id });
  });
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.collection("user").findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.collection("user").findOne({ username });
      if (!user) {
        return done(null, false, { message: "아이디가 존재하지 않습니다." });
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

//========================================================
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT} 에서 서버 실행 중`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "wiw-react/build/index.html"));
});

//회원가입

app.post(
  "/register",
  [
    check("username")
      .isAlphanumeric()
      .withMessage("아이디는 영문자와 숫자만 입력 가능합니다.")
      .isLength({ min: 8, max: 20 })
      .withMessage("아이디는 8자 이상 20자 이하로 입력해주세요."),
    check("password")
      .isAlphanumeric()
      .withMessage("비밀번호는 영문자와 숫자만 입력 가능합니다.")
      .isLength({ min: 8, max: 20 })
      .withMessage("비밀번호는 8자 이상 20자 이하로 입력해주세요."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      //중복 가입 방지하기
      const isExistingID = await db.collection("user").findOne({ username });
      if (isExistingID) {
        return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
      }
      //비밀번호 암호화 해싱처리
      const hashPwd = await bcrypt.hash(password, 10);
      //가입하는 계정 정보
      const newUser = {
        username,
        password: hashPwd,
      };
      //DB에 저장하기
      await db.collection("user").insertOne(newUser);
      return res.status(201).json({ message: "회원가입 성공" });
    } catch (err) {
      console.error("회원가입 오류발생", err);
      return res.status(500).json({ message: "서버오류 발생", error: err });
    }
  }
);

//로그인
app.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "서버 오류", error: err });
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "로그인 실패" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "로그인 세션 설정 오류", error: err });
      }
      console.log(new ObjectId(req.session.passport.user.user_id));
      //세션 정보를 담은 변수 userInfo
      const userInfo = {
        userId: user._id,
        username: user.username,
      };
      console.log(userInfo);

      return res.status(200).json({ message: "로그인 성공!", userInfo });
    });
  })(req, res, next);
});

app.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 실패", error: err });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "세션 삭제 실패", error: err });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "로그아웃 성공" });
    });
  });
});

//===============================================================
//===============================================================

//모들 라우트를 React로 위임
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "wiw-react/build/index.html"));
});
