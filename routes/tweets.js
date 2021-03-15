const express = require("express");
const router = express.Router();
const {
  getTweet,
  getNewTweet,
  getAllTweet,
} = require("../controllers/tweetController");
const cron = require("node-cron");

/* GET users listing. */

cron.schedule("*/10 * * * * *", function () {
  console.log("running a task every 10 second");
  getNewTweet();
});

router.get("/", getTweet);
router.get("/all", getAllTweet);

module.exports = router;
