const express = require("express");
const router = express.Router();
const Web3 = require("web3");
const contractJSON = require("../../client/src/contracts/tribeGold.json");
const privateKey = process.env.MATIC_TREASURER;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _ = require("lodash");
const Web3Utils = require("web3-utils");
const networkURL = process.env.NETWORK_URL;
let hdWallet = new HDWalletProvider({
  privateKeys: [privateKey],
  providerOrUrl: process.env.NETWORK_URL,
  pollingInterval: 20000,
});
const web3Instance = new Web3(hdWallet);


depositMatic = (newUserAddress) => {
  console.log("Depositing to new user in TBGApi");
  const promise = new Promise((resolve, reject) => {
      Web3Utils.sendTransaction({to:newUserAddress, from:publicKey, value:web3.toWei("0.5", "ether")})
      .on("receipt", function (receipt) {
        resolve(receipt.transactionHash);
      })
      .on("error", function (error) {
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

    return promise;
  });
}

router.post("/depositMatic", depositMatic);

module.exports = router;
