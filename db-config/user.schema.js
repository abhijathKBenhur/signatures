const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    fullName: { type: String },
    imageUrl: { type: String },
    metamaskId: { type: String },
    userName: { type: String },
    loginMode: { type: String },
    facebookUrl: { type: String },
    linkedInUrl: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
