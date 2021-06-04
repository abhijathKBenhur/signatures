import { useHistory } from "react-router-dom";
import _ from "lodash"
import Signature from '../../beans/Signature';
import loader from "../../../assets/loader.gif";
import { MoreHorizontal, Eye, Share, Crosshair, Edit3 } from "react-feather";
import "./collection-card.scss";
import { confirm } from "../../modals/confirmation/confirmation";
import { Row, Col, Dropdown } from "react-bootstrap";
import Image from "react-image-resizer";
import React, { useState, useEffect } from "react";
import BlockChainInterface from "../../interface/BlockchainInterface";
import MongoDBInterface from "../../interface/MongoDBInterface";
import { toast } from "react-toastify";
import Web3Utils from "web3-utils";

const CollectionCard = (props) => {
  let history = useHistory();
  const [signature, setSignature] = useState(new Signature(props.card));
  function openCardView(signature) {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }

  function copyClipBoard() {
    let shareURL =
      window.location.href + "?referrer=" + localStorage.getItem("userInfo");
    navigator.clipboard.writeText(shareURL);

    toast.dark("Copied to clipboard!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function openInEtherscan() {
    window.open("https://kovan.etherscan.io/tx/" + signature.transactionID);
  }

  function updatePriceInMongo(signature) {
    MongoDBInterface.updatePrice(signature).then((updatedSignature) => {
      signature.price = _.get(updatedSignature, "data.data.price");
    });
  }

  function feedbackMessage() {
    toast.dark(
      "Your order has been placed. Please wait a while for it to be processed.",
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  }

  function editPrice(signature) {
    confirm(
      "Set your price.",
      "Please enter the sell price",
      "Ok",
      "Cancel",
      true
    ).then((success) => {
      if (success.proceed) {
        signature.price = Web3Utils.toWei(success.input);
        BlockChainInterface.updatePrice(
          signature,
          updatePriceInMongo,
          feedbackMessage
        );
      } else {
      }
    });
  }

  useEffect(() => {}, []);

  const CollectionMenu = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <MoreHorizontal
        color="#79589F"
        className="cursor-pointer "
      ></MoreHorizontal>
    </a>
  ));

  return (
    <Col
      md="4"
      lg="3"
      sm="6"
      xs="12"
      className="collection-card col-md-offset-2"
    >
      <div className="content cursor-pointer">
        <div className="collection-header d-flex justify-content-between align-items-center p-2">
          <div className="header-left">
            {_.isEmpty(signature.ideaID) ? 
            <img width={20} src={loader}></img>: <div></div>}
          </div>
          <div className="header-right">
            <Dropdown>
              <Dropdown.Toggle
                as={CollectionMenu}
                id="collection-dropdown"
              ></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className="dropdown-item"
                  eventKey="1"
                  onClick={() => {
                    openCardView(signature);
                  }}
                >
                  <Eye className="signature-icons" size={15}></Eye>
                  View
                </Dropdown.Item>

                <Dropdown.Item
                  className="dropdown-item"
                  eventKey="2"
                  onClick={() => {
                    editPrice();
                  }}
                >
                  <Edit3 className="signature-icons" size={15}></Edit3>
                  Edit Price
                </Dropdown.Item>

                <Dropdown.Item
                  className="dropdown-item"
                  eventKey="2"
                  onClick={() => {
                    copyClipBoard();
                  }}
                >
                  <Share className="signature-icons" size={15}></Share>
                  Share
                </Dropdown.Item>

                <Dropdown.Item
                  className="dropdown-item"
                  eventKey="2"
                  onClick={() => {
                    openInEtherscan();
                  }}
                >
                  <Crosshair className="signature-icons" size={15}></Crosshair>
                  View transaction
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div
          className="collection-preview"
          onClick={() => {
            openCardView(signature);
          }}
        >
          <Col md="12 collection-image">
            <Image
              src={signature.thumbnail}
              height={200}
              style={{
                background: "#f1f1f1",
              }}
            />
          </Col>
        </div>
        <div className="collection-footer">
          <div md="12">
            <p className="text-left">{signature.title}</p>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default CollectionCard;
