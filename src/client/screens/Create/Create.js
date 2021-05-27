import React, { Component, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface"
import Dropzone from "react-dropzone";
import CONSTANTS from "../../../client/commons/Constants";
import { withRouter } from "react-router-dom";
import "./Create.scss";
import { FileText } from "react-feather";
import  Hash from 'ipfs-only-hash'

import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";

class Create extends Component {
  constructor(props) {
    super(props);
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    BlockChainInterface.getAccountDetails().then(metamaskID => {
      this.setState({
        owner: metamaskID
      })
    }).catch(error =>{
      console.log(error)
    })
    this.state = {
      owner: "",
      title: "",
      category: [],
      description: "",
      price: 0,
      thumbnail: undefined,
      PDFFile: undefined,
      PDFHash: undefined,
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
        Hash.of(Buffer(reader.result)).then(PDFHashValue => {
          this.setState({
            PDFHash: PDFHashValue
          });
        })
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

  async onSubmit(form) {
    // BlockchainInterface.getFilePath(form.file).then(path => {
    //   form.file = path
    //   BlockchainInterface.createToken({options:form})
    // })
    console.log("form:", form);
    const parentThis = this;
    MongoDBInterface.getFilePath(form)
      .then((success) => {
        let paths = {
          PDFFile: _.get(success[0], "data.path"),
          thumbnail: _.get(success[1], "data.path"),
        };
        form.PDFFile = paths.PDFFile;
        form.thumbnail = paths.thumbnail;
        console.log(form);
        MongoDBInterface.addSignature(form)
          .then((success) => {
            toast.dark("Your thoughts have been pusblished!", {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            debugger;
            this.props.history.push("/home");
          })
          .catch((err) => {
            console.log(err);
          });
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
                    type="textarea"
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
      </Form>
    );
  }
}

export default Create;