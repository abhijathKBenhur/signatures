import React, { useEffect, useState } from "react";
import BlockchainInterface from "../../interface/BlockchainInterface";
import "./wallet.scss";

const Wallet = (props) => {
  const WalletData = [
    // {
    //   coinType: "Tribe Coin"
    //   coinBalance: "23 TBC",
    //   description: "You can create 23 ideas",
    // },
    {
      coinType: "Tribe Gold",
      coinBalance: "5 TBG",
      description: "",
    },
    // {
    //   coinType: "GAS",
    //   coinBalance: "0.0003 POLYGON",
    //   description: "You can post 20 ideas with the remaining gas",
    // },
  ];

  const DummyTransactionList = [
    {
      from: "account 1",
      to: "account 2",
      amount: 1,
    },
    {
      from: "account 3",
      to: "account 5",
      amount: 2,
    },
    {
      from: "account 6",
      to: "account 7",
      amount: 10,
    },
    {
      from: "account 8",
      to: "account 10",
      amount: 6,
    },
  ];
  const [goldBalance, setGoldBalance] = useState(0);

  useEffect(() => {
    BlockchainInterface.getGoldBalance().then((success) => {
      setGoldBalance(success);
    });
  }, []);

  return (
    <div className="wallet-wrapper">
      <div
        className="wallet-container"
        // onClick={() => selectWalletHandler(coinType)}
      >
        <div className="wallet-type">
          <p> asd</p>
        </div>
        <div className="coin-amount">
          <h5> 0.0</h5>
        </div>
        <div className="coin-description">
          <span>description</span>
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
