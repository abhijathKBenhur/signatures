const jwt = require("jsonwebtoken");
const UserSchema = require("../../db-config/user.schema");

const authorizer = (req, res, next) => {
  let authRoutes = [
    // "/api/updateUser",
    // "/api/postComment",
    // "/api/markNotificationAsRead",
    // "/api/markNotificationAsRead",
    // "/api/postNotification",
    // "/api/getNotifications",
    // "/api/getNotifications",
    // "/api/postRelation",
    // "/api/getRelations",
    // "/api/addSignature",
    // "/api/buySignature",
    // "/api/updateIdeaID",
    // "/api/removeIdeaEntry",
    // "/api/updatePurpose",
    // "/api/postTransaction",
    // "/api/setTransactionState",
  ];

  if (authRoutes.includes(req.path)) {
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
      console.log("decoded" + decoded);

      getUserInfo = async (req, res) => {
        await UserSchema.findById(decoded.userId, (err, user) => {
          if (err) {
            return res.status(401).json({
              success: true,
              data: {
                error: "Authorization failed",
              },
            });
          }
          if (!user || !user.userName) {
            return res.status(401).json({
              success: true,
              data: {
                error: "Authorization failed",
              },
            });
          }
          if (user.nonce == decoded.nonce && conditionalAuthCheck(user, req)) {
            return next();
          } else {
            return res.status(401).json({
              success: true,
              data: {
                error: "Authorization failed",
              },
            });
          }
        }).catch((err) => {
          return res.status(401).json({
            success: true,
            data: {
              error: "Authorization failed",
            },
          });
        });
      };

      const conditionalAuthCheck = (tokenOwner, req) => {
        console.log("conditionalAuthCheck" + decoded);
        console.log(
          "tokenOwner._id == req.body.from" +
            tokenOwner._id +
            "_____" +
            req.body.from
        );

        switch (req.path) {
          case "/api/getUserInfo":
            return tokenOwner.userName == "";
            break;
          case "/api/updateUser":
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
            return tokenOwner.owner == req.body.owner;
            break;
          case "/api/postTransaction":
            return tokenOwner._id == req.body.user;
            break;
          case "/api/setTransactionState":
            return tokenOwner.userName == "";
            break;
        }
      };
    } catch (err) {
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

module.exports = authorizer;