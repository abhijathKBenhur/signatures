import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import CONSTANTS from '../../commons/Constants'
import Rack from '../../components/Rack/Rack'
import './gallery.scss'
function gallery(props) {
    return (
        <div className="gallery">
            <Row className="w-100 rackRow ">
                <Rack category={CONSTANTS.IDEA_CATEGORIES.TECHNOLOGY} cards={props.fingerprints.filter(card => card.category == CONSTANTS.IDEA_CATEGORIES.TECHNOLOGY)} ></Rack>
            </Row>
        </div>
      
    )
}

export default gallery;