const UserSchema = require("../db-config/user.schema");
const ClanSchema = require("../db-config/clan.schema");
const IdeaSchema = require("../db-config/Signature.schema");
const RelationSchema = require("../db-config/relation.schema");
const express = require("express");
const router = express.Router();



getTotalIdeasOnTribe = async (req, res) => {
  let findCriteria = {};
  IdeaSchema.find(findCriteria).count().then(err, user => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getTotalUsersOnTribe = async (req, res) => {
  let findCriteria = {};
  UserSchema.find(findCriteria).count().then(err, user => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getIdeasFromUser = async (req, res) => {
  let findCriteria = {
    owner: req.body.id
  };
  RelationSchema.find(findCriteria).count().then(err, user => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getTotalUpvotesForUser = async (req, res) => {
  let findCriteria = {
    relation: "UPVOTE",

  };
  RelationSchema.find(findCriteria).count().then(err, user => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

router.post("getTotalIdeasOnTribe",getTotalIdeasOnTribe);
router.post("getTotalUsersOnTribe",getTotalUsersOnTribe);
router.post("getIdeasFromUser",getIdeasFromUser);
router.post("getTotalUpvotesForUser",getTotalUpvotesForUser);

module.exports = router;