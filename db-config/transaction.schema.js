const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Transaction = new Schema(
  {
    transactionID : { type: String },
    Status: { type: String },
    type: { type: String },
    payload: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", Transaction);
