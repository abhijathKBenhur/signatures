const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// activity notifications and personal messaging
const Notification = new Schema(
  {
    from : { type: Schema.Types.ObjectId, ref: "User", required: true }, //userMongoID
    fromUserID: { type: String },
    to: { type: String }, //userName
    action: { type: String },
    status: { type: String },
    message: { type: String },
    payload: { type: String }
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", Notification);
