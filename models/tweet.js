const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    id: {
      type: String,
    },
    text: {
      type: String,
    },
    user: {
      type: Object,
    },
    created_at: {
      type: String,
    },
    classification: {
      type: String,
      default: null,
    },
    isPositive: { type: Boolean },
    deleteAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
