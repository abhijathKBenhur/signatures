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
import * as reactShare from "react-share";
import { useHistory } from "react-router-dom";
import "./Create-new.scss";
import {
  X,
  Image as ImageFile,
  Info,
  UploadCloud,
  Check,
  Share2,
  Download,
  Crosshair,
  ChevronLeft,
  ChevronRight,
} from "react-feather";
import Hash from "ipfs-only-hash";
import { Container } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import SocialShare from "../../modals/social-share/socialShare";
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
import imagePlaceholder from "../../../assets/images/image-placeholder.png";
import CreateIdeaModal from "../../modals/create-idea-modal/create-idea-modal";
const CreateNew = () => {
  const history = useHistory();
  const reduxState = useSelector((state) => state, shallowEqual);
  const [fileData, setFileData] = useState({
    fileType: "",
    fileData: undefined,
  });
  const PASSED = "PASSED",
    FAILED = "FAILED",
    PROGRESS = "PROGRESS",
    INIT = "INIT";
  const INTIAL_PAGE = 0,
    MODAL_DATA = 1;
  const { metamaskID = undefined, userDetails = {} } = reduxState;
  const audioRef = useRef(null);
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
  const priceRef = useRef(null);
  const [pdfPages, setPdfPages] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [publishState, setPublishState] = useState(INIT);
  const [publishError, setPublishError] = useState(undefined);
  const [audioState, setAudioState] = useState({
    isAudioPlaying: false,
  });
  const [modalShow, setModalShow] = useState(false);
  const [billet, setBillet] = useState({
    creator: form.owner,
    fullName: userDetails.fullName,
    title: form.title,
    time: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"),
    // tokenID: billet.tokenID,
    // transactionID: billet.tokenID,
    // PDFHash: billet.PDFHash,
  });

  const checkMaxFileSize = (file) => {
    try {
      const size = Math.floor(file.size / 1000000);
      return size > 5 ? true : false;
    } catch (err) {
      console.log("err = ", err);
      return false;
    }
  };

  const onDrop = (acceptedFiles) => {
    if (checkMaxFileSize(_.get(acceptedFiles, "[0]"))) {
      setFormErrors({ ...formErrors, maxFileError: true });
    } else {
      loadFile(acceptedFiles);
    }
  };
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

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () =>
        setAudioState({ ...audioState, isAudioPlaying: false })
      );
      audioRef.current.addEventListener("pause", () =>
        setAudioState({ ...audioState, isAudioPlaying: false })
      );
      audioRef.current.addEventListener("play", () =>
        setAudioState({ ...audioState, isAudioPlaying: true })
      );
    }
  }, [audioRef.current]);

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
        priceRef.current.style.backgroundColor = "#cdcdcd";
      } else {
        priceRef.current.disabled = false;
        priceRef.current.style.backgroundColor = "";
      }
    }
  }, [form.purpose]);
  const onImageDrop = (acceptedFiles) => {
    setFormData({
      ...form,
      thumbnail: Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      }),
    });
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

  const clearPDF = () => {
    setFormData({
      ...form,
      PDFFile: undefined,
    });
  };

  const clearImage = () => {
    setFormData({
      ...form,
      thumbnail: undefined,
    });
  };

  const playAudio = () => {
    audioRef.current.play();
    setAudioState({ ...audioState, isAudioPlaying: true });
  };

  const pauseAudio = () => {
    audioRef.current.pause();
    setAudioState({ ...audioState, isAudioPlaying: false });
  };

  const onPDFDrop = (acceptedFiles) => {
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
  };

  const PDFLoadError = (error) => {};
  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfPages({ ...pdfPages, totalPages: numPages });
  };

  const handleTagsChange = (tags) => {
    setFormData({
      ...form,
      category: tags,
    });
  };

  const check250Words = (value) => value.split(/[\s]+/).length > 250;

  const handleChange = (event) => {
    if (event.target.name === "description") {
      if (check250Words(event.target.value)) {
        return false;
      }
    }
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
  };

  const getFileViewer = () => {
    switch (fileData.fileType) {
      case "pdf":
        return (
          <>
            <Document
              fillWidth
              file={form.PDFFile}
              onLoadError={PDFLoadError}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page
                fillWidth
                pageNumber={pdfPages.currentPage}
                width={window.innerWidth / 4}
              />
            </Document>
            <p className="page-container">
              <ChevronLeft
                className={pdfPages.currentPage === 1 ? "disable" : ""}
                onClick={() =>
                  setPdfPages({
                    ...pdfPages,
                    currentPage: pdfPages.currentPage - 1,
                  })
                }
              />
              Page {pdfPages.currentPage} of {pdfPages.totalPages}
              <ChevronRight
                className={
                  pdfPages.currentPage === pdfPages.totalPages ? "disable" : ""
                }
                onClick={() =>
                  setPdfPages({
                    ...pdfPages,
                    currentPage: pdfPages.currentPage + 1,
                  })
                }
              />
            </p>
          </>
        );
      case "mp3":
        return (
          <div className="audio-wrapper">
            <div className="circle">
              <span className="circle__btn">
                {audioState.isAudioPlaying ? (
                  <i
                    className="fa fa-pause"
                    aria-hidden="true"
                    onClick={() => pauseAudio()}
                  ></i>
                ) : (
                  <i
                    className="fa fa-play"
                    aria-hidden="true"
                    onClick={() => playAudio()}
                  ></i>
                )}
              </span>
              <span className="circle__back-1"></span>
              <span className="circle__back-2"></span>
            </div>
            {/* <img src={audio} alt="" className="mb-1" /> */}
            <audio controls ref={audioRef}>
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
            alt="uploaded"
          />
        );

      default:
        return null;
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: ["image/png", "image/jpg", "image/jpeg", ".pdf", ".mp3"],
  });

  const checkUplloadedFile = () => {
    if (form.PDFFile && !formErrors.maxFileError) {
      return (
        <div className="pdfUploaded w-100 h-100">
          <OverlayTrigger placement="left" overlay={<Tooltip>Remove</Tooltip>}>
            <Button
              variant="outline-secondary"
              onClick={() => {
                clearPDF();
              }}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
          </OverlayTrigger>

          {fileData.fileData && getFileViewer()}
        </div>
      );
    }

    return (
      <div className="file-drop-contatiner" {...getRootProps()}>
        <input {...getInputProps()} />
        <i
          className="fa fa-cloud-upload mb-3 color-primary"
          style={{ fontSize: "50px" }}
        ></i>
        <p className="drag-drop-txt second-grey  color-secondary">
          Drag 'n Drop or Upload the file containing your idea or{" "}
          <span>Browse</span>
        </p>
        <p className="supported-type-txt second-grey color-secondary">
          (Upload pdf / mp3 / image)
        </p>
        <div>{/* <Plus /> */}</div>
        {formErrors.pdf && (
          <p className="invalid-paragraph"> File is required </p>
        )}
        {formErrors.maxFileError && (
          <p className="invalid-paragraph"> Max file size is 5MB </p>
        )}
      </div>
    );
  };

  const checkValidationOnButtonClick = () => {
    const { title, description, PDFFile, category, price, thumbnail } = form;
    if (_.isEmpty(title) || _.isEmpty(description) || _.isEmpty(PDFFile)) {
      setFormErrors({
        ...formErrors,
        title: _.isEmpty(title),
        description: _.isEmpty(description),
        pdf: _.isEmpty(PDFFile),
      });
    } else {
      setModalShow(true);
      setFormErrors({
        ...formErrors,
        title: false,
        description: false,
        pdf: false,
      });
    }
  };
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
    params.userName = reduxState.userDetails.userName;
    setPublishState(PROGRESS);
    // setSlideCount(LOADING_SLIDE);
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
  function saveToBlockChain(form) {
    // setPublishState(PROGRESS);
    BlockChainInterface.publishOnBehalf(form)
      .then((success) => {
        if (_.get(success, "data.success")) {
          let successResponse = _.get(success, "data.data");
          saveToMongo(successResponse);
          setBillet({
            creator: userDetails.userName,
            fullName: userDetails.fullName,
            title: successResponse.title,
            time: moment(new Date()).format("MMMM Do YYYY, h:mm:ss a"),
            tokenID: successResponse.ideaID,
            transactionID: successResponse.transactionID,
            PDFHash: successResponse.PDFHash,
          });
          setPublishState(PASSED);
          //   setSlideCount(RESPONSE_SLIDE);
        } else {
          let errorReason = _.get(success, "data.data.errorReason");
          setPublishState(FAILED);
          //   setSlideCount(RESPONSE_SLIDE);

          setPublishError(
            "The idea couldnt be published to blockchain. " + errorReason
          );
        }
      })
      .catch((error) => {
        setPublishState(FAILED);
        // setSlideCount(RESPONSE_SLIDE);
        setPublishError(_.get(error, "data.data.errorreason"));
        setPublishError(
          "The idea couldnt be published to blockchain. Please try again later."
        );
      });
  }
  function saveToMongo(form) {
    MongoDBInterface.addSignature(form)
      .then((success) => {
        showToaster("Your Idea is now registered on the blockchain!", {
          type: "dark",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const checkValidationBeforeSubmit = () => {
    const { category, price, thumbnail } = form;
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
      handleSubmit();
    }
  };

  const setPurpose = (purpose) => {
    setFormData({ ...form, purpose });
  };

  const changeFileStorage = (item) => {
    console.log("item ==> ", item);
    setFormData({ ...form, storage: item.value });
  };

  return (
    <Container fluid className="create-container">
      <Row className="createform top-bar d-flex w-100">
        <Col md="1" sm="1" lg="1" xs="1">
          <Button
            className="submit-btn"
            onClick={() => checkValidationOnButtonClick()}
          >
            Cancel
          </Button>
        </Col>

        <Col md="10" sm="10" lg="10" xs="10" className="">
          {/* <Button  className="cancel-btn">
              Cancel
          </Button> */}
        </Col>
        <Col md="1" sm="1" lg="1" xs="1">
          <Button
            className="submit-btn"
            onClick={() => checkValidationOnButtonClick()}
          >
            Submit
          </Button>
        </Col>
      </Row>
      <Row className="createform  d-flex">
        <Col md="10" sm="10" lg="10" xs="10" className="page-content">
          <div className="step-container">
            {form.PDFFile ? (
              <>
                <Form.Group
                  as={Col}
                  className="formEntry"
                  md="12"
                  controlId="title"
                >
                  <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    className={
                      formErrors.title ? "input-err titleArea" : "titleArea"
                    }
                    placeholder="Title*"
                    maxLength={50}
                    onChange={handleChange}
                  />
                </Form.Group>
                {form.PDFFile && (
                  <Form.Group
                    as={Col}
                    className="formEntry desc-group"
                    md="12"
                    controlId="description"
                  >
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
                      placeholder="Description upto 250 words"
                      style={{ resize: "none" }}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}
              </>
            ) : (
              <>
                <h2 className="master-header ">Share you idea</h2>
              </>
            )}
            <Col md="12" sm="12" lg="12" xs="12">
              <div className="shot-media-upload-placeholder ">
                {checkUplloadedFile()}
              </div>
            </Col>
          </div>
        </Col>
      </Row>
      {modalShow && (
        <CreateIdeaModal
          show={modalShow}
          form={form}
          formErrors={formErrors}
          onImageDrop={onImageDrop}
          clearImage={clearImage}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          handleTagsChange={handleTagsChange}
          setPurpose={setPurpose}
          onHide={() => setModalShow(false)}
          handleChange={handleChange}
          priceRef={priceRef}
          setFormData={setFormData}
          checkValidationBeforeSubmit={checkValidationBeforeSubmit}
          publishState={publishState}
          publishError={publishError}
          billet={billet}
        />
      )}
    </Container>
  );
};

export default CreateNew;
