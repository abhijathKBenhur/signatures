import React, { useState, useEffect } from "react";
import TransactionsInterface from "../../interface/TransactionInterface";
import Table from "react-bootstrap/Table";
import _ from "lodash";
import { shallowEqual, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import CustomerInterface from "../../interface/CustomerInterface";
import AlertBanner from "../alert/alert";
import ReactDOM from 'react-dom';
import Web3Utils from "web3-utils";

const IncentiveTable = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [rows, setRows] = useState([]);
  const { userDetails } = reduxState;
  

  useEffect(() => {
    TransactionsInterface.getGroupedEarnings({
      email:userDetails.email
    })
      .then((success) => {
        let data = _.get(success,"data.data");
        setRows(data);
      })
      .catch((err) => {});
  }, [userDetails]);

  const redeemFromCompany = (row) =>{
    CustomerInterface.redeemGold({...userDetails,companyName:row._id} ).then(success =>{
      window.location.reload();
    }).catch(err =>{
      const alertPropertyError = {
        isDismissible: true,
        variant: "danger",
        content: "Deposit has been failed. Please reach out to the customer team.",
      }
      ReactDOM.render(<AlertBanner {...alertPropertyError}></AlertBanner>, document.querySelector('.aleartHeader'))
    })
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Company</th>
          <th>Balance</th>
          <th>Redeem</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr>
            <th>{row._id}</th>
            <th>{row.total}</th>
            <th><Button disabled={row.total == 0} onClick={() =>{
              redeemFromCompany(row)
            }}>Redeeem</Button></th>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default IncentiveTable;
