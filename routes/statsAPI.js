const UserSchema = require("../db-config/user.schema");
const ClanSchema = require("../db-config/clan.schema");
const IdeaSchema = require("../db-config/Signature.schema");
const RelationSchema = require("../db-config/relation.schema");
const express = require("express");
const router = express.Router();

getTotalIdeasOnTribe = async (req, res) => {
  let findCriteria = {};
  console.log("requesting getTotalIdeasOnTribe")

  IdeaSchema.find(findCriteria).count().then( count => {
    if (!count) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: count });
  })
};

getTotalUsersOnTribe = async (req, res) => {
  let findCriteria = {};
  console.log("requesting getTotalUsersOnTribe")
  UserSchema.find(findCriteria).count().then( user => {
 
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getIdeasFromUser = async (req, res) => {
  console.log("finding by ID" + req.body.owner)
  IdeaSchema.findById(req.body.owner).count().then( user => {
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getTotalUpvotesForUser = async (req, res) => {
  let findCriteria = {
    relation: "UPVOTE",
    to: req.body.userName
  };
  RelationSchema.find(findCriteria).count().then( user => {
    
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getUpvotesForIdea = async (req, res) => {
  let findCriteria = {
    relation: "UPVOTE",
    to: req.body.ideaId
  };
  RelationSchema.find(findCriteria).count().then( user => {
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

router.post("/getTotalIdeasOnTribe",getTotalIdeasOnTribe);
router.post("/getTotalUsersOnTribe",getTotalUsersOnTribe);
router.post("/getIdeasFromUser",getIdeasFromUser);
router.post("/getTotalUpvotesForUser",getTotalUpvotesForUser);
router.post("/getUpvotesForIdea",getUpvotesForIdea);
// router.post("/getTotalGoldForUser",getTotalGoldForUser);
// router.post("/getTotalGoldForIdea",getTotalGoldForIdea);

module.exports = router;
