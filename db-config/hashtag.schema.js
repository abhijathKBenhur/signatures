const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const Hashtag = new Schema(
  {
    hashtag : { type: String }, 
    trend: { type: Number }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Relation", Hashtag);
