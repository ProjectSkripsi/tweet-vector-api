const Tweet = require('../models/tweet');

module.exports = {
  getK1: async () => {
    const data = await Tweet.find({
      classificationCode: 1,
      isDataTraining: false,
    }).select('text');
    return data.map((e) => e.text).join(' ');
  },

  getK2: async () => {
    const data = await Tweet.find({
      classificationCode: 2,
      isDataTraining: false,
    }).select('text');
    return data.map((e) => e.text).join(' ');
  },

  getK3: async () => {
    const data = await Tweet.find({
      classificationCode: 3,
      isDataTraining: false,
    }).select('text');
    return data.map((e) => e.text).join(' ');
  },

  getK4: async () => {
    const data = await Tweet.find({
      classificationCode: 4,
      isDataTraining: false,
    }).select('text');
    return data.map((e) => e.text).join(' ');
  },
};
