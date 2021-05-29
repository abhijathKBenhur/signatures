const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        userName: { type: String, required: true },
        password: { type: String, required: true },
        balance: { type: Number, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('user', User)