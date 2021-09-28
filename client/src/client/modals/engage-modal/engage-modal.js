import React, { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import _ from "lodash";
import { Row, Col, Form, InputGroup, Dropdown, Image } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import CONSTANTS from "../../commons/Constants";
import minions from "../../../assets/images/minions.png";
import loadingGif from "../../../assets/images/loader_blocks.gif";
import error from "../../../assets/images/error.png";
import purchased from "../../../assets/images/purchased.png";
import { getPurposeIcon } from "../../commons/common.utils";
import { showToaster } from "../../commons/common.utils";
import "./engage-modal.scss";
import SignatureInterface from "../../interface/SignatureInterface";
import BlockchainInterface from "../../interface/BlockchainInterface";
import Web3 from "web3";
import TransactionsInterface from "../../interface/TransactionInterface";
const EngageModal = (props) => {
  let history = useHistory();
  const isSelectedPurpose = (purpose) => {
    return form.purpose.purposeType === purpose;
  };
  const app_constants = CONSTANTS;
  const [engaging, setEngaging] = useState(CONSTANTS.ACTION_STATUS.INIT);
  const [statusMessage, setStatusMessage] = useState("");

  const [form, setFormData] = useState({
    owner: props.idea.owner,
    creator: props.idea.creator,
    title: props.idea.title,
    category: props.idea.category,
    description: props.idea.description,
    price: window.web3.utils.fromWei(props.idea.price, "ether"),
    thumbnail: props.idea.thumbnail,
    PDFFile: props.idea.PDFFile,
    PDFHash: props.idea.PDFHash,
    ideaID: props.idea.ideaID,
    transactionID: props.idea.transactionID,
    purpose: {
      purposeType: CONSTANTS.PURPOSES.SELL,
      subType: CONSTANTS.COLLAB_TYPE[0].value,
      message: "",
      ...props.idea.purpose,
    },
    storage: props.idea.storage,
    units: props.idea.units,
  });

  let pusposeList = [
    CONSTANTS.PURPOSES.SELL,
    CONSTANTS.PURPOSES.AUCTION,
    CONSTANTS.PURPOSES.LICENSE,
    CONSTANTS.PURPOSES.COLLAB,
    CONSTANTS.PURPOSES.KEEP
  ];

  function transactionInitiated(transactionInititationRequest) {
    console.log("transactionInititationRequest");
    TransactionsInterface.postTransaction({
      transactionID: transactionInititationRequest.transactionID,
      Status: app_constants.ACTION_STATUS.PENDING,
      type: app_constants.ACTIONS.BUY_IDEA,
      user: props.currentUser._id,
      value: window.web3.utils.toWei(transactionInititationRequest.price, "ether")
    });
    
    setEngaging(app_constants.ACTION_STATUS.PENDING);
  }

  function transactionCompleted(successResponse) {
    console.log("transactionCompleted");
    let buyer = successResponse.buyer;
    let seller = successResponse.owner;
    let PDFHash = successResponse.PDFHash;
    SignatureInterface.buySignature({
      buyer,
      seller,
      PDFHash,
    }).then((success) => {
      TransactionsInterface.setTransactionState({
        transactionID: successResponse.transactionID,
        status: app_constants.ACTION_STATUS.COMPLETED,
        user: successResponse.buyer._id
      });
      setEngaging(app_constants.ACTION_STATUS.PASSED);
      history.push( "/profile/"+ successResponse.buyer.userName);
    
    });
  }

  function transactionFailed(errorMessage, failedTransactionId) {
    console.log("transactionFailed");
    setEngaging(app_constants.ACTION_STATUS.FAILED);
    TransactionsInterface.setTransactionState({
      transactionID: failedTransactionId,
      status: app_constants.ACTION_STATUS.FAILED,
      user: props.currentUser._id
    });
    setStatusMessage(errorMessage)
  }

  const getEngageText = (purpose, isVerb) => {
    switch (purpose.purposeType) {
      case CONSTANTS.PURPOSES.SELL:
        return isVerb ? "available for purchase" : "Buy";

      case CONSTANTS.PURPOSES.LICENSE:
        return isVerb ? "available for licensing" : "Buy";

      case CONSTANTS.PURPOSES.AUCTION:
        return isVerb ? "available for auction" : "Bid";

      case CONSTANTS.PURPOSES.COLLAB:
        return isVerb ? "available for collaboration" : "Collaborate";

      case CONSTANTS.PURPOSES.KEEP:
        return "Okay";
      default:
        return null;
    }
  };

  const engage = (purpose) => {
    switch (purpose.purposeType) {
      case CONSTANTS.PURPOSES.SELL:
        let payLoad = {
          ...form,
          buyer: props.currentUser,
          seller: form.owner,
        };
        BlockchainInterface.buySignature(
          payLoad,
          transactionInitiated,
          transactionCompleted,
          transactionFailed
        );
      case CONSTANTS.PURPOSES.LICENSE:
        return "Buy";

      case CONSTANTS.PURPOSES.AUCTION:
        return "Bid";

      case CONSTANTS.PURPOSES.COLLAB:
        return "Collaborate";

      case CONSTANTS.PURPOSES.KEEP:
        props.onHide();
      default:
        return null;
    }
  };

  const getPlaceholder = () => {
    switch (engaging) {
      case CONSTANTS.ACTION_STATUS.PENDING:
        return loadingGif;
        break;
      case CONSTANTS.ACTION_STATUS.INIT:
        return minions;
        break;
      case CONSTANTS.ACTION_STATUS.COMPLETED:
        return purchased;
        break;
      case CONSTANTS.ACTION_STATUS.FAILED:
        return error;
        break;
    }
  };
  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="lg"
      className="info-modal"
      dialogClassName="info-modal-dialog"
      centered
      close="true"
    >
      <Modal.Body className="info-modal-body">
        <div className="modal-header-wrapper">
          <Col md="12" className="">
            <h4>Engage</h4>
          </Col>
        </div>
        <div className="purpose-selection">
          <Row className="purpose-selector-row">
            <Col md="12" className="">
              <div className="purpose-label master-grey">
                <Form.Label>
                  This idea is {getEngageText(form.purpose, true)}
                </Form.Label>
              </div>
              <div className="purpose-tabs">
                {pusposeList.map((entry) => {
                  return (
                    <div
                      className={
                        isSelectedPurpose(entry)
                          ? "purpose-entry selected"
                          : "purpose-entry disabled"
                      }
                    >
                      <span className="master-grey purpose-text">
                        {getEngageText({ purposeType: entry }, false)}
                      </span>

                      {form.purpose.purposeType == CONSTANTS.PURPOSES.SELL &&
                      form.purpose.purposeType == entry ? (
                        <span className="color-white">
                          {" "}
                          {form.price} MATIC{" "}
                        </span>
                      ) : (
                        <i className={getPurposeIcon(entry)}></i>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="image-placeholder">
                <Image className="img-fluid" src={getPlaceholder()} width="300px"></Image>
                
              </div>
              <span className={"status_message " + engaging}>{statusMessage}</span>
            </Col>
          </Row>
        </div>
        <div className="selective-component">
          {/* <div>{getConditionalCompnent()}</div> */}

          {/* {form.purpose.purposeType == CONSTANTS.PURPOSES.COLLAB &&  */}
          <Col>
            <span>{form.purpose.message}</span>
          </Col>
          {/* } */}
        </div>

        <Col xs="12" className="button-bar justify-content-between d-flex">
          <Button
            className="btn-ternary mr-2 mt-2"
            onClick={props.onHide}
            disabled={engaging == CONSTANTS.ACTION_STATUS.PENDING}
          >
            Cancel
          </Button>
          <Button
            className="submit-btn  mt-2"
            disabled={engaging == CONSTANTS.ACTION_STATUS.PENDING}
            onClick={() => engage(form.purpose)}
          >
            {getEngageText(form.purpose)}
          </Button>
        </Col>
      </Modal.Body>
    </Modal>
  );
};
export default EngageModal;
