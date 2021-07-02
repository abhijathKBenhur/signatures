import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import StorageInterface from "../../interface/StorageInterface";
import Dropzone, { useDropzone } from "react-dropzone";
import CONSTANTS from "../../commons/Constants";
import { useHistory } from "react-router-dom";
import "./Create.scss";
import { X, Image as ImageFile, Info, UploadCloud, Check } from "react-feather";
import Hash from "ipfs-only-hash";
import { Container } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import Select from "react-select";

import "react-step-progress-bar/styles.css";
import { shallowEqual, useSelector } from "react-redux";
import user from "../../../assets/images/user.png";
import audio from "../../../assets/images/audio.png";
import loadingGif from "../../../assets/images/loader_blocks.gif";
import jspdf from "jspdf";
import domtoimage from "dom-to-image";
import moment from "moment";
import { showToaster } from "../../commons/common.utils";
import QRCode from "qrcode";

import responseImage from "../../../assets/images/response.jpeg";
import signatureImage from "../../../assets/logo/signatures.png";

function Create(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const PASSED = "PASSED",
    FAILED = "FAILED",
    PROGRESS = "PROGRESS",
    INIT = "INIT";
  const TITLE_SLIDE = 0,
    THUMBNAIL_SLIDE = 1,
    PREVIEW_SLIDE = 2,
    LOADING_SLIDE = 3,
    RESPONSE_SLIDE = 4;
  const { metamaskID = undefined, userDetails = {} } = reduxState;
  const [form, setFormData] = useState({
    owner: metamaskID,
    creator: metamaskID,
    title: "",
    category: [],
    description: "",
    price: 0,
    thumbnail: undefined,
    PDFFile: undefined,
    PDFHash: undefined,
    ideaID: undefined,
    transactionID: undefined,
    purpose: CONSTANTS.PURPOSES.SELL,
    storage: CONSTANTS.STORAGE_TYPE[0].value,
  });
  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    pdf: false,
    category: false,
    price: false,
    thumbnail: false,
    maxFileError: false,
    publish: "",
  });

  const [slideCount, setSlideCount] = useState(0);
  const [billet, setBillet] = useState({
    creator: form.owner,
    fullName: userDetails.fullName,
    title: form.title,
    time: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"),
    // tokenID: billet.tokenID,
    // transactionID: billet.tokenID,
    // PDFHash: billet.PDFHash,
  });

  const [publishState, setPublishState] = useState(INIT);
  const [publishError, setPublishError] = useState(undefined);
  const priceRef = useRef(null);
  let history = useHistory();
  const [fileData, setFileData] = useState({
    fileType: "",
    fileData: undefined,
  });
  const getQrcode = () => {
    QRCode.toCanvas(
      document.getElementById("canvas"),
      "https://kovan.etherscan.io/address/" +
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

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setFormData({
        ...form,
        owner: metamaskID,
      });
    }
    if (!_.isEmpty(form.owner)) {
      if (!_.isEmpty(form.category)) {
        setFormErrors({ ...formErrors, category: false });
      } else {
        setFormErrors({ ...formErrors, category: true });
      }
    }
  }, [form.category]);

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setFormData({
        ...form,
        owner: metamaskID,
      });
    }
  }, [reduxState]);

  useEffect(() => {
    if (priceRef.current) {
      if (checkDisablePrice()) {
        priceRef.current.disabled = true;
        priceRef.current.style.backgroundColor = "#565656";
      } else {
        priceRef.current.disabled = false;
        priceRef.current.style.backgroundColor = "";
      }
    }
  }, [form.purpose]);
  function onImageDrop(acceptedFiles) {
    setFormData({
      ...form,
      thumbnail: Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      }),
    });
  }

  function clearPDF() {
    setFormData({
      ...form,
      PDFFile: undefined,
    });
  }

  function clearImage() {
    setFormData({
      ...form,
      thumbnail: undefined,
    });
  }

  function onPDFDrop(acceptedFiles) {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(acceptedFiles[0]);
    reader.onloadend = () => {
      Hash.of(Buffer(reader.result)).then((PDFHashValue) => {
        // Check for already existing PDF Hashes
        setFormData({
          ...form,
          PDFFile: acceptedFiles[0],
          PDFHash: PDFHashValue,
        });
      });
    };
  }

  function PDFLoadError(error) {}
  function onDocumentLoadSuccess(success) {}

  function handleTagsChange(tags) {
    setFormData({
      ...form,
      category: tags,
    });
  }

  function handleChange(event) {
    let returnObj = {};
    returnObj[event.target.name] =
      _.get(event, "target.name") === "price"
        ? Number(event.target.value)
        : event.target.value;
    setFormErrors({
      ...formErrors,
      [event.target.name]:
        _.get(event, "target.name") === "price"
          ? event.target.value <= 0
          : _.isEmpty(event.target.value),
    });
    setFormData({ ...form, ...returnObj });
  }

  // function updateIdeaIDToMongo(payload) {
  //   MongoDBInterface.updateIdeaID(payload)
  //     .then((success) => {
  //       setPublishState(PASSED)
  //
  //       toast.dark("Your thoughts are live on blockchain.", {
  //         position: "bottom-right",
  //         autoClose: 3000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //       setBillet({
  //         transactionID: success.transactionID,
  //         account: success.account,
  //         PDFHash: success.PDFHash,
  //       });
  //     })
  //     .catch((err) => {
  //       setPublishState(FAILED)
  //       console.log(err);
  //     });
  // }

  function saveToMongo(form) {
    MongoDBInterface.addSignature(form)
      .then((success) => {
        showToaster("Your thoughts have been submitted!", { type: "dark" });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function saveToBlockChain(form) {
    // BlockChainInterface.publishIdea(form, saveToMongo, updateIdeaIDToMongo);
    setPublishState(PROGRESS);
    BlockChainInterface.publishOnBehalf(form)
      .then((success) => {
        debugger;
        let response = _.get(success, "data.data");
        saveToMongo(response);
        setBillet({
          creator: userDetails.userID,
          fullName: userDetails.fullName,
          title: response.title,
          time: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"),
          tokenID: response.ideaID,
          transactionID: response.transactionID,
          PDFHash: response.PDFHash,
        });
        setPublishState(PASSED);
        setSlideCount(RESPONSE_SLIDE);
      })
      .catch((error) => {
        setPublishState(FAILED);
        setSlideCount(RESPONSE_SLIDE);
        setPublishError(_.get(error, "data.data.errorreason"));
        setPublishError(
          "The idea couldnt be published to blockchain. Please try again later."
        );
      });
  }

  function handleSubmit() {
    const params = _.clone({ ...form });
    params.category = JSON.stringify(params.category);
    params.creator = metamaskID;
    params.IPFS = true;
    params.fileType = fileData.fileType;
    params.price =
      typeof params.price === "number"
        ? JSON.stringify(params.price)
        : params.price;
    params.fileType = fileData.fileType;
    params.userID = reduxState.userDetails.userID;
    setPublishState(PROGRESS);
    setSlideCount(LOADING_SLIDE);
    StorageInterface.getFilePaths(params)
      .then((success) => {
        params.PDFFile = _.get(_.find(success, { type: "PDFFile" }), "path");
        params.thumbnail = _.get(
          _.find(_.map(success, "data"), { type: "thumbnail" }),
          "path"
        );
        saveToBlockChain(params);
      })
      .catch((error) => {
        return {
          PDFFile: "error",
          thumbnail: "error",
        };
      });
  }

  const checkValidationOnButtonClick = (page) => {
    const { title, description, PDFFile, category, price, thumbnail } = form;
    switch (page) {
      case TITLE_SLIDE:
        if (_.isEmpty(title) || _.isEmpty(description) || _.isEmpty(PDFFile)) {
          setFormErrors({
            ...formErrors,
            title: _.isEmpty(title),
            description: _.isEmpty(description),
            pdf: _.isEmpty(PDFFile),
          });
        } else {
          setSlideCount(THUMBNAIL_SLIDE);
          setFormErrors({
            ...formErrors,
            title: false,
            description: false,
            pdf: false,
          });
        }

        break;
      case THUMBNAIL_SLIDE:
        if (_.isEmpty(category) || _.isEmpty(thumbnail)) {
          if (!checkDisablePrice()) {
            setFormErrors({
              ...formErrors,
              price: price <= 0,
              category: _.isEmpty(category),
              thumbnail: _.isEmpty(thumbnail),
            });
          } else {
            setFormErrors({
              ...formErrors,
              price: false,
              category: _.isEmpty(category),
              thumbnail: _.isEmpty(thumbnail),
            });
          }
        } else {
          setSlideCount(PREVIEW_SLIDE);
        }
        break;
      case PREVIEW_SLIDE:
        handleSubmit();
        setFormErrors({
          ...formErrors,
          price: false,
          category: false,
          thumbnail: false,
        });
        break;
      default:
        break;
    }
  };

  const onDrop = (acceptedFiles) => {
    if (checkMaxFileSize(_.get(acceptedFiles, "[0]"))) {
      setFormErrors({ ...formErrors, maxFileError: true });
    } else {
      loadFile(acceptedFiles);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: ["image/png", "image/jpg", "image/jpeg", ".pdf", ".mp3"],
  });
  const getFileName = (filename) =>
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename;

  const loadFile = (file) => {
    const fr = new window.FileReader();
    fr.onloadend = (e) => {
      setFileData({
        ...fileData,
        fileType: String(getFileName(_.get(file, "[0].name"))).toLowerCase(),
        fileData: e.target.result,
      });
      setFormErrors({ ...formErrors, maxFileError: false });
      onPDFDrop(file);
    };
    fr.readAsDataURL(file[0]);
  };

  const getFileViewer = () => {
    switch (fileData.fileType) {
      case "pdf":
        return (
          <Document
            fillWidth
            file={form.PDFFile}
            onLoadError={PDFLoadError}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page fillWidth pageNumber={1} width={window.innerWidth / 4} />
          </Document>
        );
      case "mp3":
        return (
          <div className="audio-wrapper">
            <img src={audio} alt="" className="mb-1" />
            <audio controls>
              <source src={fileData.fileData}></source>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "PNG":
        return (
          <img
            src={fileData.fileData}
            height={400}
            className="uploadedImage"
            style={{
              background: "#f1f1f1",
              borderRadius: "7px",
            }}
          />
        );

      default:
        return null;
    }
  };

  function setPurpose(purpose) {
    setFormData({ ...form, purpose });
  }

  const isSelectedPurpose = (purpose) => form.purpose === purpose;
  const checkMaxFileSize = (file) => {
    try {
      const size = Math.floor(file.size / 1000000);
      return size > 5 ? true : false;
    } catch (err) {
      console.log("err = ", err);
      return false;
    }
  };

  const checkDisablePrice = () => {
    if (
      CONSTANTS.PURPOSES.COLLAB === form.purpose ||
      CONSTANTS.PURPOSES.KEEP === form.purpose
    ) {
      setFormData({ ...form, price: 0 });
      return true;
    }
    return false;
  };

  const getViewBasedOnSteps = () => {
    switch (slideCount) {
      case TITLE_SLIDE:
        return (
          <>
            <Col md="6" sm="12" lg="6" xs="12" className="title-n-desc pb-0">
              <Row className="">
                <Form.Group
                  as={Col}
                  className="formEntry"
                  md="12"
                  controlId="title"
                >
                  <div className="title-label">
                    <Form.Label>Title </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    className={
                      formErrors.title ? "input-err titleArea" : "titleArea"
                    }
                    placeholder="Title*"
                    onChange={handleChange}
                  />
                </Form.Group>
              </Row>
              <Row className="form-row">
                <Form.Group
                  as={Col}
                  className="formEntry"
                  md="12"
                  controlId="description"
                >
                  <div className="description-label">
                    <Form.Label>Description </Form.Label>
                  </div>
                  <InputGroup>
                    <Form.Control
                      value={form.description}
                      className={
                        formErrors.description
                          ? "input-err descriptionArea"
                          : "descriptionArea"
                      }
                      as="textarea"
                      rows={7}
                      aria-describedby="inputGroupAppend"
                      name="description"
                      placeholder="Description (Upto 250 charecters)"
                      style={{ resize: "none" }}
                      onChange={handleChange}
                      maxLength={250}
                    />
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row className="form-row">
                <Form.Group
                  as={Col}
                  className="file-storage-group"
                  md="12"
                  controlId="fileStorage"
                >
                  <div className="file-storage-label">
                    <Form.Label>File Storage </Form.Label>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          Choose file storage type
                        </Tooltip>
                      }
                    >
                      <Info />
                    </OverlayTrigger>
                  </div>
                  {CONSTANTS.STORAGE_TYPE.map((item) => (
                    <Form.Check
                      id={item.value}
                      name="storageGroup"
                      type="radio"
                      value={form.storage}
                      checked={form.storage === item.value}
                      onChange={() =>
                        setFormData({ ...form, storage: item.value })
                      }
                      disabled
                      label={item.label}
                    />
                  ))}
                  {/* <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="color"
                    defaultValue={{value: form.storage, label: form.storage}}
                    options={CONSTANTS.STORAGE_TYPE}
                  /> */}
                </Form.Group>
              </Row>
            </Col>

            <Col md="6" sm="12" lg="6" xs="12" className="pdf-container">
              {form.PDFFile && !formErrors.maxFileError && (
                <div className="pdfUploaded w-100 h-100">
                  <X
                    className="removePDF cursor-pointer"
                    onClick={() => {
                      clearPDF();
                    }}
                  ></X>
                  {fileData.fileData && getFileViewer()}
                </div>
              )}
              {!form.PDFFile && (
                <Form.Row className="empty-pdf-row">
                  <div className="file-drop-contatiner" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <UploadCloud />
                    <p>Drag 'n Drop or Upload the file containing your idea</p>
                    <p>(Upload pdf / mp3 / image)</p>
                    <div>{/* <Plus /> */}</div>
                    {formErrors.pdf && (
                      <p className="invalid-paragraph"> File is required </p>
                    )}
                    {formErrors.maxFileError && (
                      <p className="invalid-paragraph">
                        {" "}
                        Max file size is 5MB{" "}
                      </p>
                    )}
                  </div>
                </Form.Row>
              )}
            </Col>
          </>
        );
      case THUMBNAIL_SLIDE:
        return (
          <>
            <Col md="6" sm="12" lg="6" xs="12" className="price-n-category">
              <Row className="">
                <Form.Group as={Col} className="formEntry" md="12">
                  <div className="tags-label">
                    <Form.Label>Tags </Form.Label>
                  </div>
                  <Select
                    value={form.category}
                    closeMenuOnSelect={true}
                    isMulti
                    className={
                      formErrors.category
                        ? "input-err tag-selector"
                        : "tag-selector"
                    }
                    options={CONSTANTS.CATEGORIES}
                    onChange={handleTagsChange}
                    placeholder="Tags*"
                  />
                </Form.Group>
              </Row>
              <Row className="purpose-selector-row">
                <Col md="12" className="p-0">
                  <div className="purpose-label">
                    <Form.Label>
                      What would you like to do with the idea ?{" "}
                    </Form.Label>
                  </div>
                  <Row>
                    <Col md="6">
                      <Button
                        variant="outline-primary"
                        className="purpose-button"
                        onClick={() => {
                          setPurpose(CONSTANTS.PURPOSES.AUCTION);
                        }}
                      >
                        {isSelectedPurpose(CONSTANTS.PURPOSES.AUCTION) && (
                          <Check />
                        )}
                        Auction
                      </Button>
                    </Col>
                    <Col md="6">
                      <Button
                        variant="outline-primary"
                        className="purpose-button"
                        onClick={() => {
                          setPurpose(CONSTANTS.PURPOSES.SELL);
                        }}
                      >
                        {isSelectedPurpose(CONSTANTS.PURPOSES.SELL) && (
                          <Check />
                        )}
                        Sell
                      </Button>
                    </Col>
                    <Col md="6">
                      <Button
                        variant="outline-primary"
                        className="purpose-button"
                        onClick={() => {
                          setPurpose(CONSTANTS.PURPOSES.COLLAB);
                        }}
                      >
                        {isSelectedPurpose(CONSTANTS.PURPOSES.COLLAB) && (
                          <Check />
                        )}
                        Collab
                      </Button>
                    </Col>
                    <Col md="6">
                      <Button
                        variant="outline-primary"
                        className="purpose-button"
                        onClick={() => {
                          setPurpose(CONSTANTS.PURPOSES.KEEP);
                        }}
                      >
                        {isSelectedPurpose(CONSTANTS.PURPOSES.KEEP) && (
                          <Check />
                        )}
                        Keep
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="">
                <Form.Group as={Col} className="formEntry" md="12">
                  <div className="price-label">
                    <Form.Label>
                      {CONSTANTS.PURPOSES.AUCTION === form.purpose
                        ? "Base price"
                        : "Price"}
                    </Form.Label>
                  </div>
                  <InputGroup className="price-input-group">
                    <Form.Control
                      type="number"
                      placeholder="how much do you think your idea is worth ?*"
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
                </Form.Group>
              </Row>
            </Col>
            <Col md="6" sm="12" lg="6" xs="12" className="image-container p-0">
              {form.thumbnail && (
                <div className="imageUploaded w-100 h-100">
                  <X
                    className="removeImage cursor-pointer"
                    onClick={() => {
                      clearImage();
                    }}
                  ></X>
                  <img
                    src={form.thumbnail.preview}
                    height={400}
                    className="uploadedImage"
                    style={{
                      background: "#f1f1f1",
                      borderRadius: "7px",
                    }}
                  ></img>
                </div>
              )}
              {!form.thumbnail && (
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
                          <ImageFile
                            size={30}
                            className="dropfile-icon"
                            color="#fff"
                          ></ImageFile>
                          <p className="m-0 dropfile-text">
                            Drop your thumbnail here
                          </p>

                          {formErrors.thumbnail && (
                            <p className="invalid-paragraph">
                              {" "}
                              Thumbnail is required{" "}
                            </p>
                          )}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Form.Row>
              )}
            </Col>
          </>
        );
      case PREVIEW_SLIDE:
        return (
          <>
            <Col md="12" sm="12" lg="6" xs="12" className="preview-doc ">
              <Row className="form-row">
                <Col md="12" sm="12" lg="12" xs="12" className="pdf-container">
                  {form.PDFFile && (
                    <div className="pdfUploaded w-100 h-100">
                      {fileData.fileData && getFileViewer()}
                    </div>
                  )}
                </Col>
                <Col
                  md="12"
                  sm="12"
                  lg="12"
                  xs="12"
                  className="description-container"
                >
                  <p>{form.title}</p>
                  <p>{form.description}</p>
                </Col>
              </Row>
            </Col>
            <Col md="12" sm="12" lg="6" xs="12" className="preview-details ">
              <div className="content-profile">
                <img
                  src={userDetails.imageUrl ? userDetails.imageUrl : user}
                  alt=""
                />
                <p>{userDetails.userID}</p>
              </div>
              <div className="description">
                <Row>
                  <Col md="12" className="message">
                  Your idea will now be immortalized in a blockchain. And you will forever be known as it's creator. Welcome to the Tribe!
                  </Col>
                </Row>
                <div className="gas-fee-block">
                  <div className="gas_fee">
                    <p>Binance Chain Gas Fees : </p>
                  </div>
                  <div className="gas_fee_value">
                    <p>2$ </p>
                  </div>
                  <div className="gas_free">
                    <p> This is on us for your first 5 Ideas. </p>
                  </div>
                </div>
                <div className="service_fee_block">
                  <div className="serice_fee">
                    <p> IdeaTribe Service Fee: </p>
                  </div>
                  <div className="serice_fee_value">
                    <p> 2$ </p>
                  </div>
                  <div className="serice_free">
                    <p> FREE for early Tribers!</p>
                  </div>
                </div>
                <p></p>
              </div>
            </Col>
          </>
        );
        break;
      case LOADING_SLIDE:
        return (
          <Col md="12" sm="12" lg="12" xs="12" className="publishing-wrapper d-flex flex-column justify-content-center">
            

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
        );
        break;
      case RESPONSE_SLIDE:
        return publishState == FAILED ? (
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
                Your publish failed with the following error - {publishError}
              </p>
            </div>
          </Col>
        ) : (
          publishState == PASSED && (
            <Col
              md="12"
              id="published-wrapper-block"
              className="published-wrapper p-0 d-flex flex-row justify-content-space-around"
            >
              <div className="left-strip"> </div>
              <Col
                md="9"
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
                      <div className="time">at {billet.time}</div>
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
                        <span className="hashValue">
                        {billet.PDFHash}
                        </span>
                      </div>
                      <div className="trasnection-details">
                        <div>TOKEN ID:</div>
                        <span className="hashValue">{billet.tokenID}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md="3" className="right-strip   d-flex flex-column justify-content-around">
                <div className="brand">
                  <Col md="12"className="p-0">BILLET</Col>
                  <Col md="12" className="p-0">
                    <img
                      src={signatureImage}
                      alt="logo"
                      width="100%"
                    />
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
            </Col>
          )
        );
      default:
        return null;
    }
  };

  const exportToPdf = () => {
    var name = "trasnaction.pdf";

    domtoimage
      .toJpeg(document.getElementById("published-wrapper-block"), {
        quality: 0.95,
        style: {
          "background-color": "#000",
          padding: "20px",
        },
        filter: function filter(node) {
          return (
            ["filterAddition", "bottom-contents"].indexOf(node.className) < 0
          );
        },
      })
      .then(
        function(dataUrl) {
          var image = document.createElement("img");
          image.addEventListener("load", function() {
            var pdf = new jspdf("p", "pt", "a3");
            pdf.internal.pageSize.setWidth(image.width * 0.75);
            pdf.internal.pageSize.setHeight(image.height * 0.75);
            pdf.addImage(dataUrl, "JPG", 0, -80);
            pdf.save(name);
          });
          image.src = dataUrl;
        },
        (error) => {
          console.log({ error });
        }
      );
  };

  return (
    <Container>
      <Row className="createform  d-flex">
        <Col md="12" sm="12" lg="12" xs="12" className="responsive-content">
          <Form
            noValidate
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="create-form"
          >
            <Col md="12" className="overflow-auto h-100 p-0">
              <Row
                className={
                  publishState == PASSED
                    ? "content-container h-100"
                    : "content-container"
                }
              >
                {getViewBasedOnSteps()}
              </Row>
              {publishState == INIT && (
                <Row className="footer-class ">
                  <Col
                    md="6"
                    className="d-flex justify-content-between align-items-center left-btn-container"
                  >
                    {slideCount >= LOADING_SLIDE ? (
                      <div></div>
                    ) : (
                      <Button
                        variant="ternary"
                        className="button"
                        bsstyle="primary"
                        onClick={() => {
                          onBack();
                        }}
                      >
                        {getBackButtonText()}
                      </Button>
                    )}
                  </Col>
                  <Col
                    md="6"
                    className="d-flex justify-content-end align-items-center right-btn-container"
                  >
                    <Button
                      variant="fourth"
                      className="button"
                      bsstyle="primary"
                      style={{ gap: "2px" }}
                      onClick={() => {
                        onNext();
                      }}
                    >
                      {getNextButtonText()} {"  "}
                    </Button>
                  </Col>
                </Row>
              )}
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );

  function getNextButtonText() {
    if (slideCount == PREVIEW_SLIDE) {
      return "Publish";
    } else if (slideCount == TITLE_SLIDE) {
      return "Next";
    } else if (slideCount == THUMBNAIL_SLIDE) {
      return "Preview";
    }
  }

  function getBackButtonText() {
    if (slideCount === TITLE_SLIDE) {
      return "Cancel";
    } else if (slideCount <= PREVIEW_SLIDE) {
      return "Back";
    } else {
      return "";
    }
  }

  function onNext() {
    if (slideCount === RESPONSE_SLIDE) {
      gotoGallery();
    } else {
      checkValidationOnButtonClick(slideCount);
    }
  }

  function onBack() {
    if (slideCount === 0) {
      gotoGallery();
    } else {
      setSlideCount(slideCount - 1);
    }
  }

  function gotoGallery() {
    history.push("/home");
  }
  function gotoProfile() {
    history.push("/profile");
  }
}

export default Create;
