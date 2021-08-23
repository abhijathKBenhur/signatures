import React, { useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import { Row, Col, Form, InputGroup, Dropdown } from "react-bootstrap";
import CONSTANTS from "../../commons/Constants";
import Web3Utils from "web3-utils";
import { getPurposeIcon } from "../../commons/common.utils";
import "./info.modal.scss";
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

  const isSelectedPurpose = (purpose) => form.purpose.purposeType === purpose;

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
    purpose: props.idea.purpose || {
      type: CONSTANTS.PURPOSES.SELL,
      subType:  CONSTANTS.COLLAB_TYPE[0],
      message: ""
    },
    storage: props.idea.storage,
    units: props.idea.units,
  });

  const setPurpose = (entry) => {
    setFormData({ ...form, purpose: { type: entry } });
  };

  const getIdeaStatus = (purpose) => {
    switch (purpose.purposeType) {
      case CONSTANTS.PURPOSES.SELL:
        return "On Sale";

      case CONSTANTS.PURPOSES.AUCTION:
        return "On Auction";

      case CONSTANTS.PURPOSES.COLLAB:
        return "Inviting Collaborators";

      case CONSTANTS.PURPOSES.KEEP:
        return "Personal Record";
      default:
        return null;
    }
  };
  let pusposeList = [
    CONSTANTS.PURPOSES.SELL,
    CONSTANTS.PURPOSES.AUCTION,
    CONSTANTS.PURPOSES.LICENCE,
    CONSTANTS.PURPOSES.COLLAB,
    CONSTANTS.PURPOSES.KEEP,
  ];

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
                  {CONSTANTS.PURPOSES.AUCTION === form.purpose
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
                <InputGroup.Text>Tribe Coin</InputGroup.Text>
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
                  className="w-100 justify-content-start "
                >
                  {form.collab}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {CONSTANTS.COLLAB_TYPE.map((item) => (
                    <Dropdown.Item
                      name="storageGroup"
                      className="collabSubType"
                      onClick={() =>
                        setFormData({ ...form, collab: item.value })
                      }
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
                    aria-label="Amount (BNB)"
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
          <h4>Engagement</h4>
          <i className="fa fa-close" onClick={props.onHide}></i>
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
                      className={
                        isSelectedPurpose(entry)
                          ? "purpose-entry selected"
                          : "purpose-entry"
                      }
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

          <Col>
            <Form.Control
              value={form.purpose.message}
              as="textarea"
              className="mt-3"
              rows={7}
              aria-describedby="inputGroupAppend"
              name="description"
              placeholder="Description upto 250 words"
              style={{ resize: "none", borderRadius:"5px" }}
              onChange= {(event) => {
                setFormData({ ...form, purpose: { type:form.purpose.purposeType, subType:form.purpose.subType ,message: event.target.value } })
              }}
            />
          </Col>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default InfoModal;
