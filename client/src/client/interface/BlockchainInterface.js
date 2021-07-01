import _, { defer, has } from "lodash";import  React from 'react';
import Web3 from "web3";
import NFTTokenBean from "../beans/Signature";
import contractJSON from "../../contracts/ideaBlocks.json";
import store from '../redux/store';
import { setReduxMetaMaskID } from "../redux/actions";
import ENDPOINTS from '../commons/Endpoints';

import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

const chain_id = "0x2a";

const CHAIN_CONFIGS = { "0x38" : {
  chainId: '0x38',
  chainName: 'Binance Smart Chain Mainnet',
  nativeCurrency: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://bsc-dataseed1.ninicoin.io'],
  blockExplorerUrls: ['https://bscscan.com/']
  },
  "0x61" : {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
    blockExplorerUrls: ['https://testnet.bscscan.com']
  }
}

class BlockchainInterface {
  constructor() {
    this.web3 = undefined;
    this.metamaskAccount = undefined;
    this.contractJSON = contractJSON;
    this.contract = undefined;
    this.tokens = [];
    this.NFTTokenBean = NFTTokenBean;
    let parentThis = this
    window.ethereum && window.ethereum.on('accountsChanged', function (accounts) {
      parentThis.getAccountDetails();
    })
    window.ethereum && window.ethereum.on('chainChanged', function (chainId) {
      parentThis.getAccountDetails();
    })
  }

  addNetwork(chain_id) {
    window.ethereum.givenProvider.request({
      method: 'wallet_addEthereumChain',
      params: [CHAIN_CONFIGS[chain_id]]
    })
  }

  switchNetwork() {
    try {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain_id }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          this.addNetwork(chain_id)
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  register_user = payload => { 
    console.log("register_user")
    return api.post(`/register_user`,payload) 
  }

  async getAccountDetails() {
    const promise = new Promise((resolve, reject) => {
        console.log("returning loadWeb3");
        this.loadWeb3()
          .then((success) => {
            this.metamaskAccount = success.accountId[0];
            let metamaskNetwork = success.networkId;
            console.log("setting in redux user info")
            store.dispatch(setReduxMetaMaskID(this.metamaskAccount))
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
      
    });

    return promise;
  }

  loadWeb3() {
    let parentThis = window;
    const promise = new Promise((resolve, reject) => {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        window.web3 = this.web3;
        this.switchNetwork();
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
        store.dispatch(setReduxMetaMaskID())
        let errorMessage =
          <div>
            <br />
            <a style={{textDecoration: 'underline', color:'white'}} target="blank" href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">Add Metamask from here</a>
          </div>
        reject("Non-Ethereum browser detected. You should consider trying MetaMask!");
      }
    });
    return promise;
  }

  publishOnBehalf(payLoad){
    payLoad.price = this.web3.utils.toWei(payLoad.price, "ether");
    return api.post(`/publishOnBehalf`,{payLoad})
  }



  publishIdea(payLoad, saveToMongoCallback, udpateIDCallback) {
    payLoad.price = this.web3.utils.toWei(payLoad.price, "ether");

    const transactionObject = {
      value: this.web3.utils.toWei("0.05", "ether"),
      from: payLoad.creator,
    };
    this.contract.methods
      .publish(payLoad.title, payLoad.PDFHash, payLoad.price)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        payLoad.transactionID = hash;
        saveToMongoCallback(payLoad);
      })
      .once("receipt", function(receipt) {
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
        console.log("receipt received")
      })
      .once("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmationNumber ::" + confirmationNumber)
      })
      .on("error", console.error);
  }

  getTokens() {
    return this.tokens;
  }

  buySignature(updatePayLoad,successCallback, feedbackCallback, errorCallback) {
    const transactionObject = {
      value: updatePayLoad.price,
      from: updatePayLoad.buyer,
    };
    debugger
    this.contract.methods
      .buy(updatePayLoad.ideaID)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        console.log("updated with transaction id ::" , hash)
        updatePayLoad.transactionID = hash;
        feedbackCallback(updatePayLoad);
      })
      .once("receipt", function(receipt) {
        updatePayLoad.price = "0";
        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
          successCallback(updatePayLoad);
      })
      .once("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber)
      })
      .on("error", (err) => {
        console.log(err)
        errorCallback()
      });
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
      .once("receipt", function(receipt) {
        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
          successCallback(updatePayLoad);
      })
      .once("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber)
      })
      .on("error", console.error);
  }
}

export default new BlockchainInterface();
