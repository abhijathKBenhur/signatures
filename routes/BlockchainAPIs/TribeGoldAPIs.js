const Web3Utils = require("web3-utils");
const _ = require("lodash");

const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const TransactionSchema = require("../../db-config/transaction.schema");
const web3Instance = BlockchainUtils.web3Instance;
const tribeGoldContract = BlockchainUtils.tribeGoldContract;
const getDedicatedGoldContract = BlockchainUtils.getDedicatedGoldContract;
const transactionObject = {};

web3Instance.eth.getAccounts().then(result => {
  transactionObject.from = result[1];
})

depositGold = (receiverUserObject, ethValue, action, fromAddress) => {
  console.log("INITIATING GOLD DEPOSITS TO");
  const promise = new Promise((resolve, reject) => {
    if(fromAddress){
      transactionObject.from = fromAddress.contractAddress;
    }
    
    let senderContract = fromAddress ? getDedicatedGoldContract(fromAddress) : tribeGoldContract
    senderContract.methods
      .transfer(receiverUserObject.metamaskId, ethValue)
      .send(transactionObject)
      .on("transactionHash", function (hash) {
        console.log(
          "transaction to new user " + receiverUserObject.metamaskId + " " + ethValue +" froom : " + fromAddress.contractAddress
        );
        
        new TransactionSchema({
          transactionID: hash,
          Status: "COMPLETED",
          type: action,
          user: receiverUserObject._id,
          value: ethValue,
        }).save();
      })
      .once("receipt", function (receipt) {
        TransactionSchema.findOneAndUpdate(
          { transactionID: receipt.transactionHash },
          { status: "COMPLETED" }
        );
        resolve(receipt.transactionHash);
      })
      .once("error", function (error) {
        let transactionHash = _.get(error, "receipt.transactionHash");
        TransactionSchema.findOneAndUpdate(
          { transactionID: transactionHash },
          { status: "FAILED" }
        );
        console.log("Deposit feiled to new user in TBGApi");
        console.log("error ", error);
        web3Instance.eth
          .getTransaction(transactionHash)
          .then((tx) => {
            web3Instance.eth
              .call(tx, tx.blockNumber)
              .then((result) => {
                resolve(result);
              })
              .catch((err) => {
                console.log("err.message ", err.message);
                reject(err.message);
              });
          })
          .catch((err) => {
            reject(err.toString());
          });
      });
  });
  return promise;
};

module.exports = {
  depositGold,
};
