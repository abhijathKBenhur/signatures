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
} from "react-bootstrap";
import React from "react";
import Dropzone from "react-dropzone";
import imagePlaceholder from "../../../assets/images/image-placeholder.png";
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
  ...props
}) => {
  const getThumbnailImage = () => {
    return form.thumbnail ? (
      <div className="imageUploaded w-100 h-100">
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

        <img
          src={form.thumbnail.preview}
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
                  src={imagePlaceholder}
                  className="placeholder-image"
                  alt=" placehoder"
                />
                <p className="dropfile-text">Drop your thumbnail here</p>

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
  function openInEtherscan() {
    window.open("https://kovan.etherscan.io/tx/" + billet.transactionID);
  }
  const getQrcode = () => {
    QRCode.toCanvas(
      document.getElementById("canvas"),
      "https://kovan.etherscan.io/address/" + _.get(billet, "transactionID"),
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
  const isSelectedPurpose = (purpose) => form.purpose === purpose;

  function getPurposeIcon(item) {
    if (item == CONSTANTS.PURPOSES.SELL) {
      return "fa fa-usd purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.AUCTION) {
      return "fa fa-gavel purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.COLLAB) {
      return "fa fa-handshake-o purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.KEEP) {
      return "fa fa-floppy-o purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.LICENCE) {
      return "fa fa-id-card-o purpose-icon second-grey";
    }
  }

  function getConditionalCompnent() {
    switch (form.purpose) {
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
                <InputGroup.Text>BNB</InputGroup.Text>
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
              be visible for everyone.
            </span>
          </Col>
        );
    }
  }

  const getElement = () => {
    let pusposeList = [
      CONSTANTS.PURPOSES.SELL,
      CONSTANTS.PURPOSES.AUCTION,
      CONSTANTS.PURPOSES.LICENCE,
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
                className="published-wrapper p-0 d-flex flex-row justify-content-space-around"
              >
                <div className="left-strip"> </div>
                <Col
                  md="8"
                  className="center-strip d-flex flex-column justify-content-around"
                >
                  <Row className="row1">
                    <Col md="12">
                      <div className="billet-item">
                        <div className="user">@{billet.creator}</div>
                        <div className="name">{billet.fullName}</div>
                        <div>ideaTribe.com</div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="row2">
                    <Col md="12">
                      <div className="billet-item">
                        <div className="item">{billet.title}</div>
                        <div className="time"> {billet.time}, Bangalore</div>
                      </div>
                    </Col>
                    <Col md="12"></Col>
                  </Row>
                  <Row className="row3">
                    <Col md="12">
                      <div className="billet-item">
                        <div className="trasnection-details">
                          <div>TRANSACTION ID:</div>
                          <span className="hashValue">
                            {billet.transactionID}
                          </span>
                        </div>
                        <div className="trasnection-details">
                          <div>FILE HASH:</div>
                          <span className="hashValue">{billet.PDFHash}</span>
                        </div>
                        <div className="trasnection-details">
                          <div>TOKEN ID:</div>
                          <span className="hashValue">{billet.tokenID}</span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col
                  md="3"
                  className="right-strip   d-flex flex-column justify-content-around"
                >
                  <div className="brand">
                    <Col md="12" className="p-0">
                      BILLET
                    </Col>
                    <Col md="12" className="p-0">
                      <img src={signatureImage} alt="logo" width="150px" />
                    </Col>
                  </div>
                  <div class="code-n-share">
                    <Col md="12">
                      <canvas id="canvas"></canvas>
                      {setTimeout(() => {
                        getQrcode();
                      })}
                    </Col>
                  </div>
                </Col>
                <Col md="1" className="actionables p-0 flex-column">
                  <div className="in-app-actions d-flex flex-column pt-3">
                    <Crosshair
                      className="cursor-pointer signature-icons"
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
                  </div>
                  <div className="sharables d-flex flex-column align-flex-start">
                    <reactShare.FacebookShareButton
                      url={
                        window.location.origin + "/signature/" + billet.PDFHash
                      }
                      quote={
                        "Hey! I registered an original idea on blockchain!"
                      }
                    >
                      <reactShare.FacebookIcon size={32} round />
                    </reactShare.FacebookShareButton>
                    <reactShare.WhatsappShareButton
                      url={
                        window.location.origin + "/signature/" + billet.PDFHash
                      }
                      title={
                        "Hey! I registered an original idea on blockchain!"
                      }
                      separator=" "
                    >
                      <reactShare.WhatsappIcon size={32} round />
                    </reactShare.WhatsappShareButton>
                    <reactShare.LinkedinShareButton
                      url={
                        window.location.origin + "/signature/" + billet.PDFHash
                      }
                    >
                      <reactShare.LinkedinIcon size={32} round />
                    </reactShare.LinkedinShareButton>
                  </div>
                </Col>
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
                <div className="gif-wrapper d-flex justify-content-center">
                  <img src={loadingGif} alt="" />
                </div>
                <div className="publishing-block-text">
                  <p>
                    We are posting your idea on the Binance Blockchain. Hold on
                    tight!
                  </p>
                </div>
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
                    <Form.Label>Tags </Form.Label>
                  </div>
                  <Select
                    value={form.category}
                    closeMenuOnSelect={false}
                    isMulti
                    className={
                      formErrors.category
                        ? "input-err tag-selector"
                        : "tag-selector"
                    }
                    options={CONSTANTS.CATEGORIES}
                    onChange={handleTagsChange}
                    placeholder=""
                  />
                </Form.Group>
              </Col>
              <Col md="12" lg="12" sm="12" xs="12">
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
              </Col>
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
              <div>
                {getConditionalCompnent()}
              </div>
            </div>
            <Row className="button-section  d-flex">
              <Col xs="12" className="button-bar">
                <Button className="cancel-btn">Cancel</Button>
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
    >
      <Modal.Body className="create-idea-modal-body">
        <div className="modal-header-wrapper">
          <div className="image-placeholder">{getThumbnailImage()}</div>
        </div>
        <div className="wrapper">{getElement()}</div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateIdeaModal;
