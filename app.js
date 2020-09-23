const express = require("express");
const nunjucks = require("nunjucks");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config");

// db 관련
const db = require("./models");

class App {
  constructor() {
    this.app = express();

    // db 접속
    this.dbConnection();

    // 뷰엔진 셋팅
    this.setViewEngine();

    // 미들웨어 셋팅
    this.setMiddleWare();

    // 정적 디렉토리 추가
    this.setStatic();

    // 로컬 변수
    this.setLocals();

    // 라우팅
    this.getRouting();

    // 404 페이지를 찾을수가 없음
    this.status404();

    // 에러처리
    this.errorHandler();

    // 시크릿키 세팅
    this.setSecetKey();
  }

  // 씨퀄라이즈에서 mysql접속하는 부분
  dbConnection() {
    // DB authentication
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
        // return db.sequelize.sync();
      })
      .then(() => {
        console.log("DB Sync complete.");
        // return db.sequelize.sync();
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }

  setMiddleWare() {
    // 미들웨어 셋팅
    this.app.use(cookieParser());
    this.app.use(express.static("public"));
    this.app.use(logger("dev"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  setSecetKey() {
    // set the secret key variable for jwt
    this.app.set("jwt-secret", config.secret);
  }

  setViewEngine() {
    nunjucks.configure("template", {
      autoescape: true,
      express: this.app,
    });
  }

  setStatic() {
    this.app.use("/uploads", express.static("uploads"));
  }

  setLocals() {
    // 템플릿 변수
    this.app.use((req, res, next) => {
      this.app.locals.isLogin = true;
      this.app.locals.req_path = req.path;
      next();
    });
  }

  getRouting() {
    this.app.use(require("./controllers"));
  }

  status404() {
    this.app.use((req, res, _) => {
      res.status(404).render("common/404.html");
    });
  }

  errorHandler() {
    this.app.use((err, req, res, _) => {
      res.status(500).render("common/500.html");
    });
  }
}

module.exports = new App().app;
