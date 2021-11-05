const RelationSchema = require("../db-config/relation.schema");
const express = require("express");
const router = express.Router();
 

// upvotes, downvotes, followEtc
postRelation = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  const newRelation = new RelationSchema(body);

  if (!newRelation) {
    return res.status(400).json({ success: false, error: err });
  }

  newRelation
    .save()
    .then((user, b) => {
      return res.status(201).json({
        success: true,
        data: user,
        message: "Relation updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Relation not updated!",
      });
    });
};

removeRelation = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  const newRelation = new RelationSchema(body);

  if (!newRelation) {
    return res.status(400).json({ success: false, error: err });
  }
  let findCriteria = {
    to: req.body.to,
    from: req.body.from,
    relation: req.body.relation
  }
 console.log("removing nori",findCriteria)
  RelationSchema
    .deleteOne(
      findCriteria
    )
    .then((relation, b) => {
      return res.status(201).json({
        success: true,
        data: relation,
        message: "Relation removed!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Relation not updated!",
      });
    });
};

getRelations = async (req, res) => {
  let findCriteria = {};
  if (req.body.to) {
    findCriteria.to = req.body.to;
  }
  if (req.body.status) {
    findCriteria.status = req.body.status;
  }

  await RelationSchema.find(findCriteria).then(user => {
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => {
    return res.status(200).json({ success: false, data: err });
  });
};



router.post("/postRelation", postRelation);
router.post("/getRelations", getRelations);
router.post("/removeRelation", removeRelation);


module.exports = router;
