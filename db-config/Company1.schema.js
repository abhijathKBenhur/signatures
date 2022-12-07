const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Company = new Schema(
  {
    password: { type: String },
    goldConfig: { type: String },
    distributed: { type: Number },
    balance: { type: Number },
    companyName: { type: String },
    email:{ type: String },
    status:{ type: String },
    tenantId: { type: String },
    key: { type: String },
    secret: { type: String },
    details: { type: Map },
    contractAddress: { type: String },
    pKey: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", Company);
