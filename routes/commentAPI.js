const CommentSchema = require("../db-config/Comment.schema");
const express = require("express");
const router = express.Router();

// comments on ideas, profile etc
postComment = (req, res) => {
  const body = req.body;
  body.balance = 1000;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  const newComment = new CommentSchema(body);

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

getComments = async (req, res) => {
  let findCriteria = {};
  if (req.body.to) {
    findCriteria.to = req.body.to;
  }

  await CommentSchema.find(findCriteria)
    .populate("from")
    .exec((err, comment) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!comment) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: comment });
    })
};



router.post("/postComment", postComment);
router.post("/getComments", getComments);

module.exports = router;
