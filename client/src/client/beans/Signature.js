import BlockChainInterface from '../interface/BlockchainInterface'

export default class Signature{

    constructor(options){
        this.owner = options.owner
        this.title = options.title
        this.category = options.category
        this.description = options.description
        this.price = options.price
        this.PDFHash = options.PDFHash
        this.PDFFile = options.PDFFile
        this.thumbnail = options.thumbnail
        this.transactionID = options.transactionID
        this.ideaID = options.ideaID
    }
}