import React, { Component, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Dropzone from "react-dropzone";
import CONSTANTS from "../../../client/commons/Constants";
import "./Modal.scss";
import { FileText } from "react-feather";
import md5 from "md5";

import _ from "lodash";
class AddTokenModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      category: _.values(CONSTANTS.CATEGORIES)[0],
      description: "",
      price: 0,
      thumbnail: undefined,
      PDFFile: undefined,
      PDFHash: undefined
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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
        let PDFHashValue = md5(Buffer(reader.result));
        this.setState({
          PDFHash: PDFHashValue,
        });
      };
    };
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
    this.props.onHide();
    let stateCopy = _.cloneDeep(this.state);
    // this.setState({
    //   title: "",
    //   category: _.values(CONSTANTS.CATEGORIES)[0],
    //   description: "",
    //   price: 0,
    //   priority: _.values(CONSTANTS.PRIORITIES)[0],
    //   thumbnail: undefined,
    //   PDFFile: undefined,
    //   PDFHash: undefined,
    // });
    this.onSubmit(stateCopy);
  }

  async onSubmit(form) {
    // BlockchainInterface.getFilePath(form.file).then(path => {
    //   form.file = path
    //   BlockchainInterface.createToken({options:form})
    // })
    console.log("getting gile path")
    MongoDBInterface.getFilePath(form)
    .then(success =>{
      let paths = {
          PDFFile: _.get(success[0],'data.path'),
          thumbnail: _.get(success[1],'data.path')
      }
      form.PDFFile = paths.PDFFile;
      form.thumbnail = paths.thumbnail;
      console.log(form)
      }).catch(error => {
          return {
              PDFFile: "error",
              thumbnail: "error"
          }
      })
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="createModal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Let the world know!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            <Form
              noValidate
              encType="multipart/form-data"
              onSubmit={this.handleSubmit}
            >
              <Form.Row>
                <Form.Group as={Col} md="6" className="formEntries mb-0">
                  <Form.Group
                    as={Col}
                    className="formEntry"
                    md="12"
                    controlId="name"
                  >
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={this.handleChange}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="formEntry"
                    md="12"
                    controlId="category"
                  >
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      className="my-1 mr-sm-2"
                      custom
                      name="category"
                      onChange={this.handleChange}
                    >
                      {_.values(CONSTANTS.CATEGORIES).map((category) => {
                        return (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        );
                      })}
                    </Form.Control>

                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    className="formEntry"
                    md="12"
                    controlId="description"
                  >
                    <Form.Label>Description</Form.Label>
                    <InputGroup hasValidation size="lg">
                      <Form.Control
                        type="textarea"
                        rows={5}
                        aria-describedby="inputGroupAppend"
                        name="description"
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} className="formEntry" md="12">
                    <Form.Label>Price</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        type="number"
                        placeholder="0.0"
                        min={1}
                        aria-label="Amount (ether)"
                        name="price"
                        onChange={this.handleChange}
                      />
                      <InputGroup.Append>
                        <InputGroup.Text>ETH</InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </Form.Group>
                </Form.Group>
                <Form.Group as={Col} md="6" className="fileContainers">
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
                  <Form.Row className="pdfContainer">
                    <Dropzone
                      onDrop={this.onPDFDrop}
                      acceptedFiles={".pdf"}
                      className="dropzoneContainer"
                    >
                      {({ getRootProps, getInputProps }) => (
                        <section className="container">
                          {!this.state.PDFFile && (
                            <div
                              {...getRootProps()}
                              className="emptypdf dropZone h-100"
                            >
                              <input {...getInputProps()} />
                              <p className="m-0">Drop files here</p>
                            </div>
                          )}
                        </section>
                      )}
                    </Dropzone>
                    <Form.Row className="w-100 p15 ">
                      {this.state.PDFFile && (
                        <div className="dropZone pdfUploaded">
                          <FileText size={20}></FileText>
                          <div className="">{this.state.PDFFile.name}</div>
                        </div>
                      )}
                    </Form.Row>
                  </Form.Row>
                </Form.Group>
              </Form.Row>
            </Form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={this.props.onHide}>
            Cancel
          </Button>
          <Button variant="danger" value="Submit" onClick={this.handleSubmit}>
            Publish
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddTokenModal;
