const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Whitelist = new Schema(
  {
    code: { type: String },
    isUsed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Whitelist", Whitelist);
