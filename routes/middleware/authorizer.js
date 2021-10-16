const jwt = require("jsonwebtoken");

const UserSchema = require("../../db-config/user.schema");

const authorizer = (req, res, next) => {
  let authRoutes = [
    "/api/updateUser",
    "/api/postComment",
    "/api/markNotificationAsRead",
    "/api/markNotificationAsRead",
    "/api/postNotification",
    "/api/getNotifications",
    "/api/getNotifications",
    "/api/postRelation",
    "/api/addSignature",
    "/api/buySignature",
    "/api/updateIdeaID",
    "/api/removeIdeaEntry",
    "/api/updatePurpose",
    "/api/postTransaction",
    "/api/setTransactionState",
  ];

  
  if (authRoutes.indexOf(req.path) > -1 && req.method != "OPTIONS") {
    console.log("Authorizing api " + req.path)
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).json({
        success: true,
        data: {
          error: "Authorization failed",
        },
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      UserSchema.findOne({ metamaskId: decoded.metamaskId }).then((user) => {
        if (!user || !user.userName) {
          console.log("B")
          return res.status(401).json({
            success: true,
            data: {
              error: "Authorization failed",
            },
          });
        }
        if (user.nonce == decoded.nonce && conditionalAuthCheck(user, req)) {
          console.log("valid user request")
          return next();
        } else {
          console.log("C")
          return res.status(401).json({
            success: true,
            data: {
              error: "Authorization failed",
            },
          });
        }
      });
    } catch (err) {
      console.log("Catch" , err)
      return res.status(401).json({
        success: true,
        data: {
          error: "Authorization failed",
        },
      });
    }
  } else {
    next();
  }
};

const conditionalAuthCheck = (tokenOwner, req) => {
  switch (req.path) {
    case "/api/getUserInfo":
      return tokenOwner.userName == "";
      break;
    case "/api/updateUser":
      console.log("req.body._id", req.body._id)
      console.log("tokenOwner", tokenOwner._id)
      return tokenOwner._id == req.body._id;
      break;
    case "/api/postComment":
      return tokenOwner._id == req.body.from;
      break;
    case "/api/markNotificationAsRead":
      return tokenOwner._id == req.body.from;
      break;
    case "/api/postNotification":
      return tokenOwner._id == req.body.from;
      break;
    case "/api/getNotifications":
      return tokenOwner.userName == req.body.to;
      break;
    case "/api/postRelation":
      return tokenOwner.userName == req.body.from;
      break;
    case "/api/addSignature":
      return tokenOwner.metamaskId == req.body.creator;
      break;
    case "/api/buySignature":
      return tokenOwner._id == req.body.buyer._id;
      break;
    case "/api/updateIdeaID":
      return tokenOwner.metamaskId == req.body.creator;
      break;
    case "/api/removeIdeaEntry":
      return tokenOwner.metamaskId == req.body.owner;
      break;
    case "/api/updatePurpose":
      console.log("tokenOwner",tokenOwner)
      console.log("req.body.owner",req.body.owner)
      return tokenOwner._id == req.body.owner;
      break;
    case "/api/postTransaction":
      return tokenOwner._id == req.body.user;
      break;
    case "/api/setTransactionState":
      return tokenOwner.userName == "";
      break;
  }
};

module.exports = authorizer;
