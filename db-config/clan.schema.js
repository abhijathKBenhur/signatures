const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Clan = new Schema(
  {
    name : { type: String, required: true },
    leader : { type: Schema.Types.ObjectId, ref: "User", required: true },
    description : { type: String, required: true },
    thumbnail: { type: String, required: true },
    members : [
      { 
        memberId : String,
        status: Boolean
     }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Clan", Clan);
