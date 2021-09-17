const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["Authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    //Structure
    // metamaskId: newUser.metamaskId ,
    // userName: newUser.userName,
    // secret: body.secret,
    // nonce: body.nonce
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if(req,requester != decoded.userName){
        return res.status(401).send("Invalid Token");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;