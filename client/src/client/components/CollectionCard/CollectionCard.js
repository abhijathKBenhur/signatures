import { useHistory } from "react-router-dom";
import { Feather, User } from "react-feather";
import "./collection-card.scss";
import Signature from "../../beans/Signature";
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Image, { Shimmer } from "react-shimmer";
const CollectionCard = (props) => {
  let history = useHistory();
  const [signature, setSignature] = useState(props.card);
  function openCardView(signature) {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }

  useEffect(() => {}, []);

  return (
    <Col
      md="4"
      lg="3"
      sm="6"
      xs="12"
      onClick={() => {
        openCardView(signature);
      }}
      className="collection-card col-md-offset-2"
    >
      <div className="content"> 
        <Row className="collection-header">
          <Col md="12">{signature.title}</Col>
        </Row>
        <Row className="collection-preview">
          <Col md="12 collection-image">
            <Image fluid className=""
                src={signature.thumbnail}
                style={"max-width:100%"}
                fallback={<Shimmer  />}
              />
            </Col>
        </Row>
        <Row className="collection-footer">
          <Col md="12">
            <p class="text-center">{signature.title}</p>
          </Col>
        </Row>
        </div>
    </Col>
  );
};

export default CollectionCard;
