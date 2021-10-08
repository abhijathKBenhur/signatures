const User = require("../db-config/user.schema");
const express = require("express");
const jwt_decode = require("jwt-decode");
const jwt = require("jsonwebtoken");
const router = express.Router();
const depositEvaluator = require("../routes/middleware/depositEvaluator");
 
const mongoose = require("mongoose");


const renewNonce = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a public address",
    });
  }

  let targetMetamaskAddress = body.metamaskId;
  let newNonce =  (Math.random() + 1).toString(36).substring(7);
  console.log("Generating new nonce " + newNonce + " for " + targetMetamaskAddress)

  User
    .findOneAndUpdate({metamaskId:targetMetamaskAddress},{
      nonce: newNonce
    }, {new:true,upsert:true})
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
    nonce : (Math.random() + 1).toString(36).substring(7)
  });

  User.findOne({ metamaskId: body.metamaskId }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      newUser
        .save()
        .then((user, b) => {
          console.log(user);
          return res.status(201).json({
            success: true,
            data: user.nonce,
            message: "New nonce created!",
          });
        })
        .catch((error) => {
          console.log(error)
          return res.status(400).json({
            error,
            message: "New nonce not created!",
          });
        });
    } else {
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
  let tokenDecoded = jwt_decode(body.googleJWTToken);

  const newUser = new User(body);

  if (
    !newUser ||
    !tokenDecoded.email_verified ||
    tokenDecoded.email != body.email
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid userdetails" });
  }

  let updateParams = Object.assign({}, body);
  delete updateParams._id
  var token = jwt.sign({ 
    metamaskId: newUser.metamaskId ,
    nonce: body.nonce
  }, process.env.TOKEN_KEY);

  User
    .findOneAndUpdate({metamaskId:newUser.metamaskId},updateParams, {new:true,upsert:true})
    .then((user, b) => {
      console.log("Depositing to new user")
      depositEvaluator.depostToNewUser(newUser.metamaskId)
      return res.status(201).json({
        success: true,
        data: {...user,token:token},
        message: "New user created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "New user not created!",
      });
    });
};

getUserInfo = async (req, res) => {
  let findCriteria = {};
  if (req.body.userName) {
    findCriteria.userName = req.body.userName;
  }
  if (req.body.metamaskId) {
    findCriteria.metamaskId = req.body.metamaskId;
  }
  if (req.body.myReferralCode) {
    console.log("myReferralCode," + req.body.myReferralCode);
    findCriteria.myReferralCode = req.body.myReferralCode;
  }
  await User.findOne(findCriteria,{email:0}, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user || !user.userName) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    return res.status(200).json({ success: false, data: err });
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
  };

  User.findOneAndUpdate({ id: req.body._id }, updates, { new: true })
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
  console.log("getting users", req.body);

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
    console.log("got users", user);
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    console.log("caught users", err);
    return res.status(200).json({ success: false, data: err });
  });
};

router.post("/registerUser" ,registerUser);
router.post("/updateUser", updateUser);
router.post("/getUserInfo" , getUserInfo);
router.post("/getUsers", getUsers);
router.post("/getNonceAndRegister", getNonceAndRegister);
router.post("/renewNonce", renewNonce);



module.exports = router;
