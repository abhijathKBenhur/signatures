const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Clan = new Schema(
  {
    name : { type: String, required: true },
    leader : { type: String, required: true },
    description : { type: String, required: true },
    imageUrl : { type: String, required: true },
    members : [
      {
        userName: String,
        imageUrl: String
      }
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clan", Clan);
