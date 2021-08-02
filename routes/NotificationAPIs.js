const NotificationSchema = require("../db-config/notification.schema");
const express = require("express");
const router = express.Router();

postNotification = (req, res) => {
  const body = req.body;
  body.balance = 1000;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  const newNotification = new NotificationSchema(body);

  if (!newNotification) {
    return res.status(400).json({ success: false, error: err });
  }

  newNotification
    .save()
    .then((user, b) => {
      return res.status(201).json({
        success: true,
        data: user,
        message: "notification poster!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "notification poster!",
      });
    });
};

getNotifications = async (req, res) => {
  let findCriteria = {};
  if (req.body.to) {
    findCriteria.to = req.body.to;
  }

  await NotificationSchema.find(findCriteria, (err, user) => {
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



router.post("/postNotification", postNotification);
router.post("/getNotifications", getNotifications);

module.exports = router;
