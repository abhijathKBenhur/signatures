import React from "react";
import _ from "lodash";
import { Button, Card, CardDeck } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, User } from "react-feather";
import Image from "react-image-resizer";
import { Row, Col, Container } from "react-bootstrap";
import "./Rack.scss";
import moment from "moment"
import Web3Utils from "web3-utils";
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
      pathname: '/profile/' + id,
      state: {
        userId: id
      }
    })
  }

  return (
    <Container>
      <Row className="rack">
        <Col md="12" className="mycollection">
          <Row className="collections">
            {props.deck.map((signature, index) => {
              return (
                <Col
                  key={signature._id}
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
                    <div className="collection-preview">
                      <Col md="12 collection-image">
                        <Image
                          src={signature.thumbnail}
                          height={200}
                          className=""
                          style={{
                            background: "#f1f1f1",
                            borderRadius: "7px",
                          }}
                        />
                        <div className="description">
                          <div className="heading">Description</div>
                          <div className="text">
                          {signature.description}
                          </div>
                          
                        </div>
                      </Col>
                    </div>
                    <Row className="collection-footer">
                      <Col md="12" className="idea-title">
                        <p className="text-left title">{signature.title}</p>
                      </Col>
                     
                      <Col md="6" className="idea-details">
                        {moment(signature.createdAt).format("DD-MMM-YYYY")} 
                      </Col>
                      <Col md="6" className="idea-user text-right">
                        <span onClick={ (event) => { event.stopPropagation(); goToUserProfile(signature.owner) }}>{signature.userID}</span> 
                      </Col>
                     
                         
                        {/* <span className="placeholder">{signature.userID}</span>
                        <span className="price">
                          {signature.price &&
                            Web3Utils.fromWei(signature.price)}{" "}
                          ETH
                        </span> */}
                    </Row>
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
