const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const Relation = new Schema(
  {
    from : { type: String }, // userName
    to: { type: String }, // userName
    relation: { type: String },
    status: { type: String },
    message: { type: String },
    payload: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Relation", Relation);
