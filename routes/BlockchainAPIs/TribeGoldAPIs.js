const Web3Utils = require("web3-utils");
const _ = require("lodash");


const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const TransactionSchema = require("../../db-config/transaction.schema");
const web3Instance = BlockchainUtils.web3Instance
const publicKey = BlockchainUtils.publicKey
const tribeGoldContract = BlockchainUtils.tribeGoldContract

depositGold = (newUserAddress, ethValue, db_id) => {
  console.log("Depositing to new user in"+ newUserAddress +" " + ethValue);
  const promise = new Promise((resolve, reject) => {
    tribeGoldContract.methods
      .transfer(newUserAddress, ethValue)
      .send({
        from: publicKey,
      })
      .on("receipt", function (receipt) {
        console.log("Deposited to new user in TBGApi");
        new TransactionSchema({
          transactionID: db_id,
          Status: "COMPLETED",
          type: "GOLD_INCENTIVICED",
          user: props.currentUser._id,
          value: ethValue
        }).save()
        resolve(receipt.transactionHash);
      })
      .on("error", function (error) {
        TransactionSchema.findOneAndUpdate({transactionID:db_id},{status:"FAILED"})
        console.log("Deposit feiled to new user in TBGApi");
        console.log("error ", error);
        let transactionHash = _.get(error, "receipt.transactionHash");
        web3Instance.eth
          .getTransaction(transactionHash)
          .then((tx) => {
            web3Instance.eth
              .call(tx, tx.blockNumber)
              .then((result) => {
                resolve(result)
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
  depositGold
};