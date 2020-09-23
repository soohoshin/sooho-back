const { Router } = require("express");
const router = Router();
const models = require("../../models");
const validator = require("validator");
const { verifyToken } = require("../../middlewares/authorization");

let jwt = require("jsonwebtoken");
let secretObj = require("../../config");

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  //res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  //res.header("Access-Control-Allow-Credentials", true);
  next();
});

router.get("/data/:productId", verifyToken, async (req, res) => {
  let data = {};
  try {
    if (req.params.productId === "all") {
      data = await models.Products.findAll({
        include: [{ model: models.Comments, as: "comment", limit: 3 }],
        // order: [
        //   [{ model: models.Comments, as: "comment" }, "createdAt", "DESC"],
        // ],
      });
    } else {
      data = await models.Products.findOne({
        where: {
          productId: req.params.productId,
        },
        include: [{ model: models.Comments, as: "comment" }],
      });
    }
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
});

router.get("/userdata", async (req, res) => {
  try {
    const clientToken = req.headers.user;
    const decoded = jwt.verify(clientToken, secretObj.secret);
    if (decoded) {
      console.log(decoded);
      const result = await models.Users.findOne({
        where: {
          userId: decoded.userId,
        },
      });
      console.log("아아아", result.userId, result.userName);
      return res.json({ userId: result.userId, userName: result.userName });
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } catch (err) {
    console.log("check error!!! ");
    res.status(401).json({ message: "token expired" });
  }
});

router.post("/comment", async (req, res) => {
  console.log(req.body);
  try {
    await models.Comments.create(req.body);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ message: error });
  }
});

router.post("/join", async (req, res) => {
  const { userId, userName, password } = req.body;

  if (!userId || validator.isEmpty(userId)) {
    return res.status(400).json({
      message: "empty ID",
    });
  }
  if (!userName || validator.isEmpty(userName)) {
    return res.status(400).json({
      message: "empty Name",
    });
  }
  if (!password || validator.isEmpty(password)) {
    return res.status(400).json({
      message: "empty Password",
    });
  }

  const user = await models.Users.findOne({
    where: {
      userId: userId,
    },
  });

  if (user) {
    return res.json({ success: false, message: "이미 등록된 아이디입니다." });
  } else {
    await models.Users.create(req.body);
    return res.json({ success: true });
  }
});

router.post("/login", async (req, res) => {
  let token = jwt.sign(
    {
      userId: req.body.userId,
    },
    secretObj.secret, // 비밀 키
    {
      expiresIn: "60m", // 유효 시간은 60분
    }
  );

  let result = await models.Users.findOne({
    where: {
      userId: req.body.userId,
    },
  });
  if (!result) {
    return res.json({
      success: false,
      reason: "등록되어있지 않은 아이디입니다.",
    });
  }

  let dbPassword = result.dataValues.password;
  let inputPassword = req.body.password;

  if (dbPassword === inputPassword) {
    console.log("비밀번호 일치");
    res.cookie("user", token);
    req.header.user = token;
    res.json({
      success: true,
      token: token,
      userId: result.userId,
      userName: result.userName,
    });
  } else {
    console.log("비밀번호 불일치");
    res.json({ success: false, reason: "비밀번호가 틀립니다!" });
  }
});

module.exports = router;
