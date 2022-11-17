const CustomerSchema = require("../db-config/Customer.Schema");
const express = require("express");
const router = express.Router();
const TribeGoldAPIs = require("./BlockchainAPIs/TribeGoldAPIs");
const Web3Utils = require("web3-utils");


getPassportBalance = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }
  CustomerSchema.findOne(findCriteria).then((user) => {
    console.log("AA")
    if(user){
      console.log("BB")
      console.log("passport balance", user)
      res.status(200).json({ success: true, data: user });
    }else{
      console.log("CC")
      return res.status(404).json({ success: true, data: [] });
    } 
  }).catch(err =>{
    console.log("DD")
    return res.status(400).json({ success: false, data: err });
  })
};

 
redeemGold = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }

  await CustomerSchema.findOneAndUpdate(findCriteria,{balance:0}, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    console.log("redeeming",user)
    if(user.balance > 0){
      TribeGoldAPIs.depositGold(
        req.body,
        Web3Utils.toWei(String(user.balance), "ether"),
        "REDEEM"
      ).then(success =>{
        console.log("deposited", success)
        return res.status(200).json({ success: true, data: user });
      }).catch(err =>{
        console.log("error", err)
        return res.status(400).json({ success: false, data: err });
      })
    }
    else{
      return res.status(400).json({ success: false, data: {msg:"Insuficient balance"} });
    }
  }).catch((err) => {
    console.log("err", err)
    return res.status(400).json({ success: false, data: err });
  });
};

router.post("/getPassportBalance", getPassportBalance);
router.post("/redeemGold", redeemGold);

module.exports = router;