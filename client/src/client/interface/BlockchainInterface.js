import _, { defer } from "lodash";
import Web3 from "web3";
import NFTTokenBean from "../beans/Signature";
import contractJSON from "../../contracts/ideaBlocks.json";
import IPFS from "../config/ipfs";

class BlockchainInterface {
  constructor() {
    this.web3 = undefined;
    this.metamaskAccount = undefined;
    this.contractJSON = contractJSON;
    this.contract = undefined;
    this.tokens = [];
    this.NFTTokenBean = NFTTokenBean;
  }

  getImageFromIPFS(hash){
    return IPFS.files.get(hash)
  }

  async getAccountDetails() {
    const promise = new Promise((resolve, reject) => {
      if (_.isUndefined(this.metamaskAccount) || _.isUndefined(this.contract)) {
        console.log("returning loadWeb3");
        this.loadWeb3()
          .then((success) => {
            this.metamaskAccount = success.accountId[0];
            let metamaskNetwork = success.networkId;
            const contractNetworkID = this.contractJSON.network;
            if (contractNetworkID == metamaskNetwork) {
              const abi = this.contractJSON.abi;
              const contractAddress = this.contractJSON.address;
              const contract = this.web3.eth.Contract(abi, contractAddress);
              this.contract = contract;
            } else {
              window.alert("Smart contract not deployed to detected network.");
            }
            resolve(this.metamaskAccount);
          })
          .catch((err) => {
            console.log("catch loadWeb3", err);
            reject(err);
          });
      } else {
        console.log("already present");
        resolve(this.metamaskAccount);
      }
    });

    return promise;
  }

  loadWeb3() {
    let parentThis = window;
    const promise = new Promise((resolve, reject) => {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        window.web3 = this.web3;
        window.ethereum
          .enable()
          .then((accountId) => {
            window.web3.eth.net.getId().then((networkId) => {
              resolve({
                accountId,
                networkId,
              });
            });
          })
          .catch((err) => {
            reject(err);
          });
      } else if (window.web3) {
        this.web3 = new Web3(this.web3.currentProvider);
        window.web3 = this.web3;
        resolve(this.web3);
      } else {
        let errorMessage =
          "Non-Ethereum browser detected. You should consider trying MetaMask!";
        parentThis.alert(errorMessage);
        reject(errorMessage);
      }
    });
    return promise;
  }

  publishIdea(payLoad, saveToMongoCallback, udpateIDCallback) {
    payLoad.price = this.web3.utils.toWei(payLoad.price, "ether");

    const transactionObject = {
      value: this.web3.utils.toWei("0.05", "ether"),
      from: payLoad.owner,
    };
    this.contract.methods
      .publish(payLoad.title, payLoad.PDFHash, payLoad.price)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        payLoad.transactionID = hash;
        saveToMongoCallback(payLoad);
      })
      .on("receipt", function(receipt) {
        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
        let tokenID =
          tokenReturns &&
          _.get(receipt.events, "Transfer.returnValues.tokenId").toNumber();
        payLoad.ideaID = tokenID;
        if (tokenID) {
          udpateIDCallback(payLoad);
        }
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber)
      })
      .on("error", console.error);
  }

  getTokens() {
    return this.tokens;
  }


  getFilePathsFromMulter(file){
    if(!file.IPFS){
      
    }
  }


  getFilePathsFromIPFS(file) {
    let uploadPromises = [];
    uploadPromises.push(
      new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file.thumbnail);
        reader.onloadend = () => {
          IPFS.files.add(Buffer(reader.result), (error, result) => {
            if (error) {
              console.error(error);
              reject(error);
            }
            resolve({path:result[0].path,type: "thumbnail"});
          });
        };
      })
    );
    uploadPromises.push(
      new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file.PDFFile);
        reader.onloadend = () => {
          IPFS.files.add(Buffer(reader.result), (error, result) => {
            if (error) {
              console.error(error);
              reject(error);
            }
            resolve({path:result[0].path,type: "PDFFile"});
          });
        };
      })
    );
    
    return Promise.all(uploadPromises);
  }


  getFilePathsFromIPFS(file) {
    let uploadPromises = [];
    uploadPromises.push(
      new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file.thumbnail);
        reader.onloadend = () => {
          IPFS.files.add(Buffer(reader.result), (error, result) => {
            if (error) {
              console.error(error);
              reject(error);
            }
            resolve({path:result[0].path,type: "thumbnail"});
          });
        };
      })
    );
    uploadPromises.push(
      new Promise((resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file.PDFFile);
        reader.onloadend = () => {
          IPFS.files.add(Buffer(reader.result), (error, result) => {
            if (error) {
              console.error(error);
              reject(error);
            }
            resolve({path:result[0].path,type: "PDFFile"});
          });
        };
      })
    );
    
    return Promise.all(uploadPromises);
  }

  buySignature(updatePayLoad,successCallback, feedbackCallback) {
    const transactionObject = {
      value: updatePayLoad.price,
      from: updatePayLoad.buyer,
    };
    this.contract.methods
      .buy(updatePayLoad.ideaID)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        feedbackCallback();
      })
      .on("receipt", function(receipt) {
        updatePayLoad.price = 0;

        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
          successCallback(updatePayLoad);
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber)
      })
      .on("error", console.error);
  }

  buySignature(updatePayLoad,successCallback, feedbackCallback) {
    const transactionObject = {
      value:updatePayLoad.price,
      from: updatePayLoad.buyer,
    };
    this.contract.methods
      .buy(updatePayLoad.ideaID)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        feedbackCallback();
      })
      .on("receipt", function(receipt) {
        updatePayLoad.price = 0;

        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
          successCallback(updatePayLoad);
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber)
      })
      .on("error", console.error);
  }

  updatePrice(updatePayLoad,successCallback, feedbackCallback) {
    const transactionObject = {
      from: updatePayLoad.owner,
    };
    this.contract.methods
      .set_price(updatePayLoad.ideaID, updatePayLoad.price)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        feedbackCallback();
      })
      .on("receipt", function(receipt) {
        updatePayLoad.price = "0";

        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
          successCallback(updatePayLoad);
      })
      .on("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber)
      })
      .on("error", console.error);
  }
}

export default new BlockchainInterface();
