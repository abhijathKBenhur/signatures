import React from 'react';
import './wallet.scss';

const Wallet = ({coinType, coinBalance,description, selectWalletHandler, ...props}) => {

    return (
        <div className="wallet-container" onClick={() => selectWalletHandler(coinType)}>
            <div className="wallet-type">
                 <p> {coinType}</p>
            </div>
            <div className="coin-amount">
                <h5>{coinBalance || 0.00}</h5>
            </div>
            <div className="coin-description">
                <span>{description}</span>
            </div>
            
        </div>
    )
}

export default Wallet