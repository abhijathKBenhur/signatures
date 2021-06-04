import React, { Component, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import StorageInterface from "../../interface/StorageInterface";
import Dropzone from "react-dropzone";
import CONSTANTS from "../../commons/Constants";
import { withRouter } from "react-router-dom";
import "./Create.scss";
import { FileText } from "react-feather";
import Hash from "ipfs-only-hash";
import { Container } from "react-bootstrap";
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
    form.IPFS = true;
    const parentThis = this;
    StorageInterface.getFilePaths(form)
      .then((success) => {
        form.PDFFile = _.get(_.find(success, { type: "PDFFile" }), "path");
        form.thumbnail = _.get(
          _.find(_.map(success, "data"), { type: "thumbnail" }),
          "path"
        );
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
      <Container>
        <div className="createform  d-flex align-items-center justify-content-center">
          <Col md="10" sm="12" lg="10" xs="12 responsive-content">
            <Form
              noValidate
              encType="multipart/form-data"
              onSubmit={this.handleSubmit}
              className="create-form"
            >
              <Row>
                <Col md="6">a</Col>
              </Row>
            </Form>
          </Col>
        </div>
      </Container>
    );
  }
}

export default Create;
