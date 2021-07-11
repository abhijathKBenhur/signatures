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
import DiscoverMore from "../../components/discover-more/discover-more";

const Rack = (props) => {
  return (
    <Container fluid>
      <Row className="discover-mode" >
        <DiscoverMore></DiscoverMore>
      </Row>
      <Row className="rack">
        <Col md="12" className="deck">
          <Row className="deck-row text-center">
            {[...props.deck].map((signature, index) => {
              return (
                <CollectionCard collection={signature} key={index} index={index}  />
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Rack;
