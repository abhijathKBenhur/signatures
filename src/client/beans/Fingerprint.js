export default class Fingerprint{
    constructor(options){
        this.account = options.account
        this.name = options.name
        this.category = options.category
        this.description = options.description
        this.price = Number(window.web3.utils.fromWei(options.price.toString(), 'ether')).toFixed(2)  
        this.amount = Number(options.amount)  
        this.uri = options.uri
        this.tokenId = options.tokenId
        this.owner = options.owner
    }
}