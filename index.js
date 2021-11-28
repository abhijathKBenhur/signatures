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

console.log("Deploying full application")
console.log("Checking node environment ::" + process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
  console.log("Found node environment as" + process.env.NODE_ENV , __dirname);
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
