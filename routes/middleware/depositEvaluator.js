const TribeGoldAPIs  = require("../BlockchainAPIs/TribeGoldAPIs")
const StatsAPI = require("../statsAPI")
const IncentiveIdeaIndeces = [1,2,3,5,10,20]

const depostToNewUser = (newUserAddress) => {
    TribeGoldAPIs.depositGold(newUserAddress).then(success =>{

    }).catch(err =>{
        
    })
}

function depositForNthIdea(newUserAddress){

}

const depositEvaluator = {
    depostToNewUser,
    depositForNthIdea
}

module.exports =  depositEvaluator