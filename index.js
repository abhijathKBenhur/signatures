const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const mongotConnection = require('./db-config/mongodb')
const tokenAPI = require('./routes/TokenAPIs')
const userAPI = require('./routes/UserAPI')
const dotenv = require('dotenv')

const app = express();
const PORT = process.env.PORT || 4000;

dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/',(req,res) =>{
  res.send("The backend server is up and running at :: " + process.env.PORT)
})

app.use('/api', tokenAPI)
app.use('/api', userAPI)

if(process.env.NODE_ENV == "production"){
  app.use(express.static('build'))
}



app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});

