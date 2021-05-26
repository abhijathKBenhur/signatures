export default class Signature{
    constructor(options){
        //Properties before save
        this.owner = options.owner
        this.title = options.title
        this.category = options.category
        this.description = options.description
        this.price = window.web3.utils && Number(window.web3.utils.fromWei(options.price.toString(), 'ether')).toFixed(2)  || 0
        this.PDFHash = options.PDFHash
        this.PDFFile = options.PDFFile
        this.thumbnail = options.thumbnail
        this.DB_ID = options.DB_ID
    }
}