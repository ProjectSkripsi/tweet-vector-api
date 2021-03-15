const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const tweetRouter = require("./tweets");

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log("masuk");
  res.render("index", { title: "Express" });
});
router.use("/users", usersRouter);
router.use("/api/tweet", tweetRouter);

module.exports = router;
