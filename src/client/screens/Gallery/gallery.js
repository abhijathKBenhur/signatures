import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants'
import Rack from '../../components/Rack/Rack'
import './gallery.scss'
function gallery(props) {
    return (
        <div className="gallery">
            <Row className="w-100 rackRow ">
                <Rack category={CONSTANTS.CARD_CATEGORIES.CONTEMPORARY} cards={props.fingerprints.filter(card => card.category == CONSTANTS.CARD_CATEGORIES.CONTEMPORARY)} ></Rack>
            </Row>
            <Row className="w-100 rackRow">
                <Rack category={CONSTANTS.CARD_CATEGORIES.MORDERN} cards={props.fingerprints.filter(card => card.category == CONSTANTS.CARD_CATEGORIES.MORDERN)} ></Rack>
            </Row>
            <Row className="w-100 rackRow">
                <Rack category={CONSTANTS.CARD_CATEGORIES.ABSTRACT} cards={props.fingerprints.filter(card => card.category == CONSTANTS.CARD_CATEGORIES.ABSTRACT)} ></Rack>
            </Row>
        </div>
      
    )
}

export default gallery;