const ActionSchema = require("../db-config/actions.schema");
const express = require("express");
const router = express.Router();

postAction = (req, res) => {
  const body = req.body;
  body.balance = 1000;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide an action",
    });
  }
  const newAction = new ActionSchema(body);

  if (!newAction) {
    return res.status(400).json({ success: false, error: err });
  }

  newAction
    .save()
    .then((user, b) => {
      return res.status(201).json({
        success: true,
        data: user,
        message: "action poster!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "action poster!",
      });
    });
};

getActions = async (req, res) => {
  let findCriteria = {};
  if (req.body.to) {
    findCriteria.to = req.body.to;
  }

  await ActionSchema.findOne(findCriteria, (err, user) => {
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



router.post("/postAction", postAction);
router.post("/getActions", getActions);

module.exports = router;
