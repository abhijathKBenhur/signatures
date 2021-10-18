const HashtagSchema = require("../db-config/hashtag.schema");
const express = require("express");
const router = express.Router();
 

postHashtag = (req, res) => {
  const body = req.body;
  console.log("inside postHashtag")
  console.log(req)
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  const newComment = new HashtagSchema(body);  

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

getHashTags = async (req, res) => {
  let findCriteria = {};

  await HashtagSchema.find(findCriteria)
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



router.post("/getHashTags", getHashTags);
router.post("/postHashtag", postHashtag);

module.exports = router;
