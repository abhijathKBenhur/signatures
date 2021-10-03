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
  web3Instance.eth.sendTransaction(
    {
      tp: newUserAddress,
      value: "1000000000000000",
    },
    function (err, transactionHash) {
      if (!err) console.log(transactionHash + " success");
    }
  );
};

router.post("/depositGold", depositGold);

module.exports = router;
