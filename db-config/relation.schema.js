const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Relation = new Schema(
  {
    from : { type: String },
    to: { type: String },
    action: { type: String },
    status: { type: String },
    message: { type: String },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Relation", Relation);
