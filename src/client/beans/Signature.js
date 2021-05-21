export default class Signature{
    constructor(options){
        //Properties before save
        this.owner = options.owner
        this.title = options.title
        this.category = options.category
        this.description = options.description
        this.price = Number(window.web3.utils.fromWei(options.price.toString(), 'ether')).toFixed(2)   || 0
        this.docHash = options.docHash

        //Properties after save
        this.docURL = options.docURL
        this.DB_ID = options.DB_ID
        this.transactionHash = options.transactionHash
        this.thumbnailURL = options.thumbnailURL
    }
}