const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Token = new Schema(
    {
        account: { type: String , required: true },
        tokenId: { type: String , required: true },
        owner: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String , required: true},
        description: { type: String, required: true },
        price: { type: Number , required: true},
        amount: { type: Number , required: true},
        uri: { type: String ,required: true},
        type: { type: String ,required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('token', Token)