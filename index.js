const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongotConnection = require("./db-config/mongodb");
const tokenAPI = require("./routes/TokenAPIs");
const userAPI = require("./routes/UserAPI");
const blockChainAPI = require("./routes/BlockChainAPIs");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", tokenAPI);
app.use("/api", userAPI);
app.use("/api", blockChainAPI);

console.log("Checking node environment ::" + process.env.NODE_ENV)
if (process.env.NODE_ENV == "production") {
  console.log("Found node environment as" + process.env.NODE_ENV)
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
