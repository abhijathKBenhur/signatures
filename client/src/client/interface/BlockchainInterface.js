import _, { defer, has } from "lodash";
import React from "react";
import Web3 from "web3";
import contractJSON from "../../contracts/ideaTribe.json";
import tribeGoldContractJSON from "../../contracts/tribeGold.json";
import store from "../redux/store";
import { setReduxMetaMaskID,setReduxUserDetails } from "../redux/actions";
import ENDPOINTS from "../commons/Endpoints";
import { useHistory } from "react-router-dom";
import ReactDOM from 'react-dom';
import AlertBanner from "../components/alert/alert"
import AxiosInstance from "../wrapper/apiWrapper"
import { Subject } from 'rxjs';


import axios from "axios";
import CONSTANTS from "../commons/Constants";
import EmitInterface from "./emitInterface"

const api = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? ENDPOINTS.REMOTE_ENDPOINTS
      : ENDPOINTS.LOCAL_ENDPOINTS,
});

const chain_id = "0x13881";
let isConfirmed = false;

const CHAIN_CONFIGS = {
  "0x38": {
    chainId: "0x38",
    chainName: "Binance Smart Chain Mainnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed1.ninicoin.io"],
    blockExplorerUrls: ["https://bscscan.com/"],
  },

  "0x61": {
    chainId: "0x61",
    chainName: "Binance Smart Chain Testnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com"],
  },
  "0x13881":{
    chainId: "0x13881",
    chainName: "Mumbai Testnet",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
  }
};



class BlockchainInterface {

  constructor() {
    this.web3 = undefined;
    this.metamaskAccount = undefined;
    this.contractJSON = contractJSON;
    this.tribeGoldContractJSON = tribeGoldContractJSON;
    this.contract = undefined;
    this.tokens = [];
    let parentThis = this;

    window.ethereum &&
      window.ethereum.on("accountsChanged", function(accounts) {
        {setTimeout(() => {
          window.location.href = '/home';
        }, 100)}
      });
    window.ethereum &&
      window.ethereum.on("chainChanged", function(chainId) {
        {setTimeout(() => {
          window.location.href = '/home';

        }, 100)}
      });
  }



  addNetwork(chain_id) {
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [CHAIN_CONFIGS[chain_id]],
      })
      .then((success) => {
        console.log("success", success);
      })
      .catch((switchError) => {
        console.log("switchError", switchError);
      });
  }

  switchNetwork() {
    try {
      window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chain_id }],
        })
        .then((success) => {
          console.log("success", success);
        })
        .catch((switchError) => {
          if (switchError.code === 4902) {
            try {
              this.addNetwork(chain_id);
            } catch (addError) {
              // handle "add" error
            }
          }
        });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          this.addNetwork(chain_id);
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }

  addToken(type, symbol, decimals) {
    window.ethereum
      .request({
        method: "wallet_watchAsset",
        params: {
          type: type,
          options: {
            address: this.tribeGoldContractJSON.address,
            symbol: symbol,
            decimals: decimals,
          },
        },
      })
      .then((success) => {
        if (success) {
          console.log(symbol + " successfully added to wallet!");
        } else {
          throw new Error("Something went wrong.");
        }
      })
      .catch(console.error);
  }

  register_user = (payload) => {
    console.log("register_user");
    return AxiosInstance.post(`/register_user`, payload);
  };

  verifySignature = (payload) => {
    console.log("verifySignature");
    return AxiosInstance.post(`/verifySignature`, payload);
  };

  getGoldBalance () {
    const abi = this.tribeGoldContractJSON.abi;
    const contractAddress = this.tribeGoldContractJSON.address;
    let contractOptions = {
      gasPrice : "3000000000",
      gas : 1000000
    }
    const contract = this.web3.eth.Contract(abi, contractAddress,contractOptions);
    return contract.methods.balanceOf(this.metamaskAccount).call()
  }

  getMaticBalance () {
    return this.web3.eth.getBalance(this.metamaskAccount)
  }

  async getAccountDetails() {
    const promise = new Promise((resolve, reject) => {
      console.log("returning loadWeb3");
      this.loadWeb3()
        .then((success) => {
          this.metamaskAccount = success.accountId[0];
          let metamaskNetwork = success.networkId;
          console.log("setting in redux user info");
          store.dispatch(setReduxMetaMaskID(this.metamaskAccount));
          const contractNetworkID = this.contractJSON.network;
          if (contractNetworkID == metamaskNetwork) {
            const abi = this.contractJSON.abi;
            const contractAddress = this.contractJSON.address;
            let contractOptions = {
              gasPrice : "3000000000",
              gas : 1000000
            }
            const contract = this.web3.eth.Contract(abi, contractAddress,contractOptions);
            this.contract = contract;
          } else {
            const CalledFunction = () => {
              this.switchNetwork()
            }
            const alertProperty = {
                isDismissible: false,
                variant: "danger",
                content: "Smart contract not deployed to detected network. Please change the network in metamask.",
                actionText: "Switch Network",
                actionFunction: CalledFunction
              }
              ReactDOM.render(<AlertBanner {...alertProperty}></AlertBanner>, document.querySelector('.appHeader'))
            store.dispatch(setReduxMetaMaskID(undefined));
            store.dispatch(setReduxUserDetails({}));
            // window.alert(
            //   "Smart contract not deployed to detected network. Please change the network in metamask."
            // );
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

  signToken( nonce) {
    console.log("Metamask request for signing")
    console.log(CONSTANTS.SIGNATURE_MESSAGE+nonce)
    console.log("from adddress   " + this.metamaskAccount)
    return this.web3.eth.personal.sign(this.web3.utils.fromUtf8(CONSTANTS.SIGNATURE_MESSAGE+nonce),this.metamaskAccount, CONSTANTS.COOKIE_TOKEN_PHRASE)
  }

  loadWeb3() {
    let parentThis = window;
    let transactionConfirmationBlocks = 8
    const promise = new Promise((resolve, reject) => {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        this.web3.eth.handleRevert = true
        this.web3.eth.transactionConfirmationBlocks = transactionConfirmationBlocks
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
        this.web3.eth.handleRevert = true
        this.web3.eth.transactionConfirmationBlocks = transactionConfirmationBlocks



        window.web3 = this.web3;
        resolve(this.web3);
      } else {
        store.dispatch(setReduxMetaMaskID());
        let errorMessage = (
          <div>
            <br />
            <a
              style={{ textDecoration: "underline", color: "white" }}
              target="blank"
              href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
            >
              Add Metamask from here
            </a>
          </div>
        );
        const redirectToMetaMask = () => {
          window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en", "_blank")
        }
        const alertProperty = {
            isDismissible: false,
            variant: "danger",
            content: "Non-Ethereum browser detected. You should consider trying ",
            actionFunction: redirectToMetaMask,
            actionText: 'MetaMask!'
          }
          ReactDOM.render(<AlertBanner {...alertProperty}></AlertBanner>, document.querySelector('.appHeader'))
        reject(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    });
    return promise;
  }

  publish(payLoad, transactionInitiated, transactionCompleted, transactionFailed) {
    payLoad.price = this.web3.utils.toWei(payLoad.price, "ether");
    isConfirmed = false;

    const transactionObject = {
      value: this.web3.utils.toWei("0.00", "ether"),
      from: payLoad.creator,
    };
    console.log("publishing contract", this.web3.eth.transactionConfirmationBlocks );

    this.contract.methods
      .publish(payLoad.PDFHash, payLoad.price)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        payLoad.transactionID = hash;
        transactionInitiated(payLoad);
      })
      .once("receipt", function(receipt) {
        // console.log(JSON.stringify(receipt))
        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
        let tokenID =
          tokenReturns &&
          _.get(receipt.events, "Transfer.returnValues.tokenId").toNumber();
        payLoad.ideaID = tokenID;
        if (tokenID) {
          transactionCompleted(payLoad);
        }

      })
      .once("confirmation", function(confirmationNumber, receipt) {
        isConfirmed = true;
        EmitInterface.sendMessage('METAMAST_CONFIRMATION', isConfirmed);
        console.log(receipt);
      })
      .on("error", (err) => {
        let transactionHash = payLoad.transactionID;
        this.web3.eth.getTransaction(transactionHash).then(tx =>{
          this.web3.eth.call(tx, tx.blockNumber).then(result => {
            transactionFailed(result.data.message,transactionHash)
          }).catch(error =>{
            transactionFailed(_.get(error,"data.message"),transactionHash)
          })
        }).catch(hashError =>{
          transactionFailed(_.get(hashError,"data.message"),transactionHash)
        })
      });
  }

  getTokens() {
    return this.tokens;
  }

  buySignature(updatePayLoad, transactionInitiated, transactionCompleted, transactionFailed) {
    let metamaskAddress = _.clone(updatePayLoad.buyer.metamaskId)
    const transactionObject = {
      value: this.web3.utils.toWei(updatePayLoad.price, "ether"),
      from: this.web3.utils.toChecksumAddress(metamaskAddress),
    };
    this.contract.methods
      .buy(updatePayLoad.ideaID)
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        console.log("updated with transaction id ::", hash);
        updatePayLoad.transactionID = hash;
        transactionInitiated(updatePayLoad);
      })
      .once("receipt", function(receipt) {
        transactionCompleted(updatePayLoad);
      })
      .once("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber);
      })
      .on("error", (err) => {
        console.log(err);
        let transactionHash = updatePayLoad.transactionID;
          if(_.isUndefined(transactionHash)){
            transactionFailed("Transaction could not be initiated",transactionHash)
          }else{
            this.web3.eth.getTransaction(transactionHash).then(tx =>{
              this.web3.eth.call(tx, tx.blockNumber).then(result => {
                transactionFailed(result.data.message,transactionHash)
              }).catch(error =>{
                transactionFailed(_.get(error,"data.message"),transactionHash)
              })
            }).catch(hashError =>{
              transactionFailed(_.get(hashError,"data.message"),transactionHash)
            })
          }
      });
  }

  updatePrice(updatePayLoad, successCallback, feedbackCallback) {
    const transactionObject = {
      from: updatePayLoad.owner.metamaskId,
    };
    this.contract.methods
      .setPrice(updatePayLoad.ideaID, this.web3.utils.toWei(updatePayLoad.price, "ether"))
      .send(transactionObject)
      .on("transactionHash", function(hash) {
        feedbackCallback(updatePayLoad);
      })
      .once("receipt", function(receipt) {
        let tokenReturns = _.get(
          receipt.events,
          "Transfer.returnValues.tokenId"
        );
        successCallback(updatePayLoad);
      })
      .once("confirmation", function(confirmationNumber, receipt) {
        console.log("confirmation :: " + confirmationNumber);
      })
      .on("error", console.error);
  }


  retrieveConfirmStatus() {
    return isConfirmed;
  }

  retrieveWeb3 () {
    return this.web3;
  }
  
}

export default new BlockchainInterface();
