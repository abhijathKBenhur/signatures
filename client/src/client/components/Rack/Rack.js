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
        userID: id,
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
    <Container>
      <Row className="rack">
        <Col md="12" className="deck">
          <Row className="deck-row">
            {props.deck.map((signature, index) => {
              return (
                <Col
                  key={signature._id}
                  md="4"
                  lg="3"
                  sm="6"
                  xs="12"
                  className="deck-card col-md-offset-2"
                  onClick={() => {
                    openCardView(signature);
                  }}
                >
                  <div className="content cursor-pointer p-1">
                    {/* <div className="collection-header d-flex justify-content-between align-items-center p-2">
                      <div className="header-left"></div>
                      <div className="header-right"></div>
                    </div> */}
                    <div className="deck-preview">
                      <Col md="12 deck-image">
                        <Image
                          src={signature.thumbnail}
                          height={250}
                          className=""
                          style={{
                            background: "#f1f1f1",
                            borderRadius: "5px 5px 0 0",
                            justifyItems: "center",
                          }}
                        />
                        <div className="description">
                          <div className="actions w-100">
                            <span className="placeholder">
                            {signature.price &&
                                Web3Utils.fromWei(signature.price)}{" "}
                              BNB
                            </span>
                            <span className="price">
                                <span onClick={() => function openInEtherscan() {
                                  window.open("https://kovan.etherscan.io/tx/" + signature.transactionID);
                                }}><ExternalLink></ExternalLink> </span>
                            </span>
                          </div>
                          <div className="description-text">
                            {signature.description}
                          </div>
                        </div>
                      </Col>
                    </div>
                    <div className="deck-footer p-1">
                      <Row>
                        <Col md="12">
                          <Col md="12" className="tags">
                              {JSON.parse(signature.category) &&
                                JSON.parse(signature.category)
                                  .slice(0, 2)
                                  .map((category) => {
                                    return (
                                      <Button disabled variant="pill">
                                        {category.value}
                                      </Button>
                                    );
                                  })}
                            </Col>
                          </Col>
                      </Row>
                      <Row>
                        <Col md="12" className="idea-title">
                          <p className="text-left title text-tile-title">{signature.title}</p>
                        </Col>
                      </Row>

                      <Row md="12">
                        <Col md="6" className="idea-details">
                          {moment(signature.createdAt).format("DD-MMM-YYYY")}
                        </Col>
                        <Col md="6" className="idea-user text-right">
                          <span
                            onClick={(event) => {
                              event.stopPropagation();
                              goToUserProfile(signature.userID);
                            }}
                          >
                            {signature.userID}
                          </span>
                        </Col>
                      </Row>
                    </div>
                    <div className="deck-actions">
                      <Row>
                        <Col md="6" className="idea-details">
                          <Button
                          disabled={signature.purpose == CONSTANTS.PURPOSES.KEEP}
                            variant="primary"
                            className="cursor-pointer"
                          >
                            {getActionForPurpose(signature.purpose)}
                          </Button>
                        </Col>
                       
                      </Row>
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
