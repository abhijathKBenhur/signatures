import React, { useState } from "react";
import { Button, Card, CardDeck, Image } from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import { Feather, ExternalLink } from "react-feather";
import moment from "moment";

import "./collection-card.scss"
import CONSTANTS from "../../commons/Constants";
const CollectionCard = (props) => {
    
    const [signature, setSignature] = useState(props.collection)
    return (
        <Col key={signature._id}
            className="main-container"
          md="3"
          lg="3"
          sm="6"
          xs="12">
            <div className="card-container">
                <div className="image-container">
                    <div className="above-image">
                        <div className="description">
                        {signature.description.split(' ').slice(0,40).join(' ')}
                        </div>
                        <div>
                            <span className="etherscan_link">
                            <span
                                    onClick={() =>
                                    function openInEtherscan() {
                                        window.open(
                                        "https://kovan.etherscan.io/tx/" +
                                            signature.transactionID
                                        );
                                    }
                                    }
                                >
                                    <ExternalLink></ExternalLink>{" "}
                                </span>
                            </span>
                        </div>
                    </div>
                    <Image
                        src={signature.thumbnail}
                        className=""
                    />
                    <div className="below-image">
                        {signature.title}
                    </div>
                </div>
                <div className="footer-new">
                    <div className="user-logo">
                        <Image src={signature.owner.imageUrl} />
                         <div className="user-popup-outer">
                             <div className="user-popup">
                                 <div className="user-logo">
                                    <Image src={signature.owner.imageUrl} />
                                 </div>
                                 <div>
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
                                </div>
                            </div>
                        </div>
                        
                      </div>
                      <div className="user-name" onClick={(event) => {
                              event.stopPropagation();
                              props.profileCallback && props.profileCallback(signature.creator.userName);
                            }}>
                        {signature.creator.userName}
                      </div>
                      <div className="date">
                        {moment(signature.createdAt).format("DD-MMM-YYYY")}
                      </div>
                </div>
                { 
                props.actionCallback && 
                <div>
                    <Button
                            disabled={
                              signature.purpose == CONSTANTS.PURPOSES.KEEP
                            }
                            variant="primary"
                            className="cursor-pointer"
                          >
                            {props.actionCallback(signature.purpose)}
                     </Button>
                </div>
                }
            </div>
        </Col>
    )
}
export default CollectionCard