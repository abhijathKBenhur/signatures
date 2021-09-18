const TransactionSchema = require("../db-config/prelaunch.schema");
const express = require("express");
const router = express.Router();
const nodeMailer = require(‘nodemailer’);


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

sendMail = async (req, res) => {
  let sendTo = req.body.mailID
  let ourMailId = "contact@ideatribe.io"

  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true,
    port: 465,
    auth: {
      user: ourMailId,
      pass: "Mail@zoho@10",
    },
  });

  const mailOptions = {
    from: ourMailId,
    to: sendTo,
    subject: "Some subject",
    html: <p>test</p>, // plain text body
   };
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("mail failed")
      return res.status(400).json({ success: false, error: err });
    }
    console.log(
      "sending email"
    )
    return res.status(200).json({ success: true, data: info });
  }).catch((err) => {
    console.log("mail failed"+ err)
    return res.status(200).json({ success: false, data: err });
  });
};






router.post("/subscribe", subscribe);
router.post("/getPrelaunches", getPrelaunches);
router.post("/sendMail", sendMail);




module.exports = router;
