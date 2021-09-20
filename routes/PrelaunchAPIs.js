const TransactionSchema = require("../db-config/prelaunch.schema");
const express = require("express");
const router = express.Router();
const nodeMailer = require("nodemailer");


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

  let transporter = nodeMailer.createTransport({
    host: "smtp.zoho.in",
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
    subject: "Welcome to ideatribe",
    html: 
    `<h2><b>Hello friend,</b></h2> 
    <h3>Thank you for registering with IdeaTribe.</h3>
    <br/>
      We want to make it easy for you to secure your ideas on the blockchain and find glorious, sweet success!
    <br/>
    <br/>
      We will launch soon. Stay tuned for news from us.
    <br/>
    <br/>
      Meanwhile, keep dreaming, keep creating!
    <br/>
    <br/>
    -The founding Tribers
    <br/>

    <img src="https://res.cloudinary.com/ideatribe/image/upload/v1632150413/public/welcome.png" width='250px'/>
    `
    
   };
  await transporter.sendMail(mailOptions, (err, info) => {
    console.log("sending mail")
    if (err) {
      console.log("mail failed",)
      return res.status(400).json({ success: false, error: err });
    }
    console.log(
      "sending email"
    )
    return res.status(200).json({ success: true, data: info });
  })
};






router.post("/subscribe", subscribe);
router.post("/getPrelaunches", getPrelaunches);
router.post("/sendMail", sendMail);




module.exports = router;
