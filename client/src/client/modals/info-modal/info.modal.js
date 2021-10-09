import React, { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import _ from "lodash";
import { Row, Col, Form, InputGroup, Dropdown } from "react-bootstrap";
import CONSTANTS from "../../commons/Constants";
import { getPurposeIcon } from "../../commons/common.utils";
import { showToaster } from "../../commons/common.utils";
import "./info.modal.scss";
import Web3 from "web3";
import SignatureInterface from "../../interface/SignatureInterface";
import TransactionsInterface from "../../interface/TransactionInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
const PASSED = "PASSED",
  FAILED = "FAILED",
  PROGRESS = "PROGRESS",
  INIT = "INIT";
const InfoModal = (props) => {
  const priceRef = useRef(null);
  const getTagsElement = () => {
    try {
      if (!_.isEmpty(_.get(props, "category"))) {
        const category = JSON.parse(_.get(props, "category"));
        return (
          !_.isEmpty(category) &&
          category.map((tag) => (
            <span className="tag-item" key={tag.label}>
              {tag.label}
            </span>
          ))
        );
      }
    } catch (err) {
      return null;
    }
  };

  const isSelectedPurpose = (purpose) => {
    return form.purpose.purposeType === purpose;
  };
  const [publishState, setPublishState] = useState(INIT);
  const [publishError, setPublishError] = useState(INIT);
  const [priceUpdated, setPriceUpdated] = useState(false);

  const handleChange = (event) => {
    let returnObj = {};
    returnObj[event.target.name] = event.target.value;
    if (event.target.name == "price") {
      setPriceUpdated(true);
    }
    setFormData({ ...form, ...returnObj });
  };

  const [form, setFormData] = useState({
    owner: props.idea.owner,
    creator: props.idea.creator,
    title: props.idea.title,
    category: props.idea.category,
    description: props.idea.description,
    price: new Web3(window.ethereum).utils.fromWei(props.idea.price, "ether"),
    thumbnail: props.idea.thumbnail,
    PDFFile: props.idea.PDFFile,
    PDFHash: props.idea.PDFHash,
    ideaID: props.idea.ideaID,
    transactionID: props.idea.transactionID,
    purpose: {
      purposeType:
        _.get(props.idea, "purpose.purposeType") || CONSTANTS.PURPOSES.SELL,
      subType:
        _.get(props.idea, "purpose.subType") || CONSTANTS.COLLAB_TYPE[0].value,
      message: _.get(props.idea, "purpose.message") || "",
    },
    storage: props.idea.storage,
    units: props.idea.units,
  });

  const setPurpose = (entry) => {
    let currentPurpose = form.purpose;
    setFormData({
      ...form,
      purpose: { ...currentPurpose, purposeType: entry },
    });
  };

  let pusposeList = [
    CONSTANTS.PURPOSES.SELL,
    CONSTANTS.PURPOSES.AUCTION,
    CONSTANTS.PURPOSES.LICENSE,
    CONSTANTS.PURPOSES.COLLAB,
    CONSTANTS.PURPOSES.KEEP,
  ];

  function changeCollabSubType(subType) {
    let currentPurpose = form.purpose;
    setFormData({
      ...form,
      purpose: {
        ...currentPurpose,
        subType: subType,
      },
    });
  }

  function transactionInitiated(transactionInititationRequest) {
    TransactionsInterface.postTransaction({
      transactionID: transactionInititationRequest.transactionID,
      Status: "PENDING",
      type: "UPDATE_PRICE",
      user: form.owner,
    });
  }

  function transactionCompleted(successResponse) {
    updatePriceInMonge(successResponse);
    setPublishState(PASSED);
  }

  function transactionFailed(errorMessage, failedTransactionId) {
    setPublishState(FAILED);
    setPublishError("Price couldnot be updated on blockchain. " + errorMessage);
    console.log("transactionID", failedTransactionId);
    TransactionsInterface.setTransactionState({
      transactionID: failedTransactionId,
      status: CONSTANTS.ACTION_STATUS.FAILED,
      user: form.owner,
    });
  }

  const updateIdea = () => {
    let request = {
      ...form,
    };
    if (priceUpdated) {
      let newPriceInWei = new Web3(window.ethereum).utils.toWei(
        form.price,
        "ether"
      );
      request.price = newPriceInWei;
      BlockChainInterface.updatePrice(
        form,
        transactionInitiated,
        transactionCompleted,
        transactionFailed
      );
    } else {
      updatePriceInMonge(request);
    }
  };

  const updatePriceInMonge = (request) => {
    SignatureInterface.updatePurpose(request).then((success) => {
      showToaster("Idea updated!", { type: "dark" });
      setFormData(success.data);
      props.onHide();
    });
  };

  function getConditionalCompnent() {
    switch (form.purpose.purposeType) {
      case CONSTANTS.PURPOSES.AUCTION:
        return (
          <Col md="12">
            <span className="purpose-message second-grey">
              We know your idea is worth the traction. We will get you there
              sooon.
            </span>
          </Col>
        );

      case CONSTANTS.PURPOSES.SELL:
        return (
          <Col md="12">
            <span className="purpose-message second-grey">
              Set a price to the idea and it will be sold immediately when there
              is a buyer.
            </span>
            <div className="price-section">
              <div className="price-label second-grey">
                <Form.Label>
                  {CONSTANTS.PURPOSES.AUCTION === form.purpose.purposeType
                    ? "Base price"
                    : "Price"}
                </Form.Label>
              </div>
              <InputGroup className="price-input-group">
                <Form.Control
                  type="number"
                  placeholder="how much do you think your idea is worth ?"
                  min={1}
                  value={form.price ? form.price : undefined}
                  aria-label="Amount (ether)"
                  name="price"
                  onChange={handleChange}
                  ref={priceRef}
                />
                <InputGroup.Text>{CONSTANTS.CURRENCY.name}</InputGroup.Text>
              </InputGroup>
            </div>
          </Col>
        );
        break;
      case CONSTANTS.PURPOSES.COLLAB:
        return (
          <Col md="12">
            <span className="purpose-message second-grey">
              You may chose to license it to multiple people. Only your idea
              will be available in the market.
            </span>
            <div className="collab-section">
              <Dropdown className="w-100">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="w-100 justify-content-start"
                >
                  {
                    _.find(CONSTANTS.COLLAB_TYPE, {
                      value: form.purpose.subType,
                    }).label
                  }
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {CONSTANTS.COLLAB_TYPE.map((item) => (
                    <Dropdown.Item
                      name="storageGroup"
                      className="collabSubType"
                      onClick={() => changeCollabSubType(item.value)}
                    >
                      {item.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        );
        break;
      case CONSTANTS.PURPOSES.LICENSE:
        return (
          <Col md="12" sm="12" lg="12" cs="12">
            <Row>
              <Col md="12">
                <span className="purpose-message second-grey">
                  You may chose to license it to multiple people. Only your idea
                  will be available in the market.
                </span>
              </Col>
            </Row>
            <Row>
              <Col md="6" sm="12" xs="12" lg="6">
                {/* <span className="purpose-message second-grey">Amount per unit</span> */}
                <InputGroup className="price-input-group">
                  <Form.Control
                    type="number"
                    placeholder="Price per unit"
                    min={1}
                    value={form.price ? form.price : undefined}
                    name="price"
                    onChange={handleChange}
                    ref={priceRef}
                  />
                  <InputGroup.Text>BNB</InputGroup.Text>
                </InputGroup>
              </Col>
              <Col md="6" sm="12" xs="12" lg="6">
                {/* <span className="purpose-message second-grey">Number of units</span> */}
                <InputGroup className="price-input-group">
                  <Form.Control
                    type="number"
                    placeholder="Number of units"
                    min={1}
                    value={form.units ? form.units : undefined}
                    aria-label="units"
                    name="units"
                    onChange={handleChange}
                    ref={priceRef}
                  />
                  <InputGroup.Text>UNITS</InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
          </Col>
        );
      case CONSTANTS.PURPOSES.KEEP:
        return (
          <Col md="12">
            <span className="purpose-message second-grey">
              The record will not be open for any interaction. It will be still
              be visible for everyone.
            </span>
          </Col>
        );
    }
  }

  const isDisabled = (action) => {
    return (
      [CONSTANTS.PURPOSES.AUCTION, CONSTANTS.PURPOSES.LICENSE].indexOf(action) >
      -1
    );
  };

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="lg"
      className="info-modal"
      dialogClassName="info-modal-dialog"
      centered
    >
      <Modal.Body className="info-modal-body">
        <div className="modal-header-wrapper">
          <Col md="12" className="">
            <span className="father-grey">Engagement</span>
          </Col>
        </div>
        <div className="purpose-selection">
          <Row className="purpose-selector-row">
            <Col md="12" className="">
              <div className="purpose-label master-grey">
                <Form.Label>
                  What would you like to do with the idea ?{" "}
                </Form.Label>
              </div>
              <div className="purpose-tabs">
                {pusposeList.map((entry) => {
                  return (
                    <div
                      className={`${
                        isSelectedPurpose(entry)
                          ? "purpose-entry selected"
                          : "purpose-entry"
                      } ${isDisabled(entry) ? "disabled" : ""}`}
                      onClick={() => {
                        setPurpose(entry);
                      }}
                    >
                      <i className={getPurposeIcon(entry)}></i>
                      <span className="second-grey purpose-text">{entry}</span>
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </div>
        <div className="selective-component">
          <div>{getConditionalCompnent()}</div>

          {/* {form.purpose.purposeType == CONSTANTS.PURPOSES.COLLAB &&  */}
          <Col>
            <Form.Control
              value={form.purpose.message}
              as="textarea"
              className="mt-3"
              rows={7}
              aria-describedby="inputGroupAppend"
              name="description"
              placeholder="Description upto 250 words"
              style={{ resize: "none", borderRadius: "5px" }}
              onChange={(event) => {
                setFormData({
                  ...form,
                  purpose: {
                    purposeType: form.purpose.purposeType,
                    subType: form.purpose.subType,
                    message: event.target.value,
                  },
                });
              }}
            />
          </Col>
          {/* } */}
        </div>
        <Row className="button-section  d-flex mb-4  ">
          <Col xs="12" className="button-bar justify-content-end d-flex">
            <Button className="btn-ternary mr-2 mt-2" onClick={props.onHide}>
              Cancel
            </Button>
            <Button className="submit-btn  mt-2" onClick={() => updateIdea()}>
              Update
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};
export default InfoModal;
