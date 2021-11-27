import React, { useEffect, useState } from "react";
import BlockchainInterface from "../../interface/BlockchainInterface";
import "./wallet.scss";
import Web3Utils from "web3-utils";
import coin from  "../../../assets/logo/tribeGoldCoin.png"
import polygon from  "../../../assets/logo/polygon.png"
import { shallowEqual, useSelector } from "react-redux";
import {
  Popover,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";

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

  const maticPopover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">How to get Matic?</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Body>
    </Popover>
  );

  const goldPopover = (
    <Popover id="popover-basic2">
      <Popover.Header as="h3">How to earn TRBG?</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="wallet-wrapper mb-3">
      <div
        className="wallet-container"
        // onClick={() => 
        //   window.open(reduxChain+"/address/0x2E56AeBAb0Ba3a5904fB1fA424eaae89e5147187")
        // }
      >
      <div className="wallet-type d-flex justify-content-between">
        <div className="d-flex">
          <div className="father-grey color-primary mr-1"> {goldBalance} TRIBEGOLD</div>
          <img height={40} width={40} src={coin}></img>
        </div>



        {/* </Tooltip>}> */}
              <i data-html="true" className="second-grey fa fa-question-circle-o" title="Ways to earn TribeGold [TRBG] -  Mint Ideas , Get upvotes for your Ideas,  Get followers, Get your friends to sign up in IdeaTribe, Visit IdeaTribe often and engage with the community!<br/>"></i>
        {/* </OverlayTrigger> */}
        

      </div>
      <div className="coin-amount">
      </div>
        <div className="next-step">
          <p className="second-header"> You can earn TRBG by minting Ideas and helping the community</p>
        </div>
      </div>
      <div
        className="wallet-container"
        // onClick={() => 
        //   window.open(reduxChain+"/address/0xebB129c1d9ed956e9D1A4F342a5166b06A153475")
        // }
      >
        <div className="wallet-type d-flex justify-content-between">
          <div className="d-flex">
            <div className="father-grey color-secondary mr-1"> {parseFloat(maticBalance).toFixed(4)} MATIC</div>
            <img height={40} width={40}  src={polygon}></img>
          </div>
          {/* <OverlayTrigger placement="right" overlay={<Tooltip id={`tooltip-top`}>If you need help in adding more Matic to your Metamask wallet, write to us at contact@ideatribe.io</Tooltip>}> */}
              <i className="second-grey fa fa-question-circle-o" data-html="true" title="If you need help in adding more Matic to your Metamask wallet, write to us at contact@ideatribe.io"></i>
        {/* </OverlayTrigger> */}

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
