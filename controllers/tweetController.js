const Tweet = require("../models/tweet");
const client = require("../helpers/twitterService");
const { get } = require("lodash");
const { getClassification } = require("../helpers/hash");

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
              const randomClas = Math.floor(Math.random() * 4) + 1;

              const response = await Tweet.create({
                id: data.id,
                text: data.full_text,
                user: data.user,
                created_at: data.created_at,
                classificationCode: randomClas,
                classification: getClassification(randomClas),
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
    const { search, orderBy } = req.query;
    const order = orderBy === "newest" ? "DESC" : "ASC";
    var findCondition = { deleteAt: null };

    if (search) {
      findCondition = {
        deleteAt: null,
        text: { $regex: new RegExp(search, "i") },
      };
    }
    const skip =
      Number(currentPage) === 1
        ? 0
        : (Number(currentPage) - 1) * Number(pageSize);
    try {
      const response = await Tweet.find(findCondition)
        .sort([["createdAt", order]])
        .limit(Number(pageSize) * 1)
        .skip(skip);
      const count = await Tweet.countDocuments(findCondition);
      res.status(200).json({
        currentPage,
        data: response,
        pageSize,
        status: true,
        totalItem: count,
        totalPage: Math.ceil(count / Number(pageSize)),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },

  deleteTweet: async (req, res) => {
    const { _id } = req.params;
    try {
      const response = await Tweet.findByIdAndDelete({
        _id,
      });
      res.status(200).json({
        msg: "success delete",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getTweetCovid: async (req, res) => {
    const { pageSize, currentPage } = req.params;
    const { search, orderBy } = req.query;
    const order = orderBy === "newest" ? "DESC" : "ASC";
    var findCondition = { deleteAt: null, isDataTraining: false };

    if (search) {
      findCondition = {
        deleteAt: null,
        text: { $regex: new RegExp(search, "i") },
      };
    }
    const skip =
      Number(currentPage) === 1
        ? 0
        : (Number(currentPage) - 1) * Number(pageSize);
    try {
      const response = await Tweet.find(findCondition)
        .sort([["createdAt", order]])
        .limit(Number(pageSize) * 1)
        .skip(skip);
      const count = await Tweet.countDocuments(findCondition);
      res.status(200).json({
        currentPage,
        data: response,
        pageSize,
        status: true,
        totalItem: count,
        totalPage: Math.ceil(count / Number(pageSize)),
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
