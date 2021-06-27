const express = require("express");
const router = express.Router();

const Web3 = require("web3");
const contractJSON = require("../client/src/contracts/ideaBlocks.json");
const privateKey = process.env.PROGRAMMER_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");

const networkURL = process.env.NETWORK_URL;

const web3Instance = new Web3(new HDWalletProvider(privateKey, networkURL));
// web3Instance.eth.getAccounts().then((e) => console.log(e));
const publicKey = web3Instance.eth.accounts.privateKeyToAccount(privateKey).address;
const deployedContract = new web3Instance.eth.Contract(
  contractJSON.abi,
  contractJSON.address
);
const transactionObject = {
  from: publicKey
};


register_user = (req, res) => {
  let metamaskAddress = req.body.metamaskId;
  let userName = req.body.userID;
  console.log("calling register", deployedContract.address);

  deployedContract.methods
    .register_user(metamaskAddress, userName)
    .send(transactionObject)
    // .on("transactionHash", function (hash) {
    //   console.log("receipt transactionHash", hash);
    // })
    .on("receipt", function (receipt) {
      console.log("receipt received", receipt);
      return res.status(200).json({ success: true, data: receipt });
    })
    .on("error", function (error) {
      console.log("error received", error);
      return res.status(200).json({ success: false, data: error });
    });

  console.log("transaction id");
};

publishOnBehalf = async (req, res) => {
  let metamaskAddress = req.body.metamaskAddress;
  let title = req.body.title;
  let PDFHash = req.body.PDFHash;
  let price = req.body.price;

  deployedContract.methods
    .publishOnBehalf(title, PDFHash, price, metamaskAddress)
    .send(transactionObject)
    // .on("transactionHash", function(hash) {
    //   console.log("receipt transactionHash",hash)
    // })
    .on("receipt", function (receipt) {
      console.log("receipt received", receipt);
      return res.status(200).json({ success: true, data: receipt });
    })
    .on("error", function (error) {
      console.log("error received", error);
      return res.status(200).json({ success: false, data: err });
    });
};

router.post("/publishOnBehalf", publishOnBehalf);
router.post("/register_user", register_user);

module.exports = router;
