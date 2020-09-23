const jwt = require("jsonwebtoken");
let secretObj = require("../config");

const verifyToken = async (req, res, next) => {
  console.log("check!!!", req.headers.user);
  try {
    const clientToken = req.headers.user;
    const decoded = jwt.verify(clientToken, secretObj.secret);
    if (decoded) {
      console.log("success!!!");
      next();
    } else {
      res.status(401).json({ error: "unauthorized" });
    }
  } catch (err) {
    console.log("check error!!! ");
    res.status(401).json({ error: "token expired" });
  }
};
exports.verifyToken = verifyToken;
