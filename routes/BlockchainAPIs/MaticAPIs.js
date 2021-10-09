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
  pollingInterval: 2000000,
});
const web3Instance = new Web3(hdWallet);
const publicKey =
  web3Instance.eth.accounts.privateKeyToAccount(privateKey).address;

depositMatic = (newUserAddress) => {
  console.log("Depositing to new user in MaticAPI");
  const promise = new Promise((resolve, reject) => {
    web3Instance.eth.sendTransaction({to:newUserAddress, from:publicKey, value:Web3Utils.toWei("0.03", "ether")})
    .on("receipt", function (receipt) {
    console.log("Deposited to new user in MaticAPI");

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
