const Web3Utils = require("web3-utils");
const MaticAPIs = require("../BlockchainAPIs/MaticAPIs");
const TribeGoldAPIs = require("../BlockchainAPIs/TribeGoldAPIs");
const StatsAPI = require("../statsAPI");
const GOLD_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("1", "ether"),
  IDEA_POST: {
    1: Web3Utils.toWei("3", "ether"),
    2: Web3Utils.toWei("2", "ether"),
    3: Web3Utils.toWei("2", "ether"),
    4: Web3Utils.toWei("2", "ether"),
    5: Web3Utils.toWei("2", "ether"),
  },
};

const MATIC_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("0.01", "ether"),
};

const depostToNewUser = (newUserAddress, db_id) => {
  return Promise.all([
    TribeGoldAPIs.depositGold(newUserAddress, GOLD_DEPOSIT_VALUES.REGISTER, db_id),
    MaticAPIs.depositMatic(newUserAddress, MATIC_DEPOSIT_VALUES.REGISTER, db_id),
  ]);
};


const depostForFollow = (newUserAddress) => {
  console.log("depositing for follow  - " + newUserAddress)
  return TribeGoldAPIs.depositGold(newUserAddress, Web3Utils.toWei("1", "ether"))
};

const depostForUpvote = (newUserAddress) => {
  console.log("depositing for upvote - " + newUserAddress)
  return TribeGoldAPIs.depositGold(newUserAddress, Web3Utils.toWei("1", "ether"))
};


function depositForNthIdea(creator) {
  return StatsAPI.getIdeasCountFromUser(creator._id).then((result) => {
    console.log("incetivicing for  ", result + " th idea")
    if (Object.keys(GOLD_DEPOSIT_VALUES.IDEA_POST).indexOf(""+result) > -1) {
      if(Number(result) > 5){
        TribeGoldAPIs.depositGold(
          creator.metamaskId,
          Web3Utils.toWei("1", "ether")
        );
      }else{
        TribeGoldAPIs.depositGold(
          creator.metamaskId,
          GOLD_DEPOSIT_VALUES.IDEA_POST[Number(result)]
        );
      }
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
