const ClanSchema = require("../db-config/clan.schema");
const express = require("express");
const router = express.Router();
const NotificationAPI = require("./NotificationAPIs")

createClan = (req, res) => {
  console.log("createClan called");

  const body = req.body;
  body.balance = 1000;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide an action",
    });
  }
  const newClan = new ClanSchema(body);

  if (!newClan) {
    console.log("could not match schema")
    return res.status(400).json({ success: false, error: err });
  }

  console.log("before drea")
  newClan
    .save()
    .then((CreatedClan, b) => {
      console.log("created clan")
      return res.status(201).json({
        success: true,
        data: CreatedClan,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: error,
      });
    });
};

getClans = async (req, res) => {
  let findCriteria = {};
  if (req.body.leader) {
    findCriteria.leader = req.body.leader;
  }

  await ClanSchema.find(findCriteria, (err, user) => {
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



router.post("/createClan", createClan);
router.post("/getClans", getClans);

module.exports = router;
