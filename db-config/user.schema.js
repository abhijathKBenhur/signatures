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
    twitterUrl: { type: String },
    instaUrl: { type: String },
    bio: { type: String },

    tribeCoinBalance: {type: Number},
    GasBalance: {type: Number},
    tribeGoldBalance: {type: Number},

    referral:{ type: String },

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
