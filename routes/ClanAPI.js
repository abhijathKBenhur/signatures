const ClanSchema = require("../db-config/clan.schema");
const express = require("express");
const router = express.Router();
const NotificationAPI = require("./NotificationAPIs");
const UserSchema = require("../db-config/user.schema");

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
    console.log("could not match schema");
    return res.status(400).json({ success: false, error: err });
  }

  console.log("before drea");
  newClan
    .save()
    .then((CreatedClan, b) => {
      console.log("created clan");
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


getClan = async (req, res) => {
  let findCriteria = {};
  if (req.body.id) {
    findCriteria.id = req.body.id;
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

getClanMembers = async (req, res) => {
  let findCriteria = {};
  if (req.body.leader) {
    findCriteria.leader = req.body.leader;
  }

  await ClanSchema.findOne(findCriteria, (err, clan) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!clan) {
      return res.status(404).json({ success: true, data: [] });
    }
    let members = clan.members.map(member => {
      return member.memberId
    })
    console.log(JSON.stringify(members))

    UserSchema.find().where('_id').in(members).exec((err, members) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!members) {
        return res.status(404).json({ success: true, data: [] });
      };
      return res.status(200).json({ success: true, data: members });
    });
    
  }).catch((err) => {
    return res.status(200).json({ success: false, data: err });
  });
};

router.post("/createClan", createClan);
router.post("/getClans", getClans);
router.post("/getClan", getClan);
router.post("/getClanMembers", getClanMembers);

module.exports = router;
