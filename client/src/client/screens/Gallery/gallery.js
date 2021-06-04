import _ from "lodash";
import { Row, Col, Form, Image, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Rack from "../../components/Rack/Rack";
import "./gallery.scss";
import cover from "../../../assets/cover.jpeg";
import MongoDBInterface from "../../interface/MongoDBInterface";

function gallery(props) {
  const [signatureList, setSignatureList] = useState([]);
  useEffect(() => {
    console.log("getting signatures ");
    MongoDBInterface.getSignatures({ limit: 14 }).then((signatures) => {
      let response = _.get(signatures, "data.data");
      setSignatureList(response);
    });
  }, []);

  return (
    <Container fluid>
      <div className="gallery d-flex flex-column">
        <Row className="userPane">
            <div className="profileHolder">
            </div>
          </Row>
        <div className="separator"> </div>
        <Rack deck={signatureList}></Rack>
      </div>
    </Container>
  );
}

export default gallery;
