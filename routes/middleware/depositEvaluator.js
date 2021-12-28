const Web3Utils = require("web3-utils");
const MaticAPIs = require("../BlockchainAPIs/MaticAPIs");
const TribeGoldAPIs = require("../BlockchainAPIs/TribeGoldAPIs");
const StatsAPI = require("../statsAPI");

const UserSchema = require("../../db-config/user.schema");
const SignatureSchema = require("../../db-config/Signature.schema");
const TransactionSchema = require("../../db-config/transaction.schema");

const whitelistMailList1 = ["Lathababu6771@gmail.com","sudhirdipti4@gmail.com","yjtrop@gmail.com","cvenkat@gmail.com","Kkarkera@gmail.com","saihariharan2002@gmail.com","mastankareem1@gmail.com","Bayoadewoye1@gmail.com","Kennychasemore@gmail.com","highonvisuals@gmail.com","venky4971@live.com","nithingowda2206@gmail.com","seanavida@gmail.com","grovnest@gmail.com","Abhishekparashara03@gmail.com","vk910101@gmail.com","kaivalya1505@gmail.com","abhi.c.ram@gmail.com","balamd@hotmail.com","spershetty@gmail.com","Rakesh.sreekumar@gmail.com","swapnil.akolkar712@gmail.com","Phalke@gmail.com","raj-shah@sbcglobal.net","Vikram.bhanot@gmail.com","whydoyouwanttoknowmyemailid@gmail.com","imamaljith@gmail.com","rohnrejil@gmail.com","jia@edeify.com","iamdurrrjr@gmail.com"];
const whitelistMailList2 = ["Joteacher03@gmail.com","Saihariharan2002@gmail.com","Bryanangwhcrypto@gmail.com","nicolas.haughn@gmail.com","24x7sumant@gmail.com","arun.mitteam@gmail.com","kpsssrinivas@gmail.com","shilpasrinath@hotmail.com","knudson.j907@gmail.com","johnsolomonfernandez@gmail.com","davidlaumiami@icloud.com","athidiii02@gmail.com","vegetakrish@gmail.com","tylerkivelson@gmail.com","prabhakaran.rishie@gmail.com","ashuujadhav123@gmail.com","N_pareek@yahoo.com","Shabiravirani@hotmail.com","pai.hareesh@gmail.com","kirankmk24@gmail.com","kbpavan1101@gmail.com","abhilash.wasekar.2021@iimu.ac.in","jinish9122@gmail.com","vinnivarghese007@gmail.com","chirag0gulecha@gmail.com","Bossrockers1@gmail.com","pushpakhardrocker@gmail.com","hriteshshetty523@gmail.com","omichugh14@gmail.com","sh.jodvp@slmail.me","ujwaluthappa32@gmail.com","jairockstar1@gmail.com","trishasimbajon22@yahoo.com","johniversheen22@gmail.com","jose.simbajon11@gmail.com","princetoncaidrick6@gmail.com","Zeus6799@gmail.com","surajpatil2398@gmail.com","arthas0402@gmail.com","bakkubaku@gmail.com","kr1998275@gmail.com","namit.venu@gmail.com","homestar5377@yahoo.com","rohitf@gmail.com","arbit.rambler@gmail.com","Sureshr05@gmail.com","ramnath.shenoy@gmail.com","mukundaniyengar@icloud.com","amiyo.chatterjee@gmail.com","Ranjeev@hotmail.co.in"];

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

let whiteList1MemberGold = Web3Utils.toWei("10", "ether");
let whiteList2MemberGold = Web3Utils.toWei("5", "ether");

const getGoldToDeposit =(userObject) =>{
  if(whitelistMailList1.indexOf(userObject.email) > -1 ){
    return whiteList1MemberGold;
  }
  else if(whitelistMailList2.indexOf(userObject.email) > -1 ){
    return whiteList2MemberGold;
  }else{
    return GOLD_DEPOSIT_VALUES.REGISTER;
  }
}

const MATIC_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei(process.env.REGISTER_MATIC_DEPOSIT || "0.1", "ether"),
};

const depostToNewUser = (receiverUserObject) => {
  console.log("INITIATING DEPOSITS")
  if(receiverUserObject.referredBy){
    UserSchema.findOne({myReferralCode:receiverUserObject.referredBy}).then(result =>{
      console.log("Referer", result.data)
      TribeGoldAPIs.depositGold(result.data, GOLD_DEPOSIT_VALUES.REFERAL,"GOLD_INCENTIVICED_REFERAL")
    })
  }
 
  
  TribeGoldAPIs.depositGold(receiverUserObject, 
    GOLD_DEPOSIT_VALUES.REGISTER,
    "GOLD_INCENTIVICED_REGISTER")
  MaticAPIs.depositMatic(receiverUserObject, getGoldToDeposit(receiverUserObject),"REGISTER")
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
