const _ = require("lodash");
const Web3Utils = require("web3-utils");
const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const web3Instance = BlockchainUtils.web3Instance
const TransactionSchema = require("../../db-config/transaction.schema");

const transactionObject = {};

web3Instance.eth.getAccounts().then(result => {
  transactionObject.from = result[2];
})

depositMatic = (receiverUserObject, ethValue) => {
  console.log("INITIATING MATIC DEPOSITS TO " + receiverUserObject.metamaskId)
  const promise = new Promise((resolve, reject) => {
    web3Instance.eth.sendTransaction({...transactionObject,to:receiverUserObject.metamaskId, value:ethValue})
    .on("transactionHash", function(hash) {
      new TransactionSchema({
        transactionID: hash ,
        Status: "COMPLETED",
        type: "MATIC_INCENTIVICED",
        user: receiverUserObject._id,
        value: ethValue
      }).save()
    })
    .once("receipt", function (receipt) {
      TransactionSchema.findOneAndUpdate({transactionID:receipt.transactionHash},{status:"COMPLETED"})
      resolve(receipt.transactionHash);
    })
    .once("error", function (error) {
      let transactionHash = _.get(error, "receipt.transactionHash");
      TransactionSchema.findOneAndUpdate({transactionID:transactionHash},{status:"FAILED"})
      console.log("failed depostto new user in MaticAPI");
      console.log("error ", error);
      resolve("failed depostto new user in MaticAPI")
    });

});
return promise;

};

module.exports = {
  depositMatic,
};
