
import React from 'react';
import _ from 'lodash';
import { Table } from 'react-bootstrap';
import './transactions.scss';

const Transactions = ({transactionType, transactionList = [], ...props}) => {

    return(
        <div className="transaction-container">
            <div className="transaction-type">
                <h6>{transactionType}</h6>
            </div>
            {
                _.isEmpty(transactionList) ? <div className="no-transaction">
                        <h6>No transaction to display!</h6>
                    </div>
                    : 
                <div className="transaction-list">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        transactionList.map(transaction => (
                            <tr>
                                <td>{transaction.from}</td>
                                <td>{transaction.to}</td>
                                <td>{transaction.amount}</td>

                            </tr>
                        ))
                    }  
                    </tbody>
                    </Table>
                         
                </div>
            }
        </div>
    )
}

export default Transactions