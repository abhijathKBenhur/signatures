const MaticAPIs  = require("../BlockchainAPIs/MaticAPIs");
const TribeGoldAPIs  = require("../BlockchainAPIs/TribeGoldAPIs")
const StatsAPI = require("../statsAPI")
const IncentiveIdeaIndeces = [1,2,3,5,10,20]

const depostToNewUser = (newUserAddress) => {
    return Promise.all([TribeGoldAPIs.depositGold(newUserAddress)
        ,MaticAPIs.depositMatic(newUserAddress)
    ])
}

function depositForNthIdea(newUserAddress){

}

const depositEvaluator = {
    depostToNewUser,
    depositForNthIdea
}

module.exports =  depositEvaluator