const express = require("express");
const router = express.Router();
const Web3 = require("web3");
const contractJSON = require("../../client/src/contracts/tribeGold.json");
const privateKey = process.env.TRIBE_GOLD_TREASURER;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _ = require("lodash");
const Web3Utils  = require("web3-utils");
const networkURL = process.env.NETWORK_URL;
let hdWallet = new HDWalletProvider({privateKeys:[privateKey] , providerOrUrl : process.env.NETWORK_URL, pollingInterval : 20000})
const web3Instance = new Web3(hdWallet);
const publicKey =
  web3Instance.eth.accounts.privateKeyToAccount(privateKey).address;
  const jwt = require("jsonwebtoken");
const deployedContract = new web3Instance.eth.Contract(
  contractJSON.abi,
  contractJSON.address,
  {
    gas: 500000
  }
);

const DEPOSIT_VALUES = {
    REGISTER: 1 * 10^18,
}

depositGold = (newUserAddress) => {
const promise = new Promise((resolve, reject) => {
  deployedContract.methods
  .transfer(newUserAddress, DEPOSIT_VALUES.REGISTER)
  .send({
    from: publicKey,
  })
  .on("receipt", function (receipt) {
    resolve(receipt.transactionHash)
  })
  .on("error", function (error) {
    console.log("error ", error)
    let transactionHash = _.get(error,'receipt.transactionHash');
      web3Instance.eth.getTransaction(transactionHash).then(tx =>{
          web3Instance.eth.call(tx, tx.blockNumber).then(result => {
        }).catch(err =>{
          reject(err.toString())
        })
    }).catch(err =>{
        reject(err.toString())
    })
  });

  return promise
});
};


router.post("/depositGold", depositGold);


module.exports = router;
