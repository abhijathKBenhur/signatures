const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    from : { type: String },
    to: { type: String },
    action: { type: String },
    comment: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", Comment);
