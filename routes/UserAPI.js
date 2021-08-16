const User = require("../db-config/user.schema");
const express = require("express");
const router = express.Router();

registerUser = (req, res) => {
  const body = req.body;
  body.balance = 1000;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a user",
    });
  }
  const newUser = new User(body);

  if (!newUser) {
    return res.status(400).json({ success: false, error: err });
  }

  newUser
    .save()
    .then((user, b) => {
      return res.status(201).json({
        success: true,
        data: user,
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
  await User.findOne(findCriteria, (err, user) => {
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

updateUser = async (req, res) => {
  console.log("updateUser", req.body);
  const newUser = new User(req.body);
  delete newUser.userName
  await User.findByIdAndUpdate(
    req.body.id, 
    newUser,
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!user) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: user });
    }
  ).catch((err) => {
    return res.status(200).json({ success: false, data: err });
  });
};

getUsers = async (req, res) => {
  console.log("getting users", req.body);

  let findCriteria = {};
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

router.post("/registerUser", registerUser);
router.post("/updateUser", updateUser);
router.post("/getUserInfo", getUserInfo);
router.post("/getUsers", getUsers);


module.exports = router;
