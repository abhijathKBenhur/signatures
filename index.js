const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongotConnection = require("./db-config/mongodb");
const tokenAPI = require("./routes/TokenAPIs");
const userAPI = require("./routes/UserAPI");
const notificationAPI = require("./routes/NotificationAPIs");
const commentAPI = require("./routes/commentAPI");
const relationAPI = require("./routes/RelationAPI");
const blockChainAPI = require("./routes/BlockChainAPIs");
const ClanAPI = require("./routes/ClanAPI");
const TransactionAPI = require("./routes/TransactionAPIs");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("API requested from " + origin);
      if (!origin || ( origin.indexOf("localhost") > -1|| origin.indexOf("ideatribe") > -1)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use((req, res, next) => {
  
  if (req.header("x-forwarded-proto") !== "https" && req.headers.referer.indexOf("localhost") == -1) {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
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

console.log("Checking node environment ::" + process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
  console.log("Found node environment as" + process.env.NODE_ENV);
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
