import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Badge, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Dropzone from "react-dropzone";
import CONSTANTS from "../../../client/commons/Constants";
import "./Signature.scss";
import { ChevronsDown, ThumbsDown, ThumbsUp } from "react-feather";
import md5 from "md5";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";

function buySignature() {}

const Signature = (props) => {
  let { hashId } = useParams();
  const location = useLocation();
  const [signature, setSignature] = useState(location.state);
  useEffect(() => {
    if (!signature) {
      MongoDBInterface.getTokenById(hashId).then((signature) => {
        setSignature(_.get(signature, "data.data"));
      });
    }
  }, []);

  function onLoadError(error) {
    alert(error);
  }
  return (
    <Form noValidate encType="multipart/form-data" className="viewSignature">
      <Row>
        <Col md="5">
          {signature.PDFFile && (
            <Form.Row className="w-100 p15 ">
              {signature.PDFFile && (
                <div className="pdfUploaded h-100">
                  <Document file={signature.PDFFile}>
                    <Page
                      pageNumber={1}
                      width={window.innerWidth / 3}
                      onLoadError={onLoadError}
                    />
                  </Document>
                </div>
              )}
            </Form.Row>
          )}
        </Col>
        <Col md="1"></Col>
        <Col md="6">
          <Row className="form-row title-row">
            <h1>{signature.title}</h1>
          </Row>
          <Row className="form-row  tags-row">
            {signature.category &&
              JSON.parse(signature.category).map((tag) => {
                return (
                  <Badge className="tagpill" variant="secondary">
                    {tag.label}
                  </Badge>
                );
              })}
          </Row>
          <Row className="form-row">
            <span> {signature.description}</span>
          </Row>

          <Row className="form-row input-row">
            {/* <Col md="5">
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
            </Col> */}
            <Row className="form-row">
              <Form.Group as={Col} className="formEntry" md="12">
                <InputGroup className="">
                  <span>{signature.price}</span>
                </InputGroup>
              </Form.Group>
            </Row>
            <Row>
              <ThumbsDown></ThumbsDown>
              <ThumbsUp></ThumbsUp>
              <ChevronsDown></ChevronsDown>
            </Row>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};
export default Signature;
