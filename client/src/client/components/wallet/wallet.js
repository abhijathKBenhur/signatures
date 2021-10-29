import React, { useEffect, useState } from "react";
import BlockchainInterface from "../../interface/BlockchainInterface";
import "./wallet.scss";
import Web3Utils from "web3-utils";


const Wallet = (props) => {
  const [goldBalance, setGoldBalance] = useState(0);
  const [maticBalance, setMaticBalance] = useState(0);


  useEffect(() => {
    BlockchainInterface.getGoldBalance()
    .then((success) => {
      let balance = Web3Utils.fromWei(success.toString(), "ether")
      setGoldBalance(balance)
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
          window.open("https://mumbai.polygonscan.com")
        }
      >
      <div className="wallet-type">
        <p className="father-grey color-primary"> {goldBalance} TRIBE GOLD</p>
      </div>
      <div className="coin-amount">
        {/* <p className="master-grey"> TRIBE GOLD </p> */}
      </div>
        <div className="next-step">
          <p className="second-header"> You can earn gold by flourishing the community. </p>
        </div>
        
      </div>
      <div
        className="wallet-container"
        onClick={() => 
          window.open("https://mumbai.polygonscan.com")
        }
      >
        <div className="wallet-type">
          <p className="father-grey color-secondary"> {maticBalance} MATIC</p>
        </div>
        <div className="coin-amount">
          {/* <p className="master-grey"> MATIC </p> */}
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
