const express = require("express");
const router = express.Router();
const getRevertReason = require("eth-revert-reason");
const Web3 = require("web3");
const contractJSON = require("../client/src/contracts/ideaBlocks.json");
const privateKey = process.env.PROGRAMMER_KEY;
const HDWalletProvider = require("@truffle/hdwallet-provider");

const networkURL = process.env.NETWORK_URL;

const web3Instance = new Web3(new HDWalletProvider(privateKey, networkURL));
// web3Instance.eth.getAccounts().then((e) => console.log(e));
const publicKey =
  web3Instance.eth.accounts.privateKeyToAccount(privateKey).address;
const deployedContract = new web3Instance.eth.Contract(
  contractJSON.abi,
  contractJSON.address,
  {
    gas: 500000,
  }
);
const transactionObject = {
  from: publicKey,
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
      let transactionHash = error.receipt.transactionHash;
      console.log("error transactionHash", transactionHash);
      getRevertReason(transactionHash, process.env.NETWORK_NAME).then(
        (errorReason) => {
          error.errorReason = errorReason
          console.log("error errorReason", errorReason);
          return res.status(400).json({ success: false, data: errorReason });
        }
      );
    });

  console.log("transaction id");
};

publishOnBehalf = async (req, res) => {
  let metamaskAddress = req.body.creator;
  let title = req.body.title;
  let PDFHash = req.body.PDFHash;
  let price = req.body.price;
  console.log("title", title);
  console.log("PDFHash", PDFHash);
  console.log("price", price);
  console.log("metamaskAddress", metamaskAddress);
  deployedContract.methods
    .publishOnBehalf(title, PDFHash, price, metamaskAddress)
    .send(transactionObject)
    // .on("transactionHash", function(hash) {
    //   console.log("receipt transactionHash",hash)
    //   return res.status(200).json({ success: true, data: hash });
    // })
    .on("receipt", function (receipt) {
      console.log("receipt received", receipt);
      let tokenID =
        receipt &&
        _.get(receipt.events, "Transfer.returnValues.tokenId").toNumber();
      let hash = receipt && _.get(receipt.events, "Transfer.transactionHash");
      payLoad.ideaID = tokenID;
      payLoad.transactionID = hash;
      return res.status(200).json({ success: true, data: payLoad });
    })
    .on("error", function (error) {
      console.log("error received", error);
      let transactionHash = error.receipt.transactionHash;
      getRevertReason(transactionHash, process.env.NETWORK_NAME).then(
        (errorReason) => {
          console.log("error errorReason", errorReason);
          error.errorReason = errorReason
          return res.status(400).json({ success: false, data: error });
        }
      );
    });
};

router.post("/publishOnBehalf", publishOnBehalf);
router.post("/register_user", register_user);

module.exports = router;
