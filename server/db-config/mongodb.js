const mongoose = require("mongoose");

const MONGO_DB = "Signatures";

console.log("Initializing mongo connection ");
const baseUrl = "mongodb://127.0.0.1:27017/" + MONGO_DB;
mongoose.connect(process.env.MONGO_URL || baseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

module.exports = connection;
