const Web3Utils = require("web3-utils");
const MaticAPIs = require("../BlockchainAPIs/MaticAPIs");
const TribeGoldAPIs = require("../BlockchainAPIs/TribeGoldAPIs");
const StatsAPI = require("../statsAPI");

const UserSchema = require("../../db-config/user.schema");
const SignatureSchema = require("../../db-config/Signature.schema");
const TransactionSchema = require("../../db-config/transaction.schema");

const GOLD_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("1", "ether"),
  REFERAL: Web3Utils.toWei("1", "ether"),
  IDEA_POST: {
    1: Web3Utils.toWei("3", "ether"),
    2: Web3Utils.toWei("2", "ether"),
    3: Web3Utils.toWei("2", "ether"),
    4: Web3Utils.toWei("2", "ether"),
    5: Web3Utils.toWei("2", "ether"),
  },
  UPVOTES:{
    1: Web3Utils.toWei("1", "ether"),
    10: Web3Utils.toWei("2", "ether"),
    100: Web3Utils.toWei("5", "ether"),
  },
  FOLLOWS:{
    1: Web3Utils.toWei("1", "ether"),
    10: Web3Utils.toWei("2", "ether"),
    100: Web3Utils.toWei("5", "ether"),
  }
};

const MATIC_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("0.1", "ether"),
};

const depostToNewUser = (receiverUserObject) => {
  console.log("INITIATING DEPOSITS")
  if(receiverUserObject.referredBy){
    UserSchema.findOne({myReferralCode:receiverUserObject.referredBy}).then(result =>{
      console.log("Referer", result.data)
      TribeGoldAPIs.depositGold(result.data, GOLD_DEPOSIT_VALUES.REFERAL,"GOLD_INCENTIVICED_REFERAL")
    })
  }
  TribeGoldAPIs.depositGold(receiverUserObject, GOLD_DEPOSIT_VALUES.REGISTER,"GOLD_INCENTIVICED_REGISTER")
  MaticAPIs.depositMatic(receiverUserObject, MATIC_DEPOSIT_VALUES.REGISTER,"REGISTER")
};


const depostForFollow = (ownerUserObject) => {
  console.log("INITIATING FOLLOW DEPOSIT",ownerUserObject)
  try{
    StatsAPI.getFollowCountForUser(ownerUserObject.userName).then(result =>{
      console.log("CURRENT FOLLOW COUNT ",result)
      if (Object.keys(GOLD_DEPOSIT_VALUES.FOLLOWS).indexOf(""+result) > -1) {
        console.log("CHECKING USER - " + ownerUserObject._id + " && GOLD_INCENTIVICED_FOLLOW_" + result)
        TransactionSchema.find({user:ownerUserObject._id,type:"GOLD_INCENTIVICED_FOLLOW_"+result}).then(transaction => {
          if(!transaction || transaction.length == 0){
            console.log(" FOLLOW DEPOSITED")
            return TribeGoldAPIs.depositGold(ownerUserObject,GOLD_DEPOSIT_VALUES.FOLLOWS[Number(result)],"GOLD_INCENTIVICED_FOLLOW_"+result)
          }
          else{
            console.log("ALREADY INCENTIVISED")
          }
        })
      }else{
        console.log("UNINDEXED COUNTS")
      }
    })
  
  }catch(error){
    console.log("error ", error)
  }
};

const depostForUpvote = (ownerUserObject,ideaId) => {
  console.log("INITIATING UPVOTE DEPOSIT")
  try{
    StatsAPI.getUpvoteCountForIdeas(ideaId).then(result =>{
      console.log("CURRENT UPVOTE COUNT ",result)
      if (Object.keys(GOLD_DEPOSIT_VALUES.UPVOTES).indexOf(""+result) > -1) {
        console.log("CHECKING USER - " + ownerUserObject._id + " && GOLD_INCENTIVICED_UPVOTE_" + result)
        TransactionSchema.find({user:ownerUserObject._id,type:"GOLD_INCENTIVICED_UPVOTE_"+result}).then(transaction => {
          if(!transaction || transaction.length == 0){
            console.log(" UPVOTE DEPOSITED")
            return TribeGoldAPIs.depositGold(ownerUserObject,GOLD_DEPOSIT_VALUES.UPVOTES[Number(result)],"GOLD_INCENTIVICED_UPVOTE_"+result)
          }else{
            console.log("ALREADY INCENTIVISED")
          }
        })
      }else{
        console.log("UNINDEXED COUNTS")
      }
    })
  
  }catch(error){
    console.log("error ", error)
  }
};


function depositForNthIdea(ownerUserObject) {
  return StatsAPI.getIdeasCountFromUser(ownerUserObject._id).then((result) => {
    console.log("incetivicing for  ", result + " th idea", Object.keys(GOLD_DEPOSIT_VALUES.IDEA_POST))
    console.log("incetivicing for  ", Object.keys(GOLD_DEPOSIT_VALUES.IDEA_POST).indexOf(""+result))
    if (Object.keys(GOLD_DEPOSIT_VALUES.IDEA_POST).indexOf(""+result) > -1) {
      if(Number(result) > 5){
        console.log("here")
        TribeGoldAPIs.depositGold(
          ownerUserObject,
          Web3Utils.toWei("1", "ether"),
          "IDEAPOST"
        );
      }else{
        console.log("here 2")
        TribeGoldAPIs.depositGold(
          ownerUserObject,
          GOLD_DEPOSIT_VALUES.IDEA_POST[Number(result)],
          "IDEAPOST"
        );
      }
    }else{
      console.log("here 3")

    }
  });
}

const depositEvaluator = {
  depostToNewUser,
  depositForNthIdea,
  depostForFollow,
  depostForUpvote
};

module.exports = depositEvaluator;
