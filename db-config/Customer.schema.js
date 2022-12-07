const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Customer = new Schema(
  {
    wallet: { type: String },
    email: { type: String },
    balance:{ type: Number },
    incentiveCount:{ type: Number },
    incentivisedActions:{ type: Map },
    tenantId:{ type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Customer", Customer);
