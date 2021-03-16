const express = require("express");
const router = express.Router();
const {
  getTweet, // mining twiit
  getNewTweet,
  getAllTweet,
  deleteTweet,
  getTweetCovid,
} = require("../controllers/tweetController");
const cron = require("node-cron");

/* GET users listing. */

cron.schedule("*/20 * * * * *", function () {
  console.log("running a task every 20 second");
  getTweet();
});

router.get("/", getNewTweet);
router.get("/:pageSize/:currentPage", getAllTweet);
router.delete("/:_id", deleteTweet);
router.get("/covid/:pageSize/:currentPage", getTweetCovid);

module.exports = router;
