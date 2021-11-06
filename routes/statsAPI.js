const UserSchema = require("../db-config/user.schema");
const ClanSchema = require("../db-config/clan.schema");
const IdeaSchema = require("../db-config/Signature.schema");
const RelationSchema = require("../db-config/relation.schema");
const TransactionSchema = require("../db-config/transaction.schema");
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
  UserSchema.find(findCriteria).count().then( user => {

    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getIdeasCountFromUser = async (req, res) => {
  let findCriteria = {
      owner: req.body.userID
  };
  IdeaSchema.find(findCriteria).count().then( user => {
    if (!user) {
      return res.status(404).json({ success: true, data: [] });
    }
    return res.status(200).json({ success: true, data: user });
  })
};

getTotalUpvotesForUser = async (req, res) => {
  IdeaSchema.find(req.body.owner).then( ideas => {
    if (!ideas) {
      return res.status(404).json({ success: true, data: 0 });
    }
    let count = [];

    for(let i=0; i<ideas.length ; i++){
      let findCriteria = {
        relation: "UPVOTE",
        to: ideas[i].ideaID
      };
      RelationSchema.find(findCriteria).then( user => {
       
        if (user.length) {
          count.push(user)
        }
        if(i == ideas.length - 1) {
          return res.status(200).json({ success: true, data: count });
        }
      })
    }
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

getTotalSalesValue = async (req, res) => {
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

getTotalSalesHeld = async (req, res) => {
  let findCriteria = {
    status: "COMPLETED",
    type: "BUY_IDEA"
  };
  TransactionSchema.find(findCriteria).count().then( user => {
    if (!user) {
      return res.status(404).json({ success: true, data: 0 });
    }
    return res.status(200).json({ success: true, data: user });
  })
};


getTotalTribeGoldDistributed = async (req, res) => {
  console.log("getTotalTribeGoldDistributed")
  let findCriteria = {
    type: "INCENTIVICED"
  };
  TransactionSchema.find(findCriteria).count().then( user => {
    return res.status(200).json({ success: true, data: user || 0 });
  })
};

router.post("/getTotalIdeasOnTribe",getTotalIdeasOnTribe);
router.post("/getTotalUsersOnTribe",getTotalUsersOnTribe);
router.post("/getIdeasCountFromUser",getIdeasCountFromUser);
router.post("/getTotalUpvotesForUser",getTotalUpvotesForUser);
router.post("/getUpvotesForIdea",getUpvotesForIdea);
router.post("/getTotalSalesHeld",getTotalSalesHeld);
router.post("/getTotalTribeGoldDistributed",getTotalTribeGoldDistributed);

// router.post("/getTotalGoldForUser",getTotalGoldForUser);
// router.post("/getTotalSalesValue",getTotalGoldForIdea);

module.exports = router;
