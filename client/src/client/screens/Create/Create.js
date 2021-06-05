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


function Create(props) {
  const [form, setFormData] = useState({
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
  });
  const [slideCount, setSlideCount] = useState(0);
  let history = useHistory();

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    BlockChainInterface.getAccountDetails()
      .then((metamaskID) => {
        setFormData({
          ...form,
          owner: metamaskID,
        });
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);


  onImageDrop = (acceptedFiles) => {
    setFormData({
      ...form,
      thumbnail: Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      }),
    });
  };

  onPDFDrop = (acceptedFiles) => {
    setFormData({
      ...form,
      PDFFile: acceptedFiles[0],
    });
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(acceptedFiles[0]);
    reader.onloadend = () => {
      Hash.of(Buffer(reader.result)).then((PDFHashValue) => {
        // Check for already existing PDF Hashes
        setFormData({
          ...form,
          PDFHash: PDFHashValue,
        });
      });
    };
  };

  PDFLoadError = (error) => {

  }
  onDocumentLoadSuccess = (success) => {

  }

  handleTagsChange = (tags) => {
    setFormData({
      category: JSON.stringify(tags),
    });
  }

  handleChange = (event)  => {
    var stateObject = function() {
      let returnObj = {};
      returnObj[this.target.name] = this.target.value;
      return returnObj;
    }.bind(event)();
    this.setFormData({...form,stateObject});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  }

  updateIdeaIDToMongo = (payload) => {
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
        history.push("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveToMongo = (form) => {
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
        history.push("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  saveToBlockChain =(form) => {
    BlockChainInterface.publishIdea(
      form,
      saveToMongo,
      updateIdeaIDToMongo
    );
  }

  onSubmit = (form) => {
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

    return (
      <Container>
        <div className="createform  d-flex align-items-center justify-content-center">
          <Col md="10" sm="12" lg="10" xs="12 responsive-content">
            <Form
              noValidate
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="create-form"
            >
              <Row>
                <Col md="12">wizart guide</Col>
                <Col md="6">b</Col>
                <Col md="6">a</Col>
                <Col md="12">button section</Col>
              </Row>
            </Form>
          </Col>
        </div>
      </Container>
    );
  }

export default Create;
