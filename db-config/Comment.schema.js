const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema(
  {
    from : { type: Schema.Types.ObjectId, ref: "User", required: true },
    fromUserID: { type: String },
    to: { type: String },
    action: { type: String },
    comment: { type: String },
    entity:  { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", Comment);
