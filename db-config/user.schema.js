const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        userName: { type: String },
        mailID: { type: String },
        firstName: { type: String },
        LastName: { type: String },
        profilePic:{ type: String },
        typeOfUser:{ type: String },
        numberOfIdeas:{ type: String }
    },
    { timestamps: true },
)

module.exports = mongoose.model('user', User)