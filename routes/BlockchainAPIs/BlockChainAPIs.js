const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const UserSchema = require("../../db-config/user.schema");
const webSocket = require("ws");
const url = require("url");

const BlockchainUtils = require("./BlockChainUtils");
const web3Instance = BlockchainUtils.web3Instance;
const ideaTribeContract = BlockchainUtils.ideaTribeContract;

const transactionObject = {};
let wss = undefined;
let liveSocketClients = {};

web3Instance.eth.getAccounts().then((result) => {
  transactionObject.from = result[0];
});

const SIGNATURE_MESSAGE =
  "Welcome to IdeaTribe! Click 'Sign' to sign in. No password needed! This request will not trigger a blockchain transaction or cost any gas fees. Your authentication status will be reset after 24 hours. I accept the IdeaTribe Terms of Service: https://ideatribe.io. Nonce: ";

createWSInstance = (req, res) => {
  let server = req.connection.server;
  console.log("Server request on :: " + server)
  wss = new webSocket.Server({ server: server });
  console.log("Web socket server started");
  
  wss.on("connection", function connection(ws, req) {
    const parameters = url.parse(req.url, true);
    console.log("incoming connection with ID" + parameters.query.metamaskId);
    let clientSocketInstance = ws
    ws.metamaskId = parameters.query.metamaskId;
    liveSocketClients[parameters.query.metamaskId] = ws;
    ws.send(
      JSON.stringify({
        type: "connetionInit",
        message:
          "Welcome New Client! with metamaskId = " +
          parameters.query.metamaskId,
      })
    );

    ws.on("message", (message) => {
      console.log("received: %s", message);
    });

    ws.on('close', function connection(ws, req) {
      console.log("closed socket with ID - " + clientSocketInstance.metamaskId  )
      delete liveSocketClients[clientSocketInstance.metamaskId]
    });
  });

  return res
      .status(200)
      .json({ success: true });
};

verifySignature = (req, res) => {
  let nonce = req.body.nonce;
  let messageHash = web3Instance.utils.fromUtf8(SIGNATURE_MESSAGE + nonce);
  console.log("recovering hash");
  web3Instance.eth.personal
    .ecRecover(messageHash, req.body.secret)
    .then((success) => {
      console.log("recovered hash" + success);
      UserSchema.findOne({ metamaskId: success }).then((signedUser) => {
        console.log("received signatures for", signedUser.userName);
        if (signedUser.nonce == req.body.nonce) {
          var token = jwt.sign(
            {
              metamaskId: signedUser.metamaskId,
              nonce: req.body.nonce,
            },
            process.env.TOKEN_KEY
          );
          return res
            .status(200)
            .json({ success: true, data: { ...signedUser, token: token } });
        } else {
          return res
            .status(400)
            .json({ success: false, data: "FAILED TO SIGN" });
        }
      });
    })
    .catch((err) => {
      console.log("kopile ec recover");
    });
};

register_user = (req, res) => {
  let metamaskAddress = req.body.metamaskId;
  let userName = req.body.userName;
  let messageHash = web3Instance.utils.fromUtf8(
    SIGNATURE_MESSAGE + req.body.nonce
  );
  try {
    web3Instance.eth.personal
      .ecRecover(messageHash, req.body.secret)
      .then((success) => {
        console.log("recover success  " + success);
        UserSchema.findOne({ metamaskId: success }).then((user) => {
          console.log(user);
          if (user.nonce == req.body.nonce) {
            ideaTribeContract.methods
              .registerUser(metamaskAddress, userName)
              .send(transactionObject)
              .on('transactionHash', function(hash){  
                console.log("on transactionHash :: ", hash)
                return res
                .status(200)
                .json({ success: true, data: {message: "Registration submitted to chain", hash:hash }});
              })
              .once("receipt", function (receipt) {
                console.log(receipt)
                sendWebSocketResponse(
                  success,
                  "CONTRACT REGISTRATION SUCCESS",
                  true
                );
              })
              .on("error", function (error, receipt) {
                console.log(error.message)
                let transactionHash = _.get(error, "receipt.transactionHash");
                if(_.isEmpty(transactionHash)){
                  console.log("Registration failed without transaction ID")
                  return res
                  .status(200)
                  .json({ success: false, message: error.message });
                }
                console.log("CONTRACT REGISTRATION FAILED :: ",transactionHash)
                web3Instance.eth
                  .getTransaction(transactionHash)
                  .then((tx) => {
                    web3Instance.eth
                      .call(tx, tx.blockNumber)
                      .then((result) => {
                        sendWebSocketResponse(success, result, false);
                      })
                      .catch((err) => {
                        console.log("** :: ", err);
                        console.log("** :: ", err.message);
                        sendWebSocketResponse(success, err.message, false);
                      });
                  })
                  .catch((err) => {
                    console.log("**** --- ", err.message);
                    sendWebSocketResponse(
                      success,
                      "Transaction invalid",
                      false
                    );
                  });
              });
            
          } else {
            console.log(
              "nonce check failed - user nonce " +
                user.nonce +
                " req.body.nonce " +
                req.body.nonce
            );
            return res
              .status(400)
              .json({
                success: false,
                data: "Failed user registration for nonce mismatch",
              });
          }
        });
      });
  } catch {
    return res
      .status(400)
      .json({ success: false, data: "Failed at catch user registration" });
  }
};

sendWebSocketResponse = (metamaskId, message, success) => {
  console.log(
    "Sending socket success - " +
      success +
      " response to " +
      metamaskId +
      " :: " +
      message
  );
  let client = liveSocketClients[metamaskId];
  console.log("target client ", client)
  client.send(
    JSON.stringify({
      success,
      metamaskId,
      message,
      type: "contractresponse",
    })
  );
};

getContractENV = async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: process.env.CHAIN_ENV });
  } catch (err) {
    return res.status(404).json({ success: true, data: [] });
  }
};

router.get("/getContractENV", getContractENV);
router.post("/register_user", register_user);
router.post("/verifySignature", verifySignature);
router.post("/createWSInstance", createWSInstance);

module.exports = router;
