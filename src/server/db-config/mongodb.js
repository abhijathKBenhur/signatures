const mongoose = require("mongoose");



    console.log("Initializing mongo connection ")
    const MONGO_USERNAME = 'abhijath';
    const MONGO_PASSWORD = 'password';
    const MONGO_HOSTNAME = '127.0.0.1';
    const MONGO_PORT = '27017';
    const MONGO_DB = 'fingerprints'
    
    const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
    const baseUrl = 'mongodb://127.0.0.1:27017/'+ MONGO_DB
    mongoose.connect(baseUrl, {
      useNewUrlParser: true
    })
    
    const connection = mongoose.connection;
    
    connection.once("open", function() {
      console.log("Connection with MongoDB was successful");
    });
    
    connection.on('error', console.error.bind(console, 'MongoDB connection error:'))


module.exports = connection






