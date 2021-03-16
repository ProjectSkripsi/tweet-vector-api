const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const tweetRouter = require("./tweets");
const uploadModule = require("./upload");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.use("/api/v1/user", usersRouter);
router.use("/api/v1/tweet", tweetRouter);
router.use("/api/v1/upload", uploadModule);

module.exports = router;
