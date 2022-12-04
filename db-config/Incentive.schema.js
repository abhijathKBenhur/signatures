const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Incentive = new Schema(
  {
    amount: { type: Number },
    action:{ type: String },
    status:{ type: String },
    tenantId:{ type: String },
    email:{ type: String },
    type:{ type: String },
    hash:{ type: String },
    companyName:{ type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Incentive", Incentive);
