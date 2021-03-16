const Tweet = require("../models/tweet");
const client = require("../helpers/twitterService");
const { get } = require("lodash");

module.exports = {
  getTweet: (req, res) => {
    let loc = "-5.9179251,118.9500887,12000km";
    client.get(
      "search/tweets",
      {
        q: "covid-19",
        geocode: loc,
        count: 1,
        tweet_mode: "extended",
        result_type: "recent",
      },
      async (error, tweets, response) => {
        if (!error) {
          const newRT = tweets.statuses;
          const filterRT = newRT.filter((tweet) => !tweet.retweeted_status);
          if (filterRT.length > 0) {
            const data = filterRT[0];
            const findTweet = await Tweet.find({ id: data.id });
            const isFound =
              findTweet.length === 0 &&
              get(data, "metadata.iso_language_code", "en") === "in";

            if (isFound) {
              const response = await Tweet.create({
                id: data.id,
                text: data.full_text,
                user: data.user,
                created_at: data.created_at,
              });
              console.log("Successfully save to db");
            } else {
              console.log("notfound isFound");
            }
          } else {
            console.log("notfound length");
          }
        } else {
          console.log(error);
        }
      }
    );
  },

  getNewTweet: async () => {
    let loc = "-5.9179251,118.9500887,12000km";
    client.get(
      "search/tweets",
      { q: "covid-19", geocode: loc, count: 1, result_type: "recent" },
      async (error, tweets, response) => {
        if (!error) {
          const data = tweets.statuses[0];
          const findTweet = await Tweet.find({ id: data.id });
          const isFound =
            findTweet.length === 0 &&
            get(data, "metadata.iso_language_code", "en") === "in";
          console.log(isFound, get(data, "metadata.iso_language_code", "en"));
          if (isFound) {
            const response = await Tweet.create({
              id: data.id,
              text: data.text,
              user: data.user,
              created_at: data.created_at,
            });
            console.log("Successfully save to db");
          }
        } else {
          console.log(error);
        }
      }
    );
  },

  getAllTweet: async (req, res) => {
    const { pageSize, currentPage } = req.params;
    const skip =
      Number(currentPage) === 1
        ? 0
        : (Number(currentPage) - 1) * Number(pageSize);
    try {
      const response = await Tweet.find({ deleteAt: null })
        .sort([["createdAt", "DESC"]])
        .limit(Number(pageSize) * 1)
        .skip(skip);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
