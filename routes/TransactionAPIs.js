const TransactionSchema = require("../db-config/transaction.schema");


const IncentiveSchema = require("../db-config/incentive.Schema");
const express = require("express");
const router = express.Router();

setTransactionState = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }

  const updatedTransaction = {
    status: body.status,
  };

  if (!updatedTransaction) {
    return res.status(400).json({ success: false, error: err });
  }

  TransactionSchema.findOneAndUpdate(
    { transactionID: body.transactionID },
    updatedTransaction
  )
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

postTransaction = (req, res) => {
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

getTransactions = async (req, res) => {
  let findCriteria = {};
  if (req.body.status) {
    findCriteria.status = req.body.status;
  }

  await TransactionSchema.find(findCriteria)
    .populate("from")
    .exec((err, transaction) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!transaction) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: transaction });
    });
};

getGroupedEarnings = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }

  await IncentiveSchema.aggregate([
    {
      $match: {
        email: findCriteria.email,
        status: "COMPLETED"
      },
    },
    {
      $group: { 
        total: { $sum: "$amount" }, 
        _id: "$companyName" ,
      }
    }
  ]).exec((err, transaction) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!transaction) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: transaction });
  });
};

getIncentivesList = async (req, res) => {
  let findCriteria = {};
  if (req.body.status) {
    findCriteria.status = req.body.status;
  }

  await IncentiveSchema.find(findCriteria).exec((err, transaction) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!transaction) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: transaction });
  });
};

router.post("/postTransaction", postTransaction);
router.post("/getTransactions", getTransactions);
router.post("/setTransactionState", setTransactionState);
router.post("/getGroupedEarnings", getGroupedEarnings);
router.get("/getIncentivesList", getIncentivesList);

module.exports = router;
