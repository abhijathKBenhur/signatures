const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const UserSchema = require("../../db-config/user.schema");


const BlockchainUtils = require("./BlockChainUtils");
const web3Instance = BlockchainUtils.web3Instance
const publicKey = BlockchainUtils.publicKey
const ideaTribeContract = BlockchainUtils.ideaTribeContract


const transactionObject = {
  from: publicKey,
};
const SIGNATURE_MESSAGE = "Welcome to IdeaTribe! Click 'Sign' to sign in. No password needed! This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will be reset after 24 hours. I accept the IdeaTribe Terms of Service: https://ideatribe.io. Nonce: ";

verifySignature =  (req, res) => {
  
  let nonce = req.body.nonce;
  let messageHash = web3Instance.utils.fromUtf8(SIGNATURE_MESSAGE+ nonce)
  console.log("recovering hash")
  web3Instance.eth.personal.ecRecover(messageHash, req.body.secret).then(success => {
    console.log("recovered hash" + success)
    UserSchema.findOne({ metamaskId: success }).then(signedUser =>{
      console.log("received signatures for" , signedUser.userName)
      if(signedUser.nonce == req.body.nonce){
        var token = jwt.sign({ 
          metamaskId: signedUser.metamaskId ,
          nonce: req.body.nonce
        }, process.env.TOKEN_KEY);
        return res.status(200).json({ success: true, data: {...signedUser,token:token} });
      }
      else{
        return res.status(400).json({ success: false, data: "FAILED TO SIGN" });
      }
    })
  }).catch(err => {
    console.log("kopile ec recover")
  })
}

register_user = (req, res) => {
  let metamaskAddress = req.body.metamaskId;
  let userName = req.body.userName;
  let messageHash = web3Instance.utils.fromUtf8(SIGNATURE_MESSAGE+ req.body.nonce)
  web3Instance.eth.personal.ecRecover(messageHash, req.body.secret).then(success => {
    console.log("recover success  " + success)
    UserSchema.findOne({ metamaskId: success }).then(user =>{
      console.log(user)
      if(user.nonce == req.body.nonce){
        ideaTribeContract.methods
        .registerUser(metamaskAddress, userName)
        .send(transactionObject)
        .on("receipt", function (receipt) {
          console.log("CONTRACT REGISTRATION SUCCESS")
          return res.status(200).json({ success: true, data: receipt });
        })
        .on("error", function (error) {
          console.log("error ", error)
          let transactionHash = _.get(error,'receipt.transactionHash');
            web3Instance.eth.getTransaction(transactionHash).then(tx =>{
                web3Instance.eth.call(tx, tx.blockNumber).then(result => {
                  return res.status(400).json({ success: false, data: result });
              }).catch(err =>{
                console.log("********"+err)
                return res.status(400).json({ success: false, data: err.message.toString() });
              })
          }).catch(err =>{
            console.log("********"+err.toString())
            return res.status(400).json({ success: false, data: "Transaction invalid" });
          })
        });
      }
    })
  })
};


router.post("/register_user", register_user);
router.post("/verifySignature", verifySignature);


module.exports = router;
