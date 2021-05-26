import React, { useState, useEffect } from 'react';
import { useParams,useLocation } from "react-router-dom";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Dropzone from "react-dropzone";
import CONSTANTS from "../../../client/commons/Constants";
import "./Signature.scss";
import { FileText } from "react-feather";
import md5 from "md5";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import {  toast } from 'react-toastify';
import Select from 'react-select'

function buySignature(){

}

const Signature =(props) => {
  let { hashId } = useParams();
  const location = useLocation();
  const [signature, setSignature] = useState(location.state);
  useEffect(() => {
    if(!signature){
      MongoDBInterface.getTokenById(hashId).then(signature => {
        setSignature(_.get(signature,'data.data'));
      })
    }
     
  }, []);

    return (
      <Form
        noValidate
        encType="multipart/form-data"
        className="viewSignature"
      >
        <Row>
          <Col md="7">
            <Row className="form-row">
              <h1>{signature.title}</h1>
            </Row>
            <Row className="form-row">
              <Form.Group
                as={Col}
                className="formEntry"
                md="12"
                controlId="description"
              >
                <span> {signature.description}</span>
              </Form.Group>
            </Row>
            <Row className="form-row">
              <Form.Group
                as={Col}
                className="formEntry"
                md="12"
                controlId="category"
              >
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  custom
                  name="category"
                >
                   <Select
                    closeMenuOnSelect={true}
                    isMulti
                    options={CONSTANTS.CATEGORIES}
                    placeholder="Tags"
                  />
                </Form.Control>
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
                  {signature.thumbnail && (
                    <img
                      src={signature.thumbnail}
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
                    <InputGroup className="">
                      <span>{signature.price}</span>
                    </InputGroup>
                  </Form.Group>
                </Row>
                <Row className="form-row">
                  <Form.Group as={Col} className="formEntry" md="12">
                    <InputGroup className="">
                      <Form.Control
                        type="number"
                        placeholder="Rating"
                        min={1}
                        aria-label="Amount (ether)"
                        name="Rating"
                      />
                    </InputGroup>
                  </Form.Group>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col md="5">
            {signature.PDFFile && (
              <Form.Row className="w-100 p15 ">
                {signature.PDFFile && (
                  <div className="pdfUploaded h-100">
                    <Document
                      file={signature.PDFFile}
                    >
                      <Page pageNumber={1} width={window.innerWidth / 3} />
                    </Document>
                  </div>
                )}
              </Form.Row>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="12 footerComponent">
            <Button variant="danger" className="publish-btn" value="Submit" onClick={buySignature}>
              Buy
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
export default Signature;
