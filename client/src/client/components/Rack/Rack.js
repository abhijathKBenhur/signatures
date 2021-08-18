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
import CommentsPanel from "../comments/CommentsPanel";

const Rack = (props) => {
  return (
    <Container fluid className="racks-container">
      
      <Row className="rack mt-2">
        <Col md="9">
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
        <Col md="3" className="latest-news mt-3">
          <span className="master-grey">Activities</span>
          <hr></hr>
          <div className="activity-entry d-flex flex-row">
            <div className="activity-content  d-flex flex-column">
              <div className="activity-title second-header">Title</div>
              <div className="activity-description second-grey">
                description description description description
              </div>
            </div>
            <div className="activity-thumbnail">thumbnail</div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Rack;
