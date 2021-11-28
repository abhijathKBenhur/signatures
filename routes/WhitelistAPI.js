const WhitelistSchema = require("../db-config/whitelist.schema");
const express = require("express");
const router = express.Router();
 

addWhitelistCode = (req, res) => {
  const body = req.body;
  console.log("inside addWhitelistCode")
  console.log(req)
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  const newComment = new WhitelistSchema(body);  

  if (!newComment) {
    return res.status(400).json({ success: false, error: err });
  }

  newComment
    .save()
    .then((user, b) => {
      return res.status(201).json({
        success: true,
        data: user,
        message: "comment updated!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "comment not updated!",
      });
    });
};

checkWhiteList = async (req, res) => {
  let findCriteria = {
    code: req.body.whitelistCode,
    isUsed: false
  };

  await WhitelistSchema.find(findCriteria)
    .exec((err, tags) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!tags) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: tags });
    })
};


getWhitelists = async (req, res) => {
  let findCriteria = {};

  await WhitelistSchema.find(findCriteria)
    .exec((err, tags) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!tags) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: tags });
    })
};


router.post("/checkWhiteList", checkWhiteList);
router.post("/addWhitelistCode", addWhitelistCode);
router.post("/getWhitelists", getWhitelists);

module.exports = router;
