import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import StorageInterface from "../../interface/StorageInterface";
import Dropzone from "react-dropzone";
import CONSTANTS from "../../commons/Constants";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./Create.scss";
import { FilePlus, X, Image as ImageFile } from "react-feather";
import Hash from "ipfs-only-hash";
import Image from "react-image-resizer";
import { Container } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { shallowEqual, useSelector } from "react-redux";

function Create(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined } = reduxState;
  const [form, setFormData] = useState({
    owner: metamaskID,
    title: "",
    category: [],
    description: "",
    price: 0,
    thumbnail: undefined,
    PDFFile: undefined,
    PDFHash: undefined,
    ideaID: undefined,
    transactionID: undefined,
  });
  const [slideCount, setSlideCount] = useState(0);
  const [billet, setBillet] = useState({});
  let history = useHistory();
  const finalSlideCount = 1;
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
  }, [reduxState]);

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
      category: JSON.stringify(tags),
    });
  }

  function handleChange(event) {
    let returnObj = {};
    returnObj[event.target.name] = event.target.value;
    setFormData({ ...form, ...returnObj });
  }

  function handleSubmit(event) {
    onSubmit();
  }

  function updateIdeaIDToMongo(payload) {
    MongoDBInterface.updateIdeaID(payload)
      .then((success) => {
        toast.dark("Your thoughts are live on blockchain.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        debugger;
        setBillet({
          transactionID: success.transactionID,
          account: success.account,
          PDFHash: success.PDFHash,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function saveToMongo(form) {
    MongoDBInterface.addSignature(form)
      .then((success) => {
        toast.dark("Your thoughts have been submitted!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        gotoProfile();
        // setSlideCount(finalSlideCount + 1)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function saveToBlockChain(form) {
    BlockChainInterface.publishIdea(form, saveToMongo, updateIdeaIDToMongo);
  }

  function onSubmit() {
    console.log("form:", form);
    form.IPFS = true;
    StorageInterface.getFilePaths(form)
      .then((success) => {
        form.PDFFile = _.get(_.find(success, { type: "PDFFile" }), "path");
        form.thumbnail = _.get(
          _.find(_.map(success, "data"), { type: "thumbnail" }),
          "path"
        );
        console.log(form);
        saveToBlockChain(form);
      })
      .catch((error) => {
        return {
          PDFFile: "error",
          thumbnail: "error",
        };
      });
  }

  return (
    <Container>
      <Row className="createform  d-flex align-items-center justify-content-center">
        <Col md="10" sm="12" lg="10" xs="12" className="responsive-content">
          <Form
            noValidate
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="create-form"
          >
            <Col md="12" className="overflow-auto h-100">
              <Row>
                <Col
                  md="12"
                  className="create-wizard-bar justify-content-center align-items-center d-flex"
                ></Col>
              </Row>
              <Row className="content-container">
                {slideCount == 0 ? (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="title-n-desc p-2"
                  >
                    <Row className="">
                      <Form.Group
                        as={Col}
                        className="formEntry"
                        md="12"
                        controlId="title"
                      >
                        <Form.Control
                          type="text"
                          name="title"
                          className="titleArea"
                          placeholder="Title"
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
                        <InputGroup>
                          <Form.Control
                            className="descriptionArea"
                            as="textarea"
                            rows={17}
                            aria-describedby="inputGroupAppend"
                            name="description"
                            placeholder="Description"
                            style={{ resize: "none" }}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                  </Col>
                ) : (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="price-n-category p-2"
                  >
                    <Row className="">
                      <Form.Group as={Col} className="formEntry" md="12">
                        <Select
                          closeMenuOnSelect={true}
                          isMulti
                          className="tag-selector"
                          options={CONSTANTS.CATEGORIES}
                          onChange={handleTagsChange}
                          placeholder="Tags"
                        />
                      </Form.Group>
                    </Row>
                    <Row className="">
                      <Form.Group as={Col} className="formEntry" md="12">
                        <InputGroup className="">
                          <Form.Control
                            type="number"
                            placeholder="how much do you think your idea is worth ?"
                            min={1}
                            className="price-selector"
                            aria-label="Amount (ether)"
                            name="price"
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                  </Col>
                )}
                {slideCount == 0 ? (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="pdf-container p-0"
                  >
                    {form.PDFFile && (
                      <Form.Row className="w-100 p15 d-flex justify-content-center">
                        {form.PDFFile && (
                          <div className="pdfUploaded w-100 h-100">
                            <X
                              className="removePDF cursor-pointer"
                              onClick={() => {
                                clearPDF();
                              }}
                            ></X>
                            <Document
                              fillWidth
                              file={form.PDFFile}
                              onLoadError={PDFLoadError}
                              onLoadSuccess={onDocumentLoadSuccess}
                            >
                              <Page
                                fillWidth
                                pageNumber={1}
                                width={window.innerWidth / 4}
                              />
                            </Document>
                          </div>
                        )}
                      </Form.Row>
                    )}
                    {!form.PDFFile && (
                      <Form.Row className="empty-pdf-row">
                        <Dropzone
                          onDrop={onPDFDrop}
                          acceptedFiles={".pdf"}
                          className="dropzoneContainer"
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="container h-100 ">
                              <div
                                {...getRootProps()}
                                className="emptypdf dropZone h-100 d-flex flex-column align-items-center"
                              >
                                <input {...getInputProps()} />
                                <p className="m-0 dropfile-text">
                                  Drop your PDF File here
                                </p>
                                <FilePlus
                                  size={30}
                                  className="dropfile-icon"
                                  color="#79589F"
                                ></FilePlus>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </Form.Row>
                    )}
                  </Col>
                ) : (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="image-container p-0"
                  >
                    {form.thumbnail && (
                      <Form.Row className="w-100 p15 d-flex justify-content-center">
                        {form.thumbnail && (
                          <div className="imageUploaded w-100 h-100">
                            <X
                              className="removeImage cursor-pointer"
                              onClick={() => {
                                clearImage();
                              }}
                            ></X>
                            <Image
                              src={form.thumbnail.preview}
                              height={400}
                              style={{
                                background: "#FFFFFF",
                              }}
                            />
                          </div>
                        )}
                      </Form.Row>
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
                                <p className="m-0 dropfile-text">
                                  Drop your thumbnail here
                                </p>
                                <ImageFile
                                  size={30}
                                  className="dropfile-icon"
                                  color="#79589F"
                                ></ImageFile>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </Form.Row>
                    )}
                  </Col>
                )}
              </Row>
              <Row className="footer-class p-1">
                <Col
                  md="12"
                  className="d-flex justify-content-between align-items-center "
                >
                  {slideCount == finalSlideCount + 1 ? (
                    <div></div>
                  ) : (
                    <Button
                      variant="danger"
                      className="button"
                      bsstyle="primary"
                      onClick={() => {
                        onBack();
                      }}
                    >
                      {getBackButtonText()}
                    </Button>
                  )}

                  <Button
                    variant="danger"
                    className="button"
                    bsstyle="primary"
                    onClick={() => {
                      onNext();
                    }}
                  >
                    {getNextButtonText()}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );

  function getNextButtonText() {
    if (slideCount == finalSlideCount) {
      return "Publish";
    } else if (slideCount == finalSlideCount + 1) {
      return "Done";
    } else if (slideCount < finalSlideCount) {
      return "Next";
    }
  }

  function getBackButtonText() {
    if (slideCount == 0) {
      return "Cancel";
    } else if (slideCount == finalSlideCount + 1) {
      return "";
    } else if (slideCount <= finalSlideCount) {
      return "Back";
    }
  }

  function onNext() {
    if (slideCount == finalSlideCount) {
      handleSubmit();
    } else if (slideCount == finalSlideCount + 1) {
      gotoGallery();
    } else if (slideCount < finalSlideCount) {
      setSlideCount(slideCount + 1);
    }
  }

  function onBack() {
    if (slideCount == 0) {
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
