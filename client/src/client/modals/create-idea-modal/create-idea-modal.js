import {
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
  Button,
  Col,
  Row,
  InputGroup,
  Dropdown,
  Popover
} from "react-bootstrap";
import "css-doodle";
import React, { useState, useEffect } from "react";
import Dropzone from "react-dropzone";
import imagePlaceholder from "../../../assets/images/image-placeholder.png";
import artPlaceHolder from "../../../assets/images/art.png";
import businessPlaceHolder from "../../../assets/images/business.png";
import technicalPlaceHolder from "../../../assets/images/technical.png";
import CONSTANTS from "../../commons/Constants";
import Select from "react-select";
import * as reactShare from "react-share";
import { Download, Crosshair } from "react-feather";
import "./create-idea-modal.scss";
import loadingGif from "../../../assets/images/loader_blocks.gif";
import QRCode from "qrcode";
import signatureImage from "../../../assets/logo/signatures.png";
import jspdf from "jspdf";
import _ from "lodash";
import domtoimage from "dom-to-image";
import { getPurposeIcon } from "../../commons/common.utils";
import { shallowEqual, useSelector } from "react-redux";
import ClanInterface from "../../interface/ClanInterface";
import cover from "../../../assets/images/backgroundcss.png";
import { useHistory } from "react-router-dom";
import EmitInterface from "../../interface/emitInterface";
const CreateIdeaModal = ({
  formErrors,
  form,
  onImageDrop,
  clearImage,
  getInputProps,
  getRootProps,
  handleTagsChange,
  setPurpose,
  handleChange,
  priceRef,
  setFormData,
  checkValidationBeforeSubmit,
  publishState,
  publishError,
  billet,
  closeBtn,
  ...props
}) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [userClans, setUserClans] = useState([]);
  const [metaMastConfirmed, setMetaMastConfirmed] = useState(false);
  const [imgHolder, setImgHolder] = useState(artPlaceHolder);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const history = useHistory();

  useEffect(() => {
    let subscription = EmitInterface.getMessage().subscribe((event) => {
      switch (event.id) {
        case "METAMAST_CONFIRMATION":
          setMetaMastConfirmed(event.options);
          break;
        default:
          break;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);


  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
        right?
      </Popover.Body>
    </Popover>
  );

  const getThumbnailImage = () => {
    return form.thumbnail ? (
      <div className="imageUploaded w-100 h-100">
        {publishState == "INIT" ? (
          <OverlayTrigger placement="left" overlay={<Tooltip>Remove</Tooltip>}>
            <Button
              className="remove-thumbnail-btn"
              variant="outline-secondary"
              onClick={() => {
                clearImage();
              }}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </OverlayTrigger>
        ) : (
          <div></div>
        )}
        <img
          src={form.thumbnail.preview || form.thumbnail}
          className="uploadedImage"
          alt="thumbnail"
        ></img>
      </div>
    ) : (
      <Form.Row className="empty-image-row">
        <Dropzone
          onDrop={onImageDrop}
          acceptedFiles={".jpeg"}
          className="dropzoneContainer"
      >
          {({ getRootProps, getInputProps }) => (
            <section className="container h-100 ">
              <div
                {...getRootProps()}
                className="emptyImage dropZone h-100 d-flex flex-column align-items-center"
              >
                <input {...getInputProps()} />
                <img
                  src={imgHolder}
                  className="placeholder-image"
                  alt=" placehoder"
                />
                {publishState == "INIT" && <p className="dropfile-text">Edit thumbnail</p>}

                {formErrors.thumbnail && (
                  <p className="invalid-paragraph"> Thumbnail is required </p>
                )}
              </div>
            </section>
          )}
        </Dropzone>
      </Form.Row>
    );
  };
  function showInChainExplorer() {
    window.open("https://mumbai.polygonscan.com/tx/" + billet.transactionID);
  }
  const getQrcode = () => {
    QRCode.toCanvas(
      document.getElementById("canvas"),
      "https://mumbai.polygonscan.com/address/" +
        _.get(billet, "transactionID"),
      {
        color: {
          dark: "#1b1919", // black dots
          light: "#0000", // Transparent background
        },
        toSJISFunc: QRCode.toSJIS,
      },
      function(error) {
        if (error) console.error(error);
        console.log("success!");
      }
    );
  };
  const exportToPdf = () => {
    var name = "Billet.pdf";
    domtoimage
      .toJpeg(document.getElementById("published-wrapper-block"), {
        quality: 1,
        style: {},
        // filter: function filter(node) {
        //   return (
        //     ["filterAddition", "bottom-contents"].indexOf(node.className) < 0
        //   );
        // },
      })
      .then(
        function(dataUrl) {
          var image = document.createElement("img");
          image.addEventListener("load", function() {
            var pdf = new jspdf("p", "pt", "a3");
            pdf.internal.pageSize.setWidth(image.width * 0.75);
            pdf.internal.pageSize.setHeight(image.height * 0.75);
            pdf.addImage(dataUrl, "JPG", 0, 0);
            pdf.save(name);
          });
          image.src = dataUrl;
        },
        (error) => {
          console.log({ error });
        }
      );
  };
  const isSelectedPurpose = (purpose) =>
    _.get(form, "purpose.purposeType") === purpose;

  function getConditionalCompnent() {
    switch (_.get(form, "purpose.purposeType")) {
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
                  className={
                    formErrors.price
                      ? `input-err price-selector `
                      : `price-selector `
                  }
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
              You may chose to collaborate ideas to make single.
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
                  {CONSTANTS.COLLAB_TYPE.map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      name="storageGroup"
                      className={`${form.collab == item.value ? "active" : ""}`}
                      onClick={(e) =>
                        setFormData({
                          ...form,
                          collab: item.value,
                          purpose: {
                            type: form.purpose.purposeType,
                            subType: item.value,
                            purposeType: form.purpose.purposeType,
                          },
                        })
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
                    className={
                      formErrors.price
                        ? `input-err price-selector `
                        : `price-selector `
                    }
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
                    className={
                      formErrors.umits
                        ? `input-err umits-selector `
                        : `umits-selector `
                    }
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
              be visible to everyone.
            </span>
          </Col>
        );
    }
  }

  const gotoIdea = () => {
    history.push({
      pathname: "/signature/" + form.PDFHash,
    });
  };

  const gotoCreate = () => {
    history.push({
      pathname: "/create",
    });
  };

  const isDisabled = (action) => {
    return (
      [CONSTANTS.PURPOSES.AUCTION, CONSTANTS.PURPOSES.LICENSE].indexOf(action) >
      -1
    );
  };

  const handleCategoryChange = (ev) => {
    handleTagsChange(ev);
    switch (_.get(ev, "value")) {
      case "Creative_art":
        setImgHolder(artPlaceHolder);
        break;
      case "Technical_inventions":
        setImgHolder(technicalPlaceHolder);
        break;
      case "Business_idea":
        setImgHolder(businessPlaceHolder);
        break;
      default:
        break;
    }
  };

  const nth = function(d) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const timeFormatted = (time) => {
    return (
      "on " +
      time.getDate() +
      nth(time.getDate()) +
      " " +
      months[time.getMonth()] +
      " " +
      time.getFullYear() +
      " " +
      (time.getHours() > 12 ? time.getHours() - 12 : time.getHours()) +
      ":" +
      time.getMinutes() +
      (time.getHours() > 12 ? "PM" : "AM")
      + ""
      // getTimeZonsShort() || ""
    );
  };

  function getTimeZonsShort() {
    let result = "";
    try {
      // Chrome, Firefox
      result = new Date()
        .toTimeString()
        .match(new RegExp("[A-Z](?!.*[(])", "g"))
        .join("");
    } catch (e) {
      // IE, some loss in accuracy due to guessing at the abbreviation
      // Note: This regex adds a grouping around the open paren as a
      //       workaround for an IE regex parser bug
      result = /.*\s(.+)/.exec(
        new Date().toLocaleDateString(navigator.language, {
          timeZoneName: "short",
        })
      )[1];
      
    }
  }
  function openInEtherscan() {
    window.open("https://kovan.etherscan.io/tx/" + billet.transactionID);
  }

  const getElement = () => {
    let pusposeList = [
      CONSTANTS.PURPOSES.SELL,
      CONSTANTS.PURPOSES.AUCTION,
      CONSTANTS.PURPOSES.LICENSE,
      CONSTANTS.PURPOSES.COLLAB,
      CONSTANTS.PURPOSES.KEEP,
    ];
    switch (publishState) {
      case "PASSED":
        return (
          <div className="passed-section">
            <Row className="m-0">
              <Col
                md="12"
                id="published-wrapper-block"
                className="published-wrapper p-0 d-flex flex-row justify-content-start"
              >
                <div className="left-strip"> </div>
                <Col
                  md="8"
                  className="center-strip d-flex flex-column justify-content-around"
                >
                  <Row className="row1">
                    <Col md="12">
                      <div className="billet-item">
                        <div className="user second-grey">@{billet.creator}</div>
                        {/* <div className="name">{billet.fullName}</div> */}
                        <div className="link">
                          ideaTribe.com | Your ideas on blockchain{" "}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <div className="code-n-share">
                      <Col md="12">
                        <canvas id="canvas"></canvas>
                        {setTimeout(() => {
                          getQrcode();
                        })}
                      </Col>
                    </div>
                  </Row>
                  <Row className="row2 justify-content-center row">
                    <Col md="12" className="justify-content-center row">
                      <div className="billet-item justify-content-center">
                        <div className="item">{billet.title}</div>
                        <br></br>
                        <div className="time">
                          {" "}
                          {timeFormatted(billet.time)}
                        </div>
                      </div>
                    </Col>
                    <Col md="12"></Col>
                  </Row>
                  <Row className="row3 mt-3">
                    <Col md="12">
                      <div className="billet-item">
                        <div className="trasnection-details">
                          <div className="transaction-head">
                            TRANSACTION ID:
                          </div>
                          <span className="hashValue">
                            {billet.transactionID}
                          </span>
                        </div>
                        <div className="trasnection-details">
                          <div className="transaction-head">FILE HASH:</div>
                          <span className="hashValue">{billet.PDFHash}</span>
                        </div>
                        <div className="trasnection-details">
                          <div className="transaction-head">TOKEN ID:</div>
                          <span className="hashValue">{billet.tokenID}</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col
                  md="4"
                  className="right-strip   d-flex flex-column justify-content-around"
                  style={{ background: `url(${cover})` }}
                >
                  <div className="brand text-center">
                    <Col
                      md="12"
                      className="p-0 justify-content-center billet-item-head"
                    >
                      BILLET
                    </Col>
                    <Col md="12" className="p-0">
                      <img src={signatureImage} alt="logo" width="150px" />
                    </Col>
                    <Col
                      md="12"
                      className="p-0 justify-content-center billet-item-text"
                    >
                      IdeaTribe.io
                    </Col>
                  </div>
                </Col>
              </Col>
            </Row>
            <Row className="button-section  d-flex">
              <Col xs="10" className="button-bar justify-content-start">
                  <Crosshair
                    className="cursor-pointer signature-icons mr-2"
                    color="#F39422"
                    onClick={() => {
                      openInEtherscan();
                    }}
                  ></Crosshair>
                  <Download
                    className="cursor-pointer signature-icons"
                    color="#F39422"
                    onClick={() => {
                      exportToPdf();
                    }}
                  ></Download>
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-share">
                      <i className="fa fa-bullhorn"></i>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1"><reactShare.FacebookShareButton
                    url={
                      window.location.origin + "/signature/" + billet.PDFHash
                    }
                    quote={
                      "Hey! I registered an original idea on blockchain!"
                    }
                  >
                      <div className="social-icon-wrapper fb">
                    <i class="fa fa-facebook" aria-hidden="true"></i>
                  </div>
                    {/* <reactShare.FacebookIcon size={32} round /> */}
                  </reactShare.FacebookShareButton>
                  
                  </Dropdown.Item>
                      <Dropdown.Item href="#/action-2">
                      <reactShare.WhatsappShareButton
                    url={
                      window.location.origin + "/signature/" + billet.PDFHash
                    }
                    title={
                      "Hey! I registered an original idea on blockchain!"
                    }
                    separator=" "
                  >
                      <div className="social-icon-wrapper whatsapp">
                  <i class="fa fa-whatsapp" aria-hidden="true"></i>
                  </div>
                    {/* <reactShare.WhatsappIcon size={32} round /> */}
                  </reactShare.WhatsappShareButton>
                  </Dropdown.Item>
                      <Dropdown.Item href="#/action-3">
                      <reactShare.LinkedinShareButton
                    url={
                      window.location.origin + "/signature/" + billet.PDFHash
                    }
                  >
                      <div className="social-icon-wrapper linkedin">
                <i class="fa fa-linkedin" aria-hidden="true"></i>
                  </div>
                    {/* <reactShare.LinkedinIcon size={32} round /> */}
                  </reactShare.LinkedinShareButton>
                  </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  
              </Col>
              <Col xs="2" className="button-bar done-btn">
                {!closeBtn && <Button className="submit-btn btn-ternary" onClick={gotoIdea}>
                  Done
                </Button>}
                {closeBtn && <Button className="submit-btn btn-ternary" onClick={closeBtn}>
                  Close
                </Button>}
              </Col>
            </Row>
          </div>
        );
      case "FAILED":
        return (
          <div className="failed-section">
            <Row className="m-0">
              <Col
                md="12"
                sm="12"
                lg="12"
                xs="12"
                className="failed-wrapper"
                id="failed-wrapper-block"
              >
                <div className="success-block">
                  <p>Failed to publish your Idea</p>
                  <p>
                    Your publish failed with the following error -{" "}
                    {publishError}
                  </p>
                </div>
              </Col>
            </Row>
            <Row className="button-section  d-flex">
              <Col xs="12" className="button-bar">
                <Button
                  className="submit-btn"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Retry
                </Button>
              </Col>
            </Row>
          </div>
        );
      case "PROGRESS":
        return (
          <div className="loading-section">
            <Row className="m-0">
              <Col
                md="12"
                sm="12"
                lg="12"
                xs="12"
                className="publishing-wrapper d-flex flex-column justify-content-center"
              >
                <div className="words">
                  {!metaMastConfirmed && (
                    <span className="word">
                      Preparing to post your Idea to Blockchain
                    </span>
                  )}
                  {!metaMastConfirmed && (
                    <span className="word">
                      Connecting with Metamask to sign your transaction{" "}
                    </span>
                  )}
                  {!metaMastConfirmed && (
                    <span className="word">
                      Preparing to post your Idea to Blockchain
                    </span>
                  )}
                  {!metaMastConfirmed && (
                    <span className="word">
                      Connecting with Metamask to sign your transaction{" "}
                    </span>
                  )}
                  {metaMastConfirmed && (
                    <span className="word">Sending your transaction to the Pool</span>
                  )}
                  {metaMastConfirmed && (
                    <span className="word">Waiting for blocks to be mined</span>
                  )}
                  {metaMastConfirmed && (
                    <span className="word">
                      Waiting for your transaction to be included in the block
                    </span>
                  )}
                  {metaMastConfirmed && (
                    <span className="word">
                      Waiting for transaction receipt
                    </span>
                  )}
                </div>
                {/* <div className="gif-wrapper d-flex justify-content-center">
                  <img src={loadingGif} alt="" />
                </div> */}
                {/* <div className="publishing-block-text second-grey">
                  <p>
                    We are posting your idea on the Blockchain. Hold on tight!
                  </p>
                </div> */}
              </Col>
            </Row>
          </div>
        );
      default:
        return (
          <>
            <Row>
              <Col md="12" lg="12" sm="12" xs="12">
                <Form.Group as={Col} className="formEntry" md="12">
                  <div className="tags-label master-grey">
                    <Form.Label>Category </Form.Label>
                  </div>
                  <Select
                    value={form.category}
                    className={
                      formErrors.category
                        ? "input-err tag-selector"
                        : "tag-selector"
                    }
                    options={CONSTANTS.CATEGORIES}
                    onChange={(e) => handleCategoryChange(e)}
                    placeholder=""
                  />
                </Form.Group>
              </Col>
              {/* <Col md="6" lg="6" sm="6" xs="6">
                <Form.Group as={Col} className="formEntry" md="12">
                  <div className="tags-label master-grey">
                    <Form.Label>Clan </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          The clan will be the owner of the idea
                        </Tooltip>
                      }
                    >
                      <i className="fa fa-info" aria-hidden="true"></i>
                    </OverlayTrigger>
                  </div>
                  <Select
                    value={form.category}
                    closeMenuOnSelect={false}
                    className={
                      formErrors.category
                        ? "input-err tag-selector"
                        : "tag-selector"
                    }
                    options={userClans}
                    onChange={handleTagsChange}
                    placeholder=""
                  />
                </Form.Group>
              </Col> */}
              {/* <Col md="12" lg="12" sm="12" xs="12">
                <Form.Group
                  as={Col}
                  className="file-storage-group"
                  md="12"
                  controlId="fileStorage"
                >
                  <div className="file-storage-label master-grey">
                    <Form.Label>File Storage </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          Choose file storage type
                        </Tooltip>
                      }
                    >
                      <i className="fa fa-info" aria-hidden="true"></i>
                    </OverlayTrigger>
                  </div>
                  <Dropdown className="w-100">
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-basic"
                      className="w-100 justify-content-start selected-storage"
                    >
                      {form.storage}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {CONSTANTS.STORAGE_TYPE.map((item) => (
                        <Dropdown.Item
                          name="storageGroup"
                          onClick={() =>
                            setFormData({ ...form, storage: item.value })
                          }
                        >
                          {item.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </Col> */}
            </Row>

            <div className="purpose-selection">
              <Row className="purpose-selector-row">
                <Col md="12" className="">
                  <div className="purpose-label master-grey">
                    <Form.Label>
                      What would you like to do with the idea ?{" "}
                    </Form.Label>
                  </div>
                  <div className="purpose-tabs">
                    {pusposeList.map((entry, entryIndex) => {
                      return (
                        <div
                          key={entryIndex}
                          className={
                            isSelectedPurpose(entry)
                              ? "purpose-entry selected"
                              : isDisabled(entry)
                              ? "purpose-entry disabled"
                              : "purpose-entry"
                          }
                          onClick={() => {
                            !isDisabled(entry) && setPurpose(entry);
                          }}
                        >
                          <i className={getPurposeIcon(entry)}></i>
                          <span className="second-grey purpose-text">
                            {entry}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="selective-component">
              <div>{getConditionalCompnent()}</div>
            </div>
            <Row className="button-section  d-flex">
              <Col xs="12" className="button-bar">
                <Button
                  className="cancel-btn"
                  onClick={() => {
                    history.push(`/home`);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="submit-btn"
                  onClick={checkValidationBeforeSubmit}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </>
        );
    }
  };
  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="lg"
      className="create-idea-modal"
      dialogClassName="create-idea-modal-dialog"
      centered
      backdrop="static"
    >
      <Modal.Body className="create-idea-modal-body">
        {publishState != "PASSED" && (
          <div className="modal-header-wrapper">
            <div className="image-placeholder">{getThumbnailImage()}</div>
          </div>
        )}
        <div className="wrapper">{getElement()}</div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateIdeaModal;
