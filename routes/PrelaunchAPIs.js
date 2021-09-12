const TransactionSchema = require("../db-config/prelaunch.schema");
const express = require("express");
const router = express.Router();


subscribe = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  
  const newTransaction = new TransactionSchema(body);

  if (!newTransaction) {
    return res.status(400).json({ success: false, error: err });
  }

  newTransaction
    .save()
    .then((transaction, b) => {
      return res.status(201).json({
        success: true,
        data: transaction,
        message: "transaction posted!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "transaction posted!",
      });
    });
};


getPrelaunches = async (req, res) => {
  let findCriteria = {};

  await TransactionSchema.find(findCriteria, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    return res.status(200).json({ success: false, data: err });
  });
};



router.post("/subscribe", subscribe);
router.post("/getPrelaunches", getPrelaunches);



module.exports = router;
