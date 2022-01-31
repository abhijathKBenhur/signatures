const User = require("../db-config/user.schema");
const express = require("express");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const router = express.Router();
const depositEvaluator = require("../routes/middleware/depositEvaluator");
const _ = require("lodash");
const mongoose = require("mongoose");
const nodeMailer = require("nodemailer");

const renewNonce = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a public address",
    });
  }

  let targetMetamaskAddress = body.metamaskId;
  let newNonce = (Math.random() + 1).toString(36).substring(2);
  console.log(
    "Generating new nonce " + newNonce + " for " + targetMetamaskAddress
  );

  User.findOneAndUpdate(
    { metamaskId: targetMetamaskAddress },
    {
      nonce: newNonce,
    },
    { new: true, upsert: true }
  )
    .then((user, b) => {
      return res.status(201).json({
        success: true,
        data: user,
        message: "New nonce saved!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "New nonce not created!",
      });
    });
};

getNonceAndRegister = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a public address",
    });
  }

  const newUser = new User({
    metamaskId: body.metamaskId,
    nonce: (Math.random() + 1).toString(36).substring(7),
  });

  User.findOne({ metamaskId: body.metamaskId }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      console.log("NEW USER CREATION");
      newUser
        .save()
        .then((user, b) => {
          console.log("NEW USER CREATED", user);
          return res.status(201).json({
            success: true,
            data: user.nonce,
            message: "New nonce created!",
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            error,
            message: "New nonce not created!",
          });
        });
    } else {
      console.log("EXISTING USER RETURNED", user);
      return res.status(200).json({ success: true, data: user.nonce });
    }
  }).catch((err) => {
    return res.status(501).json({ success: false, data: err });
  });
};

registerUser = (req, res) => {
  const body = req.body;
  body.balance = 1000;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a user",
    });
  }
  console.log("DECODING TOKEN");

  const newUser = new User(body);
  let responseMap = {
    created: false,
    maticDeposit: false,
    goldDeposit: false,
  };

  let updateParams = Object.assign({}, body);
  delete updateParams._id;
  var token = jwt.sign(
    {
      metamaskId: newUser.metamaskId,
      nonce: body.nonce,
    },
    process.env.TOKEN_KEY
  );
  console.log("ADDING COMPLETE USER DETAILS");
  User.findOneAndUpdate({ metamaskId: newUser.metamaskId }, updateParams, {
    new: true,
    upsert: true,
  })
    .then((user, b) => {
      responseMap.created = true;
      console.log("ADDED COMPLETE USER DETAILS", user);

      depositEvaluator.depostToNewUser(newUser);
      return res.status(201).json({
        success: true,
        data: { ...user, token: token },
        message: "New user created!",
      });
    })
    .catch((error) => {
      console.log("USER DETAILS UPLOAD FAILED", error);
      return res.status(400).json({
        error,
        data: responseMap,
        message: "New user not created!",
      });
    });
};

getUserInfo = async (req, res) => {
  let findCriteria = {};
  if (req.body.email) {
    findCriteria.email = req.body.email;
  }
  if (req.body.userName) {
    findCriteria.userName = req.body.userName;
  }
  // findCriteria.userName = "$regex: " + req.body.userName +" , $options: 'i'";

  if (req.body.metamaskId) {
    findCriteria.metamaskId = req.body.metamaskId;
  }

  if (req.body.myReferralCode) {
    console.log("myReferralCode," + req.body.myReferralCode);
    findCriteria.myReferralCode = req.body.myReferralCode;
  }
  // await User.findOne(findCriteria,{email:0}, (err, user) => {
  await User.findOne(findCriteria, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user || !user.userName) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    console.log(err)
    return res.status(400).json({ success: false, data: err });
  });
};

updateUser = async (req, res) => {
  const newUser = req.body;
  let updates = {
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    facebookUrl: newUser.facebookUrl,
    linkedInUrl: newUser.linkedInUrl,
    twitterUrl: newUser.twitterUrl,
    instaUrl: newUser.instaUrl,
    bio: newUser.bio,
    imageUrl: newUser.imageUrl
  };
  console.log("testing");
  User.findByIdAndUpdate(req.body.id, updates, { upsert: true })
    .then((user, b) => {
      console.log("user updated", user, b);
      return res.status(201).json({
        success: true,
        data: user,
        message: "user updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "user update failed!",
      });
    });
};

getUsers = async (req, res) => {
  let findCriteria = {};
  let ids = req.body.ids;
  function getMongooseIds(stringId) {
    return mongoose.Types.ObjectId(stringId);
  }
  if (req.body.myReferralCode) {
    console.log("myReferralCode," + req.body.myReferralCode);
    findCriteria.myReferralCode = req.body.myReferralCode;
  }
  if (ids) {
    findCriteria._id = {
      $in: ids.map(getMongooseIds),
    };
  }
  await User.find(findCriteria, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    console.log("caught users", err);
    return res.status(200).json({ success: false, data: err });
  });
};

removeUser = async (req, res) => {
  let findCriteria = {
    userName: req.body.userName,
  };
  await User.remove(findCriteria, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    console.log("removed users", user);
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    console.log("removed users", err);
    return res.status(200).json({ success: false, data: err });
  });
};

sendMail = async (req, res) => {
  let sendTo = req.body.tempEmail;
  let ourMailId = "contact@ideatribe.io";
  let otp = (Math.random() + 1).toString(36).substring(7).toUpperCase();

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
    subject: "Welcome to IdeaTribe",
    html: `<h2><b>Hello friend,</b></h2> 
    <h3>Thank you for registering with IdeaTribe.</h3>
    <br/>
      Here is your OTP to sign up - ${otp}
    <br/>
    <br/>
      
Welcome to the Tribe 
<br/>
- Founding Tribers
    <br/>

    `,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    console.log("sending mail");
    if (err) {
      console.log("mail failed");
      return res.status(400).json({ success: false, error: err });
    }
    console.log("sending email");
    return res.status(200).json({ success: true, data: otp });
  });
};
router.post("/registerUser", registerUser);
router.post("/updateUser", updateUser);
router.post("/getUserInfo", getUserInfo);
router.post("/getUsers", getUsers);
router.post("/getNonceAndRegister", getNonceAndRegister);
router.post("/renewNonce", renewNonce);
router.post("/removeUser", removeUser);
router.post("/sendMail", sendMail);

module.exports = router;
