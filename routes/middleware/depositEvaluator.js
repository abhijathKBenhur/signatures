const Web3Utils = require("web3-utils");
const MaticAPIs = require("../BlockchainAPIs/MaticAPIs");
const TribeGoldAPIs = require("../BlockchainAPIs/TribeGoldAPIs");
const StatsAPI = require("../statsAPI");
const GOLD_DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("1", "ether"),
  IDEA_POST: {
    1: Web3Utils.toWei("1", "ether"),
    2: Web3Utils.toWei("2", "ether"),
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

function depositForNthIdea(creatorMetamaskAddress) {
  conso.log("inside depositForNthIdea")
  StatsAPI.getIdeasCountFromUser({
    metamasId: creatorMetamaskAddress,
  }).then((result) => {
    console.log("count of ideas " + result.data);
    if (Object.keys(GOLD_DEPOSIT_VALUES).indexOf(result.data) > -1) {
      TribeGoldAPIs.depositGold(
        creatorMetamaskAddress,
        GOLD_DEPOSIT_VALUES.IDEA_POST[result.data]
      );
    }
  });
}

const depositEvaluator = {
  depostToNewUser,
  depositForNthIdea,
};

module.exports = depositEvaluator;
