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
  return (
    <Container fluid className="racks-container">
      <Row className="rack mt-2">
        <Col md="10">
          <span className="father-grey">Explore the tribe</span>
          <hr></hr>
        
          <Row className="deck-row text-center">
            {[...props.deck].map((signature, index) => {
              return (
                <CollectionCard
                  collection={signature}
                  key={index}
                  index={index}
                />
              );
            })}
          </Row>
        </Col>
        <Col md="2" className="latest-news">
            <span className="master-grey">Newsletter</span>
            <div className="news-list">


            </div>
        </Col>
        
      </Row>
    </Container>
  );
};
export default Rack;
