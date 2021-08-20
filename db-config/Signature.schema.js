const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Signature = new Schema(
    {
        creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
        owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        category: { type: String , required: true},
        description: { type: String, required: true },
        
        thumbnail: { type: String , required: true},
        PDFFile: { type: String ,required: true},
        PDFHash: { type: String ,required: true},
        fileType: { type: String ,required: true},
        transactionID: { type: String,required: true},
        ideaID: { type: String},
        storage: { type: String },
        purpose: {
              type: String,
              subType: String,
              message: String
            },
        location: { type: String },
        
        price: { type: String , required: true},
        units: { type: String },
        
    },
    { timestamps: true },
)

module.exports = mongoose.model('Signature', Signature)