const { VSM, Cosine } = require('vector-space-model-similarity');
const Tweet = require('../models/tweet');
const client = require('../helpers/twitterService');
const { get } = require('lodash');
const { getClassification } = require('../helpers/hash');
// const { VSM, Cosine } = require('../helpers/vector-space-model/build/index');
const ObjectId = require('mongodb').ObjectID;
const { getK1, getK2, getK3, getK4 } = require('../helpers/filterCategory');

const algoVsm = async (newTweet) => {
  const k1 = await getK1();
  const k2 = await getK2();
  const k3 = await getK3();
  const k4 = await getK4();

  const documents = [k1, k2, k3, k4];

  const document = new VSM(documents);

  const idf = document.getIdfVectorized();

  const query = new VSM([newTweet], idf);

  const cosine = Cosine(
    query.getPowWeightVectorized()[0],
    document.getPowWeightVectorized()
  );
  // res.status(200).json({ cosine, query, idf });
  return { cosine, query, idf };
};

module.exports = {
  getTweet: (req, res) => {
    let loc = '-5.9179251,118.9500887,12000km';
    client.get(
      'search/tweets',
      {
        q: 'covid-19',
        geocode: loc,
        count: 1,
        tweet_mode: 'extended',
        result_type: 'recent',
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
              get(data, 'metadata.iso_language_code', 'en') === 'in';
            if (isFound) {
              const getVSM = await algoVsm(data.full_text);
              const arr = getVSM.cosine;
              let idx = arr.indexOf(Math.max(...arr));
              let clasifiedCode = idx + 1;

              // const randomClas = Math.floor(Math.random() * 4) + 1;
              const response = await Tweet.create({
                id: data.id,
                text: data.full_text,
                user: data.user,
                created_at: data.created_at,
                classificationCode: clasifiedCode,
                classification: getClassification(clasifiedCode),
                isDataTraining: true,
                analyse: getVSM,
              });
              console.log('Successfully save to db');
            } else {
              console.log('notfound isFound');
            }
          } else {
            console.log('notfound length');
          }
        } else {
          console.log(error);
        }
      }
    );
  },

  getNewTweet: async () => {
    let loc = '-5.9179251,118.9500887,12000km';
    client.get(
      'search/tweets',
      { q: 'covid-19', geocode: loc, count: 1, result_type: 'recent' },
      async (error, tweets, response) => {
        if (!error) {
          const data = tweets.statuses[0];
          const findTweet = await Tweet.find({ id: data.id });
          const isFound =
            findTweet.length === 0 &&
            get(data, 'metadata.iso_language_code', 'en') === 'in';
          console.log(isFound, get(data, 'metadata.iso_language_code', 'en'));
          if (isFound) {
            const response = await Tweet.create({
              id: data.id,
              text: data.text,
              user: data.user,
              created_at: data.created_at,
            });
            console.log('Successfully save to db');
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
    const order = orderBy === 'newest' ? 'DESC' : 'ASC';
    var findCondition = {
      deleteAt: null,
      isDataTraining: false,
    };

    if (search) {
      findCondition = {
        deleteAt: null,
        text: { $regex: new RegExp(search, 'i') },
      };
    }
    const skip =
      Number(currentPage) === 1
        ? 0
        : (Number(currentPage) - 1) * Number(pageSize);
    try {
      const response = await Tweet.find(findCondition)
        .sort([['createdAt', order]])
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

  getTweetCovid: async (req, res) => {
    const { pageSize, currentPage } = req.params;
    const { search, orderBy } = req.query;
    const order = orderBy === 'newest' ? 'DESC' : 'ASC';
    var findCondition = { deleteAt: null, isDataTraining: true };

    if (search) {
      findCondition = {
        deleteAt: null,
        text: { $regex: new RegExp(search, 'i') },
      };
    }
    const skip =
      Number(currentPage) === 1
        ? 0
        : (Number(currentPage) - 1) * Number(pageSize);
    try {
      const response = await Tweet.find(findCondition)
        .sort([['createdAt', order]])
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
        msg: 'success delete',
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  updateClassification: async (req, res) => {
    const { _id } = req.params;
    const { classificationCode } = req.body;
    try {
      const response = await Tweet.findByIdAndUpdate(
        {
          _id,
        },
        {
          classificationCode,
          classification: getClassification(Number(classificationCode)),
        },
        {
          returnOriginal: false,
        }
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getStatistic: async (req, res) => {
    const { type } = req.params;
    if (type === 'handle') {
      try {
        const response = await Tweet.find({
          $or: [{ classificationCode: 1 }, { classificationCode: 2 }],
          deleteAt: null,
          isDataTraining: true,
        }).select('classificationCode');
        const positif = response.filter(
          (item) => item.classificationCode === 1
        );
        const negatif = response.filter(
          (item) => item.classificationCode === 2
        );

        res.status(200).json({
          positif: positif.length,
          negatif: negatif.length,
        });
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      try {
        const response = await Tweet.find({
          $or: [{ classificationCode: 3 }, { classificationCode: 4 }],
          deleteAt: null,
          isDataTraining: true,
        }).select('classificationCode classification');
        const positif = response.filter(
          (item) => item.classificationCode === 3
        );
        const negatif = response.filter(
          (item) => item.classificationCode === 4
        );
        res
          .status(200)
          .json({ positif: positif.length, negatif: negatif.length });
      } catch (error) {
        res.status(500).json(error);
      }
    }
  },

  getRetweet: async (req, res) => {
    try {
      const response = await Tweet.find({
        classification: null,
      })
        .limit(2000)
        .sort([['createdAt', 'ASC']]);
      let result = response.map((a) => ObjectId(a._id));

      const delMany = await Tweet.deleteMany({
        _id: result,
      });
      res.status(200).json(delMany);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getRatioTweet: async (req, res) => {
    try {
      const response = await Tweet.find({
        deleteAt: null,
        isDataTraining: { $exists: true },
      }).select('_id classificationCode isDataTraining');

      const clas1 = response.filter(
        ({ classificationCode }) => classificationCode === 1
      );
      const clas2 = response.filter(
        ({ classificationCode }) => classificationCode === 2
      );
      // console.log(clas2);

      const clas3 = response.filter(
        ({ classificationCode }) => classificationCode === 3
      );
      const clas4 = response.filter(
        ({ classificationCode }) => classificationCode === 4
      );

      const class1Data = clas1.filter(
        ({ isDataTraining }) => isDataTraining === false
      );
      const class2Data = clas2.filter(
        ({ isDataTraining }) => isDataTraining === false
      );

      const class3Data = clas3.filter(
        ({ isDataTraining }) => isDataTraining === false
      );

      const class4Data = clas4.filter(
        ({ isDataTraining }) => isDataTraining === false
      );

      const data = [
        {
          classificationCode: 1,
          training: class1Data.length,
          tweet: clas1.length - class1Data.length,
          classification: 'Sentimen Positif Penanganan COVID-19',
          total: clas1.length,
        },
        {
          classificationCode: 2,
          training: class2Data.length,
          tweet: clas2.length - class2Data.length,
          classification: 'Sentimen Negatif Penanganan COVID-19',
          total: clas2.length,
        },
        {
          classificationCode: 3,
          training: class3Data.length,
          tweet: clas3.length - class3Data.length,
          classification: 'Sentimen Positif Vaksinasi COVID-19',
          total: clas3.length,
        },
        {
          classificationCode: 4,
          training: class4Data.length,
          tweet: clas4.length - class4Data.length,
          classification: 'Sentimen Negatif Vaksinasi COVID-19',
          total: clas4.length,
        },
      ];

      res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  },
};
