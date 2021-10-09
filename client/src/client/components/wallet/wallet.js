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
        <p> {goldBalance}</p>
      </div>
      <div className="coin-amount">
        <h5> TRBG </h5>
      </div>
        <div className="wallet-type">
          <p> {maticBalance}</p>
        </div>
        <div className="coin-amount">
          <h5> MATIC </h5>
        </div>
      </div>
      <div className="transaction-wrapper">
        {/* {
          <Transactions
            transactionList={walletState.trasactionList}
            transactionType={walletState.selectedWallet}
          />
        } */}
      </div>
    </div>
  );
};

export default Wallet;
