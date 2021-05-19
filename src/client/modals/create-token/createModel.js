import React, { Component, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { Card, CardDeck, Image } from "react-bootstrap";
import Dropzone from "react-dropzone";
import CONSTANTS from '../../../client/commons/Constants'
import "./Modal.scss";
import {  DollarSign, Award  } from 'react-feather';
import _ from 'lodash'
class AddTokenModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      category: _.values(CONSTANTS.CARD_CATEGORIES)[0],
      description: "",
      price: 0,
      amount: 1,
      uri: undefined,
      callback: props.onSubmit,
      type: undefined
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setCardType = this.setCardType.bind(this);

    this.onDrop = (acceptedFiles) => {
      this.setState({
        uri: Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        }),
      });
    };
  }

  handleChange(event) {
    var stateObject = function() {
      let returnObj = {};
      returnObj[this.target.name] = this.target.value;
         return returnObj;
    }.bind(event)();
    this.setState(stateObject)
  }

  closePopup(){
    
  }

  setCardType(type){
    this.setState({
      type: type
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onHide()
    let stateCopy = _.cloneDeep(this.state);
    this.setState({
      name: "",
      category: _.values(CONSTANTS.CARD_CATEGORIES)[0],
      description: "",
      price: 0,
      amount: 1,
      uri: undefined,
      type: undefined
    });
    this.state.callback(stateCopy)
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
            Create {this.state.type}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {
          !_.isUndefined(this.state.type) ?
            <Form noValidate encType="multipart/form-data" onSubmit={this.handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} md="6">
                <Form.Group as={Col} md="12" controlId="name">
                  <Form.Label>Name</Form.Label>
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
                    {
                      _.values(CONSTANTS.CARD_CATEGORIES).map(category => {
                        return <option key={category} value={category}>{category}</option>
                      })
                    }
                  </Form.Control>

                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="12" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <InputGroup hasValidation size="lg">
                    <Form.Control
                      type="textarea"
                      placeholder="Description"
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
                    <Form.Group as={Col} md="6" controlId="amount">
                    <Form.Label>Total Suply</Form.Label>
                    <Form.Control
                      type="number"
                      className="my-1 mr-sm-2"
                      min={1}
                      name="amount"
                      onChange={this.handleChange}
                    ></Form.Control>
                    </Form.Group>
                  </Form.Row>
                </Form.Group>
              </Form.Group>
              <Form.Group as={Col} md="6" className="imageContainer">
                <Dropzone onDrop={this.onDrop}  acceptedFiles={".jpeg"} className="dropzoneContainer">
                    {({getRootProps, getInputProps}) => (
                      <section className="container">
                        {!this.state.uri && (
                          <div {...getRootProps()} className="dropZone h-100">
                            <input {...getInputProps()} />
                            <p>Drop files here</p>
                          </div>
                        )}
                      </section>
                    )}
                  </Dropzone>
                  {this.state.uri && (
                    <img
                      src={this.state.uri.preview}
                      alt="preview"
                      className="droppedImage"
                      style={{width:'90%'}}
                    />
                  )}
              </Form.Group>
            </Form.Row>
          </Form>
        :
          <Row>
          <Col>
            <Card className="tokenModeCard" onClick={() => this.setCardType(CONSTANTS.CARD_TYPES.LICENCE)}>
              <Card.Body>
                <Card.Title>
                  <Award size={50} color="black"></Award>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Licence</Card.Subtitle>
                <Card.Text>
                  Large number of tokens
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
            <Col>
            <Card className="tokenModeCard" onClick={() => this.setCardType(CONSTANTS.CARD_TYPES.COLLECTIBLE)}>
              <Card.Body>
                <Card.Title>
                  <DollarSign size={50} color="black"></DollarSign>
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Collectible</Card.Subtitle>
                <Card.Text>
                  Rare token collection
                </Card.Text>
              </Card.Body>
            </Card>
            </Col>
          </Row>
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
