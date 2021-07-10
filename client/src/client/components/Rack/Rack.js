import React from "react";
import _ from "lodash";
import { Button, Card, CardDeck } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, ExternalLink } from "react-feather";
import Image from "react-image-resizer";
import { Row, Col, Container } from "react-bootstrap";
import "./Rack.scss";
import moment from "moment";
import Web3Utils from "web3-utils";
import CONSTANTS from "../../commons/Constants";
import CollectionCard from "../collection-card/collection-card";
const Rack = (props) => {
  let history = useHistory();
  function openCardView(signature) {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }
  const goToUserProfile = (id) => {
    history.push({
      pathname: "/profile/" + id,
      state: {
        userName: id,
      },
    });
  };

  function getActionForPurpose(purpose) {
    switch (purpose) {
      case CONSTANTS.PURPOSES.SELL:
        return "BUY";
      case CONSTANTS.PURPOSES.AUCTION:
        return "BID";
      case CONSTANTS.PURPOSES.COLLAB:
        return "COLLABORATE";
      case CONSTANTS.PURPOSES.KEEP:
        return "NOT FOR SALE";
    }
  }

  return (
    <Container fluid>
      <Row className="rack">
        <Col md="12" className="deck">
          <Row className="deck-row text-center">
            {[...props.deck].map((signature, index) => {
              return (
                <CollectionCard collection={signature} index={index} profileCallback={goToUserProfile} actionCallback={getActionForPurpose}/>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Rack;
