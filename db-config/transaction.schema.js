const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const Transaction = new Schema(
  {
    transactionID : { type: String },
    Status: { type: String },
    type: { type: String },
    ID: { type: String },
    payload: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", Transaction);
