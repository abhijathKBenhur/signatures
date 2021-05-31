import React, { Component, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import Dropzone from "react-dropzone";
import CONSTANTS from "../../commons/Constants";
import { withRouter } from "react-router-dom";
import "./Create.scss";
import { FileText } from "react-feather";
import Hash from "ipfs-only-hash";

import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";

class Create extends Component {
  constructor(props) {
    super(props);
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    BlockChainInterface.getAccountDetails()
      .then((metamaskID) => {
        this.setState({
          owner: metamaskID,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    this.state = {
      owner: "",
      title: "",
      category: [],
      description: "",
      price: 0,
      thumbnail: undefined,
      PDFFile: undefined,
      PDFHash: undefined,
      ideaID: undefined,
      transactionID: undefined,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.PDFLoadError = this.PDFLoadError.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);

    this.onImageDrop = (acceptedFiles) => {
      this.setState({
        thumbnail: Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        }),
      });
    };

    this.onPDFDrop = (acceptedFiles) => {
      this.setState({
        PDFFile: acceptedFiles[0],
      });
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(acceptedFiles[0]);
      reader.onloadend = () => {
        Hash.of(Buffer(reader.result)).then((PDFHashValue) => {
          // Check for already existing PDF Hashes
          this.setState({
            PDFHash: PDFHashValue,
          });
        });
      };
    };
  }

  PDFLoadError(error) {}
  onDocumentLoadSuccess(success) {}

  handleTagsChange(tags) {
    this.setState({
      category: JSON.stringify(tags),
    });
  }

  handleChange(event) {
    var stateObject = function() {
      let returnObj = {};
      returnObj[this.target.name] = this.target.value;
      return returnObj;
    }.bind(event)();
    this.setState(stateObject);
  }

  closePopup() {}

  handleSubmit(event) {
    event.preventDefault();
    let stateCopy = _.cloneDeep(this.state);
    this.onSubmit(stateCopy);
  }

  updateIdeaIDToMongo(payload) {
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
        this.props.history.push("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveToMongo(form) {
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
        this.props.history.push("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveToBlockChain(form) {
    BlockChainInterface.publishIdea(
      form,
      this.saveToMongo,
      this.updateIdeaIDToMongo
    );
  }

  async onSubmit(form) {
    console.log("form:", form);
    form.IPFS = true
    const parentThis = this;
    BlockChainInterface.getFilePaths(form)
      .then((success) => {
        form.PDFFile = _.get(_.find(success,{type:"PDFFile"}),'path')
        form.thumbnail = _.get(_.find(success,{type:"thumbnail"}),'path')
        console.log(form);
        this.saveToBlockChain(form);
      })
      .catch((error) => {
        return {
          PDFFile: "error",
          thumbnail: "error",
        };
      });
  }

  render() {
    return (
      <Form
        noValidate
        encType="multipart/form-data"
        onSubmit={this.handleSubmit}
        className="createModal"
      >
        <Col md="12" className="form-col">
          <Row>
            <Col md="6">
              <Row className="form-row">
                <h1>Post us your idea</h1>
              </Row>
              <Row className="form-row">
                <Form.Group
                  as={Col}
                  className="formEntry"
                  md="12"
                  controlId="title"
                >
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={this.handleChange}
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
                      rows={5}
                      aria-describedby="inputGroupAppend"
                      name="description"
                      placeholder="Description"
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                </Form.Group>
              </Row>

              {/* <Row className="form-row additional-row">
              <Col md="4">
                <hr></hr>
              </Col>
              <Col md="4" className="additionaText">Additional information</Col>
              <Col md="4">
                <hr></hr>
              </Col>
            </Row> */}
              <Row className="form-row">
                <Col md="5">
                  <Form.Row className="imageContainer">
                    <Dropzone
                      onDrop={this.onImageDrop}
                      acceptedFiles={".jpeg"}
                      className="dropzoneContainer"
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="container">
                          {!this.state.thumbnail && (
                            <div {...getRootProps()} className="dropZone h-100">
                              <input {...getInputProps()} />
                              <p>Thumbnail</p>
                            </div>
                          )}
                        </section>
                      )}
                    </Dropzone>
                    {this.state.thumbnail && (
                      <img
                        src={this.state.thumbnail.preview}
                        alt="preview"
                        className="droppedImage"
                        style={{ width: "90%" }}
                      />
                    )}
                  </Form.Row>
                </Col>
                <Col md="7">
                  <Row className="form-row">
                    <Form.Group as={Col} className="formEntry" md="12">
                      <Select
                        closeMenuOnSelect={true}
                        isMulti
                        options={CONSTANTS.CATEGORIES}
                        onChange={this.handleTagsChange}
                        placeholder="Tags"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="form-row">
                    <Form.Group as={Col} className="formEntry" md="12">
                      <InputGroup className="">
                        <Form.Control
                          type="number"
                          placeholder="Price"
                          min={1}
                          aria-label="Amount (ether)"
                          name="price"
                          onChange={this.handleChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md="1" className="separator"></Col>
            <Col md="5" className="right-container d-flex justify-content-end">
              {!this.state.PDFFile && (
                <Form.Row className="pdfContainer">
                  <Dropzone
                    onDrop={this.onPDFDrop}
                    acceptedFiles={".pdf"}
                    className="dropzoneContainer"
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section className="container h-100 ">
                        <div
                          {...getRootProps()}
                          className="emptypdf dropZone h-100"
                        >
                          <input {...getInputProps()} />
                          <p className="m-0">Drop files here</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </Form.Row>
              )}
              {this.state.PDFFile && (
                <Form.Row className="w-100 p15 d-flex justify-content-end">
                  {this.state.PDFFile && (
                    <div className="pdfUploaded h-100">
                      <Document
                        file={this.state.PDFFile}
                        onLoadError={this.PDFLoadError}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                      >
                        <Page pageNumber={1} width={window.innerWidth / 4} />
                      </Document>
                    </div>
                  )}
                </Form.Row>
              )}
            </Col>
          </Row>
          <Row>
            <Col md="4"></Col>
            <Col md="4 footerComponent">
              <Button
                variant="danger"
                className="publish-btn"
                value="Submit"
                onClick={this.handleSubmit}
              >
                Publish
              </Button>
            </Col>
            <Col md="4"></Col>
          </Row>
        </Col>
      </Form>
    );
  }
}

export default Create;
