const Web3Utils = require("web3-utils");
const _ = require("lodash");


const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const web3Instance = BlockchainUtils.web3Instance
const publicKey = BlockchainUtils.publicKey

const DEPOSIT_VALUES = {
  REGISTER: Web3Utils.toWei("1","ether"),
};

depositGold = (newUserAddress) => {
  console.log("Depositing to new user in TBGApi");
  const promise = new Promise((resolve, reject) => {
    deployedContract.methods
      .transfer(newUserAddress, DEPOSIT_VALUES.REGISTER)
      .send({
        from: publicKey,
      })
      .on("receipt", function (receipt) {
        console.log("Deposited to new user in TBGApi");
        resolve(receipt.transactionHash);
      })
      .on("error", function (error) {
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