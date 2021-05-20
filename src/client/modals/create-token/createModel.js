import React, { Component, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Card, CardDeck, Image } from "react-bootstrap";
import Dropzone from "react-dropzone";
import CONSTANTS from "../../../client/commons/Constants";
import "./Modal.scss";
import { DollarSign, Award } from "react-feather";
import { FileText } from "react-feather";

import _ from "lodash";
class AddTokenModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      category: _.values(CONSTANTS.IDEA_CATEGORIES)[0],
      description: "",
      price: 0,
      priority: _.values(CONSTANTS.PRIORITIES)[0],
      thumbnailURL: undefined,
      PDFURL: undefined,
      PDFHash: undefined,
      callback: props.onSubmit,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.onImageDrop = (acceptedFiles) => {
      this.setState({
        thumbnailURL: Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        }),
      });
    };

    this.onPDFDrop = (acceptedFiles) => {
      this.setState({
        PDFURL: acceptedFiles[0],
      });
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
    this.setState({
      title: "",
      category: _.values(CONSTANTS.IDEA_CATEGORIES)[0],
      description: "",
      price: 0,
      priority: _.values(CONSTANTS.PRIORITIES)[0],
      thumbnailURL: undefined,
      PDFURL: undefined,
      PDFHash: undefined,
    });
    this.state.callback(stateCopy);
  }

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
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
                <Form.Group as={Col} md="6">
                  <Form.Group as={Col} md="12" controlId="name">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={this.handleChange}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="12" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      as="select"
                      className="my-1 mr-sm-2"
                      custom
                      name="category"
                      onChange={this.handleChange}
                    >
                      {_.values(CONSTANTS.IDEA_CATEGORIES).map((category) => {
                        return (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        );
                      })}
                    </Form.Control>

                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="12" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <InputGroup hasValidation size="lg">
                      <Form.Control
                        type="textarea"
                        rows={2}
                        aria-describedby="inputGroupAppend"
                        name="description"
                        onChange={this.handleChange}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group as={Col} md="12" controlId="price">
                    <Form.Row>
                      <Form.Group as={Col} md="6">
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
                      <Form.Group as={Col} md="6" controlId="priority">
                        <Form.Label>Priority</Form.Label>
                        <Form.Control
                          as="select"
                          className="mr-sm-2"
                          custom
                          name="priority"
                          onChange={this.handleChange}
                        >
                          {_.values(CONSTANTS.PRIORITIES).map((priority) => {
                            return (
                              <option key={priority} value={priority}>
                                {priority}
                              </option>
                            );
                          })}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
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
                          {!this.state.thumbnailURL && (
                            <div {...getRootProps()} className="dropZone h-100">
                              <input {...getInputProps()} />
                              <p>Drop files here</p>
                            </div>
                          )}
                        </section>
                      )}
                    </Dropzone>
                    {this.state.thumbnailURL && (
                      <img
                        src={this.state.thumbnailURL.preview}
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
                          {!this.state.PDFURL && (
                            <div {...getRootProps()} className="dropZone h-100">
                              <input {...getInputProps()} />
                              <p className="m-0">Drop files here</p>
                            </div>
                          )}
                        </section>
                      )}
                    </Dropzone>
                    <Form.Row className="w-100 p15 ">
                      {this.state.PDFURL && (
                        <div className="dropZone pdfUploaded">
                          <FileText size={20}></FileText>
                          <div className="">{this.state.PDFURL.name}</div>
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
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddTokenModal;
