const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Signature = new Schema(
    {
        owner: { type: String, required: true },
        title: { type: String, required: true },
        category: { type: String , required: true},
        description: { type: String, required: true },
        price: { type: Number , required: true},
        thumbnail: { type: String , required: true},
        PDFFile: { type: String ,required: true},
        PDFHash: { type: String ,required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Signature', Signature)