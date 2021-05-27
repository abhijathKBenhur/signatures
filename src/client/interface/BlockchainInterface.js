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

  async getAccountDetails() {
    const promise = new Promise((resolve, reject) => {
      if (_.isUndefined(this.metamaskAccount) || _.isUndefined(this.contract)) {
        this.loadWeb3().then((success) => {
          this.loadBlockchainData()
            .then((metamasId) => {
              resolve(metamasId);
            })
            .catch((err) => {
              defer(err);
            });
        }).catch(err =>{
			defer(err)
		})
      } else {
        resolve(this.metamaskAccount);
      }
    });

    return promise;
  }

  async loadWeb3() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      this.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    window.web3 = this.web3;
  }

  async loadBlockchainData() {
    const web3 = this.web3;
    const accounts = await web3.eth.getAccounts();
    this.metamaskAccount = accounts[0];
    web3.eth.net
      .getId()
      .then((metamaskNetwork) => {
        const contractNetworkID = this.contractJSON.network;
        if (contractNetworkID == metamaskNetwork) {
          const abi = this.contractJSON.abi;
          const contractAddress = this.contractJSON.address;
          const contract = new web3.eth.Contract(abi, contractAddress);
          this.contract = contract;
        } else {
          window.alert("Smart contract not deployed to detected network.");
        }
        return this.metamaskAccount;
      })
      .catch((err) => {
        return err
      });
  }

  createToken({ options }) {
    let payLoad = {
      account: this.metamaskAccount,
      file: options.file,
      name: options.tokenName,
      category: options.tokenCategory,
      amount: parseFloat(options.tokenSupply),
      price: this.web3.utils.toWei(options.tokenCost, "ether"),
      uri: options.file,
    };
    this.contract.methods
      .mint(
        payLoad.account,
        payLoad.name,
        payLoad.category,
        payLoad.amount,
        payLoad.price,
        payLoad.uri
      )
      .send({ from: this.metamaskAccount })
      .once("receipt", (receipt) => {});
  }

  getTokens() {
    return this.tokens;
  }

  getFilePath(file) {
    const promise = new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        IPFS.files.add(Buffer(reader.result), (error, result) => {
          if (error) {
            console.error(error);
            reject(error);
          }
          resolve(result[0].path);
        });
      };
    });

    return promise;
  }

  buyToken() {}
}

export default new BlockchainInterface();
