const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
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
