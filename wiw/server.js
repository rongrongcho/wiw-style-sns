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
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid"); // UUID 임포트
require("dotenv").config();
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: "ap-northeast-2",
  endpoint: "https://s3.ap-northeast-2.amazonaws.com",
  credentials: {
    accessKeyId: process.env.IAM_Access_Key,
    secretAccessKey: process.env.IAM_Secret_Key,
  },
});

async function deleteS3File(bucket, key) {
  try {
    const deleteParams = {
      Bucket: bucket,
      Key: key,
    };
    const command = new DeleteObjectCommand(deleteParams);
    await s3.send(command);
    console.log(`Deleted ${key} from ${bucket}`);
  } catch (error) {
    console.error(`Failed to delete ${key} from ${bucket}:`, error);
  }
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "wiw-buket",
    key: function (req, file, cb) {
      const uniqueName = uuidv4(); // UUID를 사용하여 고유한 파일명 생성
      const extension = path.extname(file.originalname);
      cb(null, `${uniqueName}${extension}`);
    },
  }),
});

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
    httpOnly: true, // 클라이언트 측에서 쿠키 접근 방지
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
    done(null, { user_id: user._id, username: user.username });
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

// 로그인 처리 - JWT 사용
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.collection("user").findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "아이디가 존재하지 않습니다." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    //  전송할 로그인 정보
    const userInfo = {
      userId: user._id,
      username: user.username,
    };
    console.log("로그인 성공임?" + username);
    res.json({ token, userInfo });
  } catch (err) {
    console.error("로그인 오류 발생", err);
    return res.status(500).json({ message: "서버 오류 발생", error: err });
  }
});

// 로그인 토큰 검증하기

app.post("/verifyToken", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false, message: "토큰이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, userInfo: decoded });
  } catch (error) {
    res
      .status(401)
      .json({ valid: false, message: "토큰이 유효하지 않습니다." });
  }
});

// 로그아웃
app.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "로그아웃 실패", error: err });
    }
    req.session.destroy(function (err) {
      if (err) {
        return res.status(500).json({ message: "세션 삭제 실패", error: err });
      }
      res.clearCookie("connect.sid"); // 클라이언트 쿠키 삭제
      return res.status(200).json({ message: "로그아웃 성공" });
    });
  });
});

// 게시글 목록 조회
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await db.collection("post").find({}).toArray();
    return res.status(200).json(posts);
  } catch (error) {
    console.error("게시글 조회 실패:", error);
    return res.status(500).json({ message: "게시글 조회 실패", error });
  }
});

// 해시태그 검색
app.get("/search/:hashtag", async (req, res) => {
  const hashtag = req.params.hashtag;
  try {
    const posts = await db
      .collection("post")
      .find({ hashtags: hashtag })
      .toArray();
    console.log("성공적으로 해시태그를 검색했음");
    console.log(posts);
    return res.status(200).json(posts);
  } catch (error) {
    console.error("해시태그 검색 실패:", error);
    return res.status(500).json({ message: "해시태그 검색 실패", error });
  }
});

// 게시글 등록
app.post("/addPost", upload.array("images", 3), async (req, res) => {
  try {
    const hashtags = JSON.parse(req.body.hashtags);
    const userInfo = JSON.parse(req.body.userInfo);

    // 게시글 객체 생성
    const post = {
      username: userInfo,
      images: req.files.map((file) => ({
        url: file.location, // S3에 업로드된 파일의 URL 저장
      })),
      hashtags: hashtags,
      postedAt: new Date(),
      likes: [],
    };
    // DB에 post 객체 저장
    await db.collection("post").insertOne(post);

    return res.status(200).json({ message: "게시글 등록 성공", post });
  } catch (error) {
    console.error("게시글 등록 실패:", error);
    return res.status(500).json({ message: "게시글 등록 실패", error });
  }
});

app.post("/addLikes", async (req, res) => {
  try {
    const { username, postId } = req.body;

    if (!username) {
      return res
        .status(401)
        .json({ message: "로그인 후 이용하실 수 있는 서비스입니다." });
    }
    const user = await db.collection("user").findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    const post = await db
      .collection("post")
      .findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return res.status(404).json({ message: "포스트를 찾을 수 없습니다." });
    }
    // 유저 객체에 likes 필드가 없으면 만들어줘
    if (!user.likes) {
      user.likes = [];
    }

    if (!post.likes) {
      post.likes = [];
    }

    if (user.likes.includes(postId)) {
      // 좋아요를 이미 누른 경우 - 좋아요 취소
      await db
        .collection("post")
        .updateOne(
          { _id: new ObjectId(postId) },
          { $pull: { likes: username } }
        );
      await db
        .collection("user")
        .updateOne({ username: username }, { $pull: { likes: postId } });
      console.log("좋아요 취소 ");

      return res.status(200).json({ message: "좋아요가 취소되었습니다." });
    } else {
      // 좋아요를 누르지 않은 경우 - 좋아요 추가
      await db
        .collection("post")
        .updateOne(
          { _id: new ObjectId(postId) },
          { $addToSet: { likes: username } }
        );
      await db
        .collection("user")
        .updateOne({ username: username }, { $addToSet: { likes: postId } });
      console.log("좋아요 추가 ");
      return res.status(200).json({ message: "좋아요가 추가되었습니다." });
    }
  } catch (error) {
    console.error("좋아요 활동 실패", error);
    return res.status(500).json({ message: "서버 오류 발생", error });
  }
});
app.post("/editPost", upload.array("images", 3), async (req, res) => {
  const { postId, userInfo, hashtags, existingImages } = req.body;
  const files = req.files;

  try {
    // 기존 저장 데이터 가져오기 (수정 전)
    const oldData = await db
      .collection("post")
      .findOne({ _id: new ObjectId(postId) });
    if (!oldData) {
      return res.status(404).json({ error: "포스트를 찾을 수 없습니다." });
    }

    // 수정하려고 하는 데이터
    const newImageUrls = files.map(
      (file) => file.location // multerS3에서 제공하는 URL
    );

    //  기존 이미지 URL
    const oldImageUrls = oldData.images.map((img) => img.url);

    //  삭제할 이미지 찾기
    // 기존 이미지 URL 중에서 업로드된 이미지와 일치하지 않는 이미지를 찾습니다.
    const imagesToRemove = oldImageUrls.filter(
      (url) => !newImageUrls.includes(url) && !existingImages.includes(url)
    );

    console.log("Images to Remove:", imagesToRemove);

    // S3에서 이미지 삭제
    const deleteAllImg = imagesToRemove.map((url) => {
      const key = url.split("/").pop(); // 파일 이름만 추출
      return deleteS3File("wiw-buket", key); // 버킷 이름 확인 (오타제발 왜 env안되는지..)
    });

    await Promise.all(deleteAllImg);

    //  업데이트할 이미지 경로들
    const updatedImages = oldData.images
      .filter((img) => !imagesToRemove.includes(img.url))
      .concat(newImageUrls.map((url) => ({ url })));

    // 업데이트할 해시태그
    const updatedHashtags = JSON.parse(hashtags);

    // 디비 업로드
    await db.collection("post").updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          images: updatedImages,
          hashtags: updatedHashtags,
        },
      }
    );

    res.status(200).json({ message: "포스트 수정 성공" });
  } catch (error) {
    console.error("포스팅 수정 실패", error);
    res.status(500).json({ error: "포스팅 수정 실패" });
  }
});

// 게시글 삭제
app.post("/deletePost", async (req, res) => {
  const { loginUser, postWriter, postId } = req.body;

  try {
    // 게시글 찾기
    const post = await db
      .collection("post")
      .findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    // 권한 확인: 로그인 유저가 게시글 작성자와 동일한지 확인
    if (loginUser !== postWriter) {
      return res
        .status(403)
        .json({ message: "게시글을 삭제할 권한이 없습니다." });
    }

    // 이미지 파일 삭제
    const bucket = "wiw-buket"; // S3 버킷 이름

    //  이미지 파일 삭제를 위한 배열 생성
    const deleteAllImg = post.images.map(async (image) => {
      const key = image.url.split("/").pop(); // 이미지 URL에서 파일명 추출
      await deleteS3File(bucket, key);
    });

    // 삭제 작업 실행
    await Promise.all(deleteAllImg);

    // 게시글 삭제
    await db.collection("post").deleteOne({ _id: new ObjectId(postId) });

    return res
      .status(200)
      .json({ message: "게시글과 이미지를 성공적으로 삭제했습니다." });
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    return res.status(500).json({ message: "게시글 삭제 실패", error });
  }
});

//===============================================================
//===============================================================

//모들 라우트를 React로 위임
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "wiw-react/build/index.html"));
});
