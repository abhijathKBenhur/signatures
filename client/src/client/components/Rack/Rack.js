import React from "react";
import _ from "lodash";
import { Card, CardDeck } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, User } from "react-feather";
import Image from "react-image-resizer";
import { Row, Col, Container } from "react-bootstrap";
import "./Rack.scss";
import BlockchainInterface from "../../interface/BlockchainInterface";
import Signature from "../../beans/Signature";
const Rack = (props) => {
  let history = useHistory();
  function openCardView(signature) {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }
  return (
    <Container>
      <Row className="rack">
        <Col md="12" className="mycollection">
          
          <Row className="collections">
            {props.deck.map((signature, index) => {
              return (
                <Col
                  key={index}
                  md="4"
                  lg="3"
                  sm="6"
                  xs="12"
                  className="collection-card col-md-offset-2"
                  onClick={() => {
                    openCardView(signature);
                  }}
                >
                  <div className="content cursor-pointer">
                    {/* <div className="collection-header d-flex justify-content-between align-items-center p-2">
                      <div className="header-left"></div>
                      <div className="header-right"></div>
                    </div> */}
                    <div
                      className="collection-preview"
                      
                    >
                      <Col md="12 collection-image">
                        <Image
                          src={signature.thumbnail}
                          height={200}
                          className=""
                          style={{
                            background: "#f1f1f1",
                            borderRadius: "7px"
                          }}
                        />
                      </Col>
                    </div>
                    <div className="collection-footer">
                      <div md="12" className="idea-title">
                        <p className="text-left title">{signature.title}</p>
                      </div>
                      <div className="idea-details">
                      <span className="placeholder">Dummy</span>
                      <span className="price">{signature.price}</span>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Rack;
