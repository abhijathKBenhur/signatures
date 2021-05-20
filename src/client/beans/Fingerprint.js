export default class Idea{
    constructor(options){
        this.owner = options.owner
        this.title = options.title
        this.category = options.category
        this.priority = options.priority
        this.description = options.description
        this.price = Number(window.web3.utils.fromWei(options.price.toString(), 'ether')).toFixed(2)   || 0
        this.docURL = options.docURL
        this.docHash = options.docHash
        this.thumbnailURL = options.thumbnailURL
    }
}