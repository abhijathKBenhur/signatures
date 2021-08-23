const NotificationSchema = require("../db-config/notification.schema");
const express = require("express");
const router = express.Router();

markNotificationAsRead = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Blank",
    });
  }
  body.status = "COMPLETED"

  const updatedNotification = new NotificationSchema(body);

  if (!updatedNotification) {
    return res.status(400).json({ success: false, error: err });
  }

  NotificationSchema.findByIdAndUpdate(body._id,updatedNotification)
    .then((notification, b) => {
      return res.status(201).json({
        success: true,
        data: notification,
        message: "notification posted!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "notification posted!",
      });
    });
};


postNotification = (req, res) => {
  const body = req.body;
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
    .then((notification, b) => {
      return res.status(201).json({
        success: true,
        data: notification,
        message: "notification posted!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "notification posted!",
      });
    });
};

getNotifications = async (req, res) => {
  let findCriteria = {};
  if (req.body.to) {
    findCriteria.to = req.body.to;
  }

  await NotificationSchema.find(findCriteria)
    .populate("from")
    .exec((err, notification) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!notification) {
        return res.status(404).json({ success: true, data: [] });
      }
      return res.status(200).json({ success: true, data: notification });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, data: err });
    });
};

router.post("/postNotification", postNotification);
router.post("/getNotifications", getNotifications);
router.post("/markNotificationAsRead", markNotificationAsRead);


module.exports = router;
