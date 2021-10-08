const MaticAPIs  = require("../BlockchainAPIs/MaticAPIs");
const TribeGoldAPIs  = require("../BlockchainAPIs/TribeGoldAPIs")
const StatsAPI = require("../statsAPI")
const IncentiveIdeaIndeces = [1,2,3,5,10,20]

const depostToNewUser = (newUserAddress) => {
    console.log("Depositing to new user  in DEPOEVAL")
    TribeGoldAPIs.depositGold(newUserAddress).then(success =>{
        console.log("Deposited to new user")
    }).catch(err =>{
        console.log("Deposit failed to new user")
    })
    MaticAPIs.depo(newUserAddress).then(success =>{
        console.log("Deposited to new user")
    }).catch(err =>{
        console.log("Deposit failed to new user")
    })
}

function depositForNthIdea(newUserAddress){

}

const depositEvaluator = {
    depostToNewUser,
    depositForNthIdea
}

module.exports =  depositEvaluator