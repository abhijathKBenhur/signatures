const express = require("express");
const router = express.Router();
const getRevertReason = require("eth-revert-reason");
const Web3 = require("web3");
const contractJSON = require("../client/src/contracts/ideaTribe.json");
const privateKey = process.env.PROGRAMMER_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");
const _ = require("lodash");
const Web3Utils  = require("web3-utils");
const networkURL = process.env.NETWORK_URL;
let hdWallet = new HDWalletProvider({privateKeys:[privateKey] , providerOrUrl : process.env.NETWORK_URL, pollingInterval : 20000})
const web3Instance = new Web3(hdWallet);
const UserSchema = require("../db-config/user.schema");
const publicKey =
  web3Instance.eth.accounts.privateKeyToAccount(privateKey).address;

const deployedContract = new web3Instance.eth.Contract(
  contractJSON.abi,
  contractJSON.address,
  {
    gas: 500000
  }
);
const transactionObject = {
  from: publicKey,
};

register_user = (req, res) => {
  let metamaskAddress = req.body.metamaskId;
  let userName = req.body.userName;
  let messageHash = web3Instance.utils.fromUtf8(`I approve and sign to register in ideaTribe. Nonce:${req.body.nonce}`)
  console.log("Signing messageHash", messageHash)
  web3Instance.eth.personal.ecRecover(messageHash, req.body.secret).then(success => {
    console.log("ecRecover ", success)
    UserSchema.findOne({ metamaskId: success }).then(user =>{
      if(user.nonce == req.body.nonce){
        deployedContract.methods
        .register_user(metamaskAddress, userName)
        .send(transactionObject)
        // .on("transactionHash", function (hash) {
        //   console.log("receipt transactionHash", hash);
        // })
        .on("receipt", function (receipt) {
          console.log("receipt ", receipt)
          return res.status(200).json({ success: true, data: receipt });
        })
        .on("error", function (error) {
          console.log("error ", error)
          let transactionHash = _.get(error,'receipt.transactionHash');
          getRevertReason(transactionHash, process.env.NETWORK_NAME).then(
            (errorReason) => {
              error.errorReason = errorReason;
              return res.status(400).json({ success: false, data: errorReason });
            }
          ).catch(err =>{
            return res.status(400).json({ success: false, data: transactionHash });
          })

        });
      }
    })
    
  })
};


router.post("/register_user", register_user);

module.exports = router;
