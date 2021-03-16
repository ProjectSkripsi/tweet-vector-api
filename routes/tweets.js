const express = require("express");
const router = express.Router();
const {
  getTweet, // mining twiit
  getNewTweet,
  getAllTweet,
  deleteTweet,
  getTweetCovid,
  updateClassification,
  getStatistic,
} = require("../controllers/tweetController");
const { isLogin, isAdmin } = require("../middlewares/auth");
const cron = require("node-cron");

/* GET users listing. */

cron.schedule("*/20 * * * * *", function () {
  console.log("running a task every 20 second");
  getTweet();
});

router.get("/statistic/:type", isLogin, isAdmin, getStatistic);
router.get("/", getNewTweet);
router.get("/:pageSize/:currentPage", isLogin, getAllTweet);
router.delete("/:_id", isLogin, isAdmin, deleteTweet);
router.get("/covid/:pageSize/:currentPage", isLogin, isAdmin, getTweetCovid);
router.patch("/update/:_id", isLogin, isAdmin, updateClassification);

module.exports = router;
