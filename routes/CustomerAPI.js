const IncentiveSchema = require("../db-config/rewards.Schema");
const CustomerSchema = require("../db-config/Customer.Schema");
const CompanySchema = require("../db-config/Company.Schema");

const express = require("express");
const router = express.Router();
const TribeGoldAPIs = require("./BlockchainAPIs/TribeGoldAPIs");
const Web3Utils = require("web3-utils");

getPassportBalance = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }
  CustomerSchema.findOne(findCriteria)
    .then((user) => {
      console.log("AA");
      if (user) {
        console.log("BB");
        console.log("passport balance", user);
        res.status(200).json({ success: true, data: user });
      } else {
        console.log("CC");
        return res.status(404).json({ success: true, data: [] });
      }
    })
    .catch((err) => {
      console.log("DD");
      return res.status(400).json({ success: false, data: err });
    });
};

redeemGold = async (req, res) => {
  console.log("Redeeming gold")
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.companyName = req.body.companyName;
  }
  let userElligibility = await IncentiveSchema.aggregate([
    {
      $match: {
        email: req.body.email,
        status: "COMPLETED"
      },
    },
    {
      $group: {
        total: { $sum: "$amount" },
        _id: "$companyName",
      },
    },
    {
      $match: {
        _id: findCriteria.companyName,
      },
    },
  ]).exec();

  console.log(userElligibility);
  let company = await CompanySchema.findOne(findCriteria);
  console.log("FOund company details", company)
  if (userElligibility && userElligibility[0] && userElligibility[0].total <= company.balance) {
    console.log("Transferring , ", userElligibility[0].total + " from the company balance of "+ company.balance)
    console.log("private kley ---- "+company.pKey);
    console.log("metamask ID kley ---- " + req.body.metamaskId)

    TribeGoldAPIs.depositGold(
      req.body,
      Web3Utils.toWei(String(userElligibility[0].total), "ether"),
      "REDEEM",
      company
    )
      .then((success) => {
        console.log("deposited", success);
        updateUserDetails({email:req.body.email}, {
          $inc : 
          {
            'balance' : 0 - (userElligibility[0].total),
          }
        });
        console.log("reduced user balance", userElligibility[0].total);

    
        console.log("updating all incentives with ", company.tenantId + " email : " + req.body.email)
        IncentiveSchema.updateMany(
          {
            tenantId:company.tenantId,
            email:req.body.email
    
          },
          { "status": "REDEEMED" }
        )
        console.log("updated redeem status");

        return res.status(200).json({ success: true, data: "Redemption is success" });
      })
      .catch((err) => {
        console.log("error", err);
        return res.status(400).json({ success: false, data: err });
      });

  }else{
    return res.status(400).json({ success: false, data: "Not enough balance" });
  }

};

redeemGoldFromTribe = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }

  await CustomerSchema.findOneAndUpdate(
    findCriteria,
    { balance: 0 },
    (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!user) {
        return res.status(404).json({ success: true, data: [] });
      }
      console.log("redeeming", user);
      if (user.balance > 0) {
        TribeGoldAPIs.depositGold(
          req.body,
          Web3Utils.toWei(String(user.balance), "ether"),
          "REDEEM"
        )
          .then((success) => {
            console.log("deposited", success);
            return res.status(200).json({ success: true, data: user });
          })
          .catch((err) => {
            console.log("error", err);
            return res.status(400).json({ success: false, data: err });
          });
      } else {
        return res
          .status(400)
          .json({ success: false, data: { msg: "Insuficient balance" } });
      }
    }
  ).catch((err) => {
    console.log("err", err);
    return res.status(400).json({ success: false, data: err });
  });
};

const updateCompanyDetails = async (req, updates) => {
  console.log("updating company with", updates);
  return new Promise((resolve, reject) => {
    CompanySchema.findOneAndUpdate(
      { key: req.key, secret: req.secret },
      updates,
      { upsert: true }
    )
      .then((user, b) => {
        console.log("Update company success");
        resolve(user);
      })
      .catch((error) => {
        reject("Update company error" + error);
      });
  });
};

const updateUserDetails = async (user, updates) =>{
  return new Promise((resolve, reject) => {
    CustomerSchema.findOneAndUpdate(
      { email: user.email },
      updates,
      { upsert: true }
    )
      .then((user, b) => {
        resolve();
      })
      .catch((error) => {
        reject("Update user error" + error);
      });
  })
}


router.post("/getPassportBalance", getPassportBalance);
router.post("/redeemGold", redeemGold);

module.exports = router;
