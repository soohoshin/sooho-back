const { Router } = require("express");
const router = Router();

router.use("/admin", require("./admin"));
router.use("/api", require("./api"));

module.exports = router;
