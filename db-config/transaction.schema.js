const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Transaction = new Schema(
  {
    transactionID : { type: String },
    status: { type: String },
    type: { type: String },
    payload: { type: String },
    amount:{type:String},
    value:{type:String},
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", Transaction);
