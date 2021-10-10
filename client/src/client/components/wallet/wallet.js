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
    <div className="wallet-wrapper">
      <div
        className="wallet-container"
        // onClick={() => selectWalletHandler(coinType)}
      >
      <div className="wallet-type">
        <p className="father-grey color-white"> {goldBalance} TRBG</p>
      </div>
      <div className="coin-amount">
        <p className="master-grey color-white"> TRIBE GOLD </p>
      </div>
        
      </div>
      <div
        className="wallet-container"
        // onClick={() => selectWalletHandler(coinType)}
      >
        <div className="wallet-type">
          <p className="father-grey color-white"> {maticBalance}</p>
        </div>
        <div className="coin-amount">
          <p className="master-grey color-white"> MATIC </p>
        </div>
      </div>
      {/* <div className="transaction-wrapper">
       <span class="second-header">You can earn more tribe gold by</span>
      </div> */}
    </div>
  );
};

export default Wallet;
