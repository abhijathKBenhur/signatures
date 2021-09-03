const mongoose = require("mongoose");

const baseUrl = "mongodb://127.0.0.1:27017/Signatures";

mongoose.connect(process.env.NODE_ENV == "production" ? process.env.MONGODB_URL : baseUrl, {
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
