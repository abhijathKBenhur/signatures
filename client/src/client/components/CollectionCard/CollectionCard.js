import { useHistory } from "react-router-dom";
import _ from "lodash";
import loader from "../../../assets/images/loader.gif";
import { MoreHorizontal, Eye, Share, Crosshair, Edit3 } from "react-feather";
import "./collection-card.scss";
import { confirm } from "../../modals/confirmation/confirmation";
import { Button,Row, Col, Dropdown } from "react-bootstrap";
import Image from "react-image-resizer";
import React, { useState, useEffect } from "react";
import BlockChainInterface from "../../interface/BlockchainInterface";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Web3Utils from "web3-utils";
import moment from "moment";
import { showToaster } from "../../commons/common.utils";
const CollectionCard = (props) => {
  let history = useHistory();
  const [signature, setSignature] = useState(props.card);
  function openCardView(signature) {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }

  function copyClipBoard() {
    let shareURL = window.location.href + "/signature/" + signature.PDFHash;
    navigator.clipboard.writeText(shareURL);
      showToaster('Copied to clipboard!', {type: 'dark'})
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
    showToaster("Your order has been placed. Please wait a while for it to be processed.", {type: 'dark'})
   
  }

  function editPrice(signature) {
    confirm(
      "Set your price.",
      "How much do you think your idea is worth?",
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
        color="#F39422"
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

                  {/* <Dropdown.Item
                    className="dropdown-item"
                    eventKey="2"
                    onClick={() => {
                      editPrice(signature);
                    }}
                  >
                    <Edit3 className="signature-icons" size={15}></Edit3>
                    Edit Price
                  </Dropdown.Item> */}

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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openInEtherscan();
                    }}
                  >
                    <Crosshair
                      className="signature-icons"
                      size={15}
                    ></Crosshair>
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
                background: "#272B34",
              }}
            />
            <div className="description">
                          <div className="heading">Description</div>
                          <div className="description-text">
                          {signature.description.split(' ').slice(0,40).join(' ')}

                          </div>
                          
                        </div>
          </Col>
        </div>
        <div className="collection-footer">
        <Row >
                        <Col md="12">
                          <Col md="12" className="tags">
                              {JSON.parse(signature.category) &&
                                JSON.parse(signature.category)
                                  .slice(0, 2)
                                  .map((category) => {
                                    return (
                                      <Button disabled variant="pill">
                                        {category.value}
                                      </Button>
                                    );
                                  })}
                            </Col>
                          </Col>
                      </Row>
                      <Row >
                      <Col md="12" className="idea-title">
                        <p className="text-left title">{signature.title}</p>
                      </Col>
                     
                      <Col md="6" className="idea-details">
                        {moment(signature.createdAt).format("DD-MMM-YYYY")} 
                      </Col>
                      <Col md="6" className="idea-user text-right">
                        {signature.creator.fullName} 
                      </Col>
          </Row>
        </div>
      </div>
    </Col>
  );
};

export default CollectionCard;
