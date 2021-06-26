const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractJSON = require("../client/src/contracts/ideaBlocks.json");
const privateKey = process.env.PROGRAMMER_KEY;

const networkURL = process.env.NETWORK_URL;

const web3Instance = new Web3(networkURL);
const publicKey = web3Instance.eth.accounts.privateKeyToAccount(privateKey).address
const deployedContract = new web3Instance.eth.Contract(
  contractJSON.abi,
  contractJSON.address
);
const transactionObject = {
  from: publicKey
};

publishOnBehalf = async (req, res) => {
  let metamaskAddress = req.body.metamaskAddress;
  let title = req.body.title;
  let PDFHash = req.body.PDFHash;
  let price = req.body.price;

  deployedContract.methods
    .publishOnBehalf(title, PDFHash, price, metamaskAddress)
    .send(transactionObject);
};


register_user = async (req, res) => {
    let metamaskAddress = req.body.metamaskId;
    let userName = req.body.userID;
    deployedContract.methods
      .register_user(metamaskAddress,userName)
      .call(transactionObject).then(success => {
        console.log("success",success)
        return res.status(200).json({ success: true, data: ["success"] });
      })
  };
  

router.post("/publishOnBehalf", publishOnBehalf);
router.post("/register_user", register_user);

module.exports = router;
