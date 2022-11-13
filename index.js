const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongotConnection = require("./db-config/mongodb");
const tokenAPI = require("./routes/TokenAPIs");
const userAPI = require("./routes/UserAPI");
const AggregatesAPI = require("./routes/AggregatesAPI");
const HashAPI = require("./routes/hashAPI");
const WhitelistAPI = require("./routes/WhitelistAPI");

const cookieParser = require("cookie-parser");

const notificationAPI = require("./routes/NotificationAPIs");
const commentAPI = require("./routes/commentAPI");
const relationAPI = require("./routes/RelationAPI");
const blockChainAPI = require("./routes/BlockchainAPIs/BlockChainAPIs");
const ClanAPI = require("./routes/ClanAPI");
const TransactionAPI = require("./routes/TransactionAPIs");
const CustomerAPI = require("./routes/CustomerAPI");
const dotenv = require("dotenv");
const path = require("path");
const authorizer = require("./routes/middleware/authorizer");

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authorizer)


app.use(
  cors({
    origin: function (origin, callback) {
      // console.log("API requested from " + origin);
      if (!origin || ( origin.indexOf("localhost") > -1|| origin.indexOf("ideatribe") > -1)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") != undefined && req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  }
  else {
    next();
  }
});

app.use("/api", tokenAPI);
app.use("/api", userAPI);
app.use("/api", blockChainAPI);
app.use("/api", notificationAPI);
app.use("/api", relationAPI);
app.use("/api", commentAPI);
app.use("/api", ClanAPI);
app.use("/api", TransactionAPI);
app.use("/api", AggregatesAPI);
app.use("/api", HashAPI);
app.use("/api", WhitelistAPI);
app.use("/api", CustomerAPI);

console.log("Deploying full application")
console.log("Checking node environment ::" + process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
  console.log("Found node environment as" + process.env.NODE_ENV , __dirname);
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

var server = app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
console.log("here")
  const webSocket = require("ws");
  const url = require("url");
  let wss = undefined;
  let liveSocketClients = {};
  console.log("Server request on :: " + server)
  wss = new webSocket.Server({ server: server });
  console.log("Web socket server started");
  
  wss.on("connection", function connection(ws, req) {
    const parameters = url.parse(req.url, true);
    console.log("incoming connection with ID" + parameters.query.metamaskId);
    let clientSocketInstance = ws
    ws.metamaskId = parameters.query.metamaskId;
    liveSocketClients[parameters.query.metamaskId] = ws;
    console.log("Client added")
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

  const sendWebSocketResponse = (metamaskId, message, success) => {
    console.log(
      "Sending socket success - " +
        success +
        " response to " +
        metamaskId +
        " :: " +
        message
    );
    console.log("liveSocketClients ", liveSocketClients)
    let client = liveSocketClients[metamaskId];
    client.send(
      JSON.stringify({
        success,
        metamaskId,
        message,
        type: "contractresponse",
      })
    );
  };

  app.sendWebSocketResponse = sendWebSocketResponse

  module.exports = app