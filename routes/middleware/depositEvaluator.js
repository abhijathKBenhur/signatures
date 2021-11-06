const Web3Utils = require("web3-utils");
const MaticAPIs = require("../BlockchainAPIs/MaticAPIs");
const TribeGoldAPIs = require("../BlockchainAPIs/TribeGoldAPIs");
const StatsAPI = require("../statsAPI");
const GOLD_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("1", "ether"),
  IDEA_POST: {
    1: Web3Utils.toWei("1", "ether"),
    2: Web3Utils.toWei("2", "ether"),
    5:Web3Utils.toWei("1", "ether"),
    6:Web3Utils.toWei("1", "ether"),
    7:Web3Utils.toWei("1", "ether"),
    8:Web3Utils.toWei("1", "ether"),
    10:Web3Utils.toWei("1", "ether"),
    11:Web3Utils.toWei("1", "ether"),
    12:Web3Utils.toWei("1", "ether"),
    13:Web3Utils.toWei("1", "ether"),
    14:Web3Utils.toWei("1", "ether"),
    20:Web3Utils.toWei("1", "ether"),
    19:Web3Utils.toWei("1", "ether"),
    18:Web3Utils.toWei("1", "ether"),
    17:Web3Utils.toWei("1", "ether"),
  },
};

const MATIC_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("0.01", "ether"),
};

const depostToNewUser = (newUserAddress) => {
  return Promise.all([
    TribeGoldAPIs.depositGold(newUserAddress, GOLD_DEPOSIT_VALUES.REGISTER),
    MaticAPIs.depositMatic(newUserAddress, MATIC_DEPOSIT_VALUES.REGISTER),
  ]);
};


function depositForNthIdea(creator) {
  return StatsAPI.getIdeasCountFromUser(creator._id).then((result) => {
    console.log("incetivicing for  ", result + " th idea")
    if (Object.keys(GOLD_DEPOSIT_VALUES.IDEA_POST).indexOf(""+result) > -1) {
      TribeGoldAPIs.depositGold(
        creator.metamaskId,
        GOLD_DEPOSIT_VALUES.IDEA_POST[Number(result)]
      );
    }
  });
}

const depositEvaluator = {
  depostToNewUser,
  depositForNthIdea,
};

module.exports = depositEvaluator;
