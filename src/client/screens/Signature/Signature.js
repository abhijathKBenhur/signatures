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
  const [signature, setSignature] = useState({});
  useEffect(() => {
    let signature = location.state
    if(signature){
      setSignature(signature)
    }else{
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
      <Row className="signature-container">
        <Col md="5" className="left-side">
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
        <Col md="7 right-side">
          <div className="top-section">
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
          </div>
          <div className="bottom-section">
            <Row className="form-row signature-footer">
              <div class="left-end">
                <ThumbsDown
                  className="cursor-pointer ThumbsDown"
                  color="#F3C972"
                ></ThumbsDown>
                <ThumbsUp
                  className="cursor-pointer ThumbsUp"
                  color="#60B6A8"
                ></ThumbsUp>
              </div>
              <div class="right-end">
                <div>
                  <ChevronsDown
                    className="cursor-pointer ChevronsDown"
                    color="#D96C5D"
                  ></ChevronsDown>
                </div>
              </div>
            </Row>
          </div>
        </Col>
      </Row>
    </Form>
  );
};
export default Signature;
