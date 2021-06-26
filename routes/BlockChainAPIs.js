const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractJSON = require("../client/src/contracts/ideaBlocks.json");
const privateKey = process.env.PROGRAMMER_KEY;

const networkURL = process.env.NETWORK_URL;

const web3Instance = new Web3(networkURL);
const deployedContract = new web3Instance.eth.Contract(
  contractJSON.abi,
  contractJSON.address
);

publishOnBehalf = async (req, res) => {
  let metamaskAddress = req.body.metamaskAddress;
  let title = req.body.title;
  let PDFHash = req.body.PDFHash;
  let price = req.body.price;

  const transactionObject = {
    value: this.web3.utils.toWei("0.05", "ether"),
    from: payLoad.owner,
  };

  console.log("checking deployedContract", deployedContract);
  deployedContract.methods
    .publishOnBehalf(title, PDFHash, price, metamaskAddress)

    .send(transactionObject);
};


register_user = async (req, res) => {
    let metamaskAddress = req.body.metamaskAddress;
    let title = req.body.title;
    let PDFHash = req.body.PDFHash;
    let price = req.body.price;
  
    const transactionObject = {
      value: this.web3.utils.toWei("0.05", "ether"),
      from: payLoad.owner,
    };
  
    console.log("checking deployedContract", deployedContract);
    deployedContract.methods
      .publishOnBehalf(title, PDFHash, price, metamaskAddress)
  
      .send(transactionObject);
  };
  

router.post("/publishOnBehalf", publishOnBehalf);
router.post("/register_user", register_user);

module.exports = router;
