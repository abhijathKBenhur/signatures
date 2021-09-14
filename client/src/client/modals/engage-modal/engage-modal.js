import React, { useState, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import _ from "lodash";
import { Row, Col, Form, InputGroup, Dropdown } from "react-bootstrap";
import CONSTANTS from "../../commons/Constants";
import Web3Utils from "web3-utils";
import { getPurposeIcon } from "../../commons/common.utils";
import { showToaster } from "../../commons/common.utils";
import "./engage-modal.scss";
import SignatureInterface from "../../interface/SignatureInterface";
import BlockchainInterface from "../../interface/BlockchainInterface";
const EngageModal = (props) => {
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

  const handleChange = (event) => {
    let returnObj = {};
    returnObj[event.target.name] =
      _.get(event, "target.name") === "price"
        ? Number(event.target.value)
        : event.target.value;
    setFormData({ ...form, ...returnObj });
  };

  const [form, setFormData] = useState({
    owner: props.idea.owner,
    creator: props.idea.creator,
    title: props.idea.title,
    category: props.idea.category,
    description: props.idea.description,
    price: props.idea.price,
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
    CONSTANTS.PURPOSES.LICENCE,
    CONSTANTS.PURPOSES.COLLAB,
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

  const updateIdea = () => {
    SignatureInterface.updatePurpose(form).then(success =>{
      showToaster("Idea updated!", { type: "dark" });
      props.onHide()
    })
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
              You may chose to licence it to multiple people. Only your idea
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
      case CONSTANTS.PURPOSES.LICENCE:
        return (
          <Col md="12" sm="12" lg="12" cs="12">
            <Row>
              <Col md="12">
                <span className="purpose-message second-grey">
                  You may chose to licence it to multiple people. Only your idea
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
                    aria-label="Amount"
                    name="price"
                    onChange={handleChange}
                    ref={priceRef}
                  />
                  <InputGroup.Text>{CONSTANTS.CURRENCY.name}</InputGroup.Text>
                </InputGroup>
              </Col>
              <Col md="6" sm="12" xs="12" lg="6">
                {/* <span className="purpose-message second-grey">Number of units</span> */}
                <InputGroup className="price-input-group">
                  <Form.Control
                    type="number"
                    placeholder="Number of units"
                    min={1}
                    value={form.umits ? form.umits : undefined}
                    aria-label="umits"
                    name="umits"
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

  const getEngageText = (purpose, isVerb) => {
    switch (purpose.purposeType) {
      case CONSTANTS.PURPOSES.SELL:
        return isVerb ? "available for purchase" :"Buy";
      
      case CONSTANTS.PURPOSES.LICENCE:
        return isVerb ? "available for licensing" :"Buy";

      case CONSTANTS.PURPOSES.AUCTION:
        return isVerb ? "available for auction" :"Bid";

      case CONSTANTS.PURPOSES.COLLAB:
        return isVerb ? "available for collaboration" :"Collaborate";

      case CONSTANTS.PURPOSES.KEEP:
        return "Not availble to engage.";
      default:
        return null;
    }
  };

  const engage = (purpose) =>{
    switch (purpose.purposeType) {
      case CONSTANTS.PURPOSES.SELL:
        BlockchainInterface.buySignature(form)
      case CONSTANTS.PURPOSES.LICENCE:
        return "Buy";

      case CONSTANTS.PURPOSES.AUCTION:
        return "Bid";

      case CONSTANTS.PURPOSES.COLLAB:
        return "Collaborate";

      case CONSTANTS.PURPOSES.KEEP:
        props.onHide()
      default:
        return null;
    }
  }

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="lg"
      className="info-modal"
      dialogClassName="info-modal-dialog"
      centered
      close
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
                  This idea is  {getEngageText(form.purpose,true)}
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
                      <i className={getPurposeIcon(entry)}></i>
                      <span className="second-grey purpose-text">{getEngageText({purposeType:entry},false)}</span>
                    </div>
                  );
                })}
              </div>
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
            <Button className="cancel-btn mr-2 mt-2" onClick={props.onHide}>
              Cancel
            </Button>
            <Button className="submit-btn  mt-2" onClick={() => engage(form.purpose)}>
              {getEngageText(form.purpose)}
            </Button>
          </Col>
      </Modal.Body>
    </Modal>
  );

 
};
export default EngageModal;
