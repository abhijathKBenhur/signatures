const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const Hashtag = new Schema(
  {
    hashtag : { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hashtag", Hashtag);
