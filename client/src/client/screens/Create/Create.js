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

  function onImageDrop(acceptedFiles) {
    setFormData({
      ...form,
      thumbnail: Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      }),
    });
  }

  function onPDFDrop(acceptedFiles) {
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
    event.preventDefault();
    onSubmit(form);
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
        history.push("/home");
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
        history.push("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function saveToBlockChain(form) {
    BlockChainInterface.publishIdea(form, saveToMongo, updateIdeaIDToMongo);
  }

  function onSubmit(form) {
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
            <Col md="12">
              <Row>
                <Col
                  md="12"
                  className="create-wizard-bar justify-content-center align-items-center d-flex"
                >
                  wizart guide
                </Col>
              </Row>
              <Row>
                <Col md="6" sm="12" lg="6" xs="12" className="title-n-desc p-2">
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
                          aria-describedby="inputGroupAppend"
                          name="description"
                          placeholder="Description"
                          style={{"resize": "none"}}
                          onChange={handleChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Row>
                </Col>
                <Col md="6" sm="12" lg="6" xs="12">
                 
                </Col>
              </Row>
            </Col>
            <Col md="12" className="footer-class p-1">
              footer 
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Create;
