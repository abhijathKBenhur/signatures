import React, { useEffect, useState } from "react";
import BlockchainInterface from "../../interface/BlockchainInterface";
import "./wallet.scss";
import Web3Utils from "web3-utils";
import coin from  "../../../assets/logo/tribeGoldCoin.png"
import polygon from  "../../../assets/logo/polygon.png"
import { shallowEqual, useSelector } from "react-redux";
const Wallet = (props) => {
  const [goldBalance, setGoldBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);
  const reduxState = useSelector((state) => state, shallowEqual);
  const {  reduxChain = undefined } = reduxState;
  useEffect(() => {
    BlockchainInterface.getGoldBalance()
    .then((success) => {
      if(success){
        let balance = Web3Utils.fromWei(success.toString(), "ether")
        setGoldBalance(balance)
      }
    });
    
    BlockchainInterface.getMaticBalance().then((success) => {
      setMaticBalance(Web3Utils.fromWei(success, "ether"))
    });
  }, []);

  return (
    <div className="wallet-wrapper mb-3">
      <div
        className="wallet-container"
        onClick={() => 
          window.open(reduxChain+"/address/0x2E56AeBAb0Ba3a5904fB1fA424eaae89e5147187")
        }
      >
      <div className="wallet-type d-flex justify-content-between">
        <div className="father-grey color-primary"> {goldBalance} TRIBEGOLD</div>
        <img height={40} width={40} src={coin}></img>

      </div>
      <div className="coin-amount">
      </div>
        <div className="next-step">
          <p className="second-header"> You can earn TRBG by minting Ideas and helping the community</p>
        </div>
      </div>
      <div
        className="wallet-container"
        onClick={() => 
          window.open(reduxChain+"/address/0xebB129c1d9ed956e9D1A4F342a5166b06A153475")
        }
      >
        <div className="wallet-type d-flex justify-content-between">
          <div className="father-grey color-secondary"> {parseFloat(maticBalance).toFixed(4)} MATIC</div>
          <img height={40} width={40}  src={polygon}></img>
        </div>
        <div className="coin-amount">
        
        </div>
        <div className="next-step">
          <p className="second-header "> You can load MATIC from other wallets. </p>
        </div>
      </div>
      {/* <div className="transaction-wrapper">
       <span class="second-header">You can earn more tribe gold by</span>
      </div> */}
    </div>
  );
};

export default Wallet;
