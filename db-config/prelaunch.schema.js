const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Prelaunch = new Schema(
  {
    mailID : { type: String },
    location: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prelaunch", Prelaunch);
