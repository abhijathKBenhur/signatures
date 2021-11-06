const _ = require("lodash");
const Web3Utils = require("web3-utils");
const BlockchainUtils = require("../BlockchainAPIs/BlockChainUtils");
const web3Instance = BlockchainUtils.web3Instance
const publicKey = BlockchainUtils.publicKey


depositMatic = (newUserAddress, ethValue) => {
  console.log("Depositing to new user in MaticAPI");
  const promise = new Promise((resolve, reject) => {
    web3Instance.eth.sendTransaction({to:newUserAddress, from:publicKey, value:ethValue})
    .on("receipt", function (receipt) {
    console.log("Deposited Matic to new user");
      resolve(receipt.transactionHash);
    })
    .on("error", function (error) {
      console.log("failed depostto new user in MaticAPI");
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
  depositMatic,
};
