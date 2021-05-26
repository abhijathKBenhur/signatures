import React from "react";
import { Card, CardDeck } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, User } from "react-feather";
import Image, { Shimmer } from "react-shimmer";

import "./Rack.scss";
const Rack = (props) => {
  let history = useHistory();
  function openCardView(signature) {
    history.push({pathname:"/signature/" + signature.PDFHash, state:signature});
  }
  let placeHolderSize = props.classType == "primary" ? 424 : 280;
  let containerSize = props.classType == "primary" ? { width:424} : { width:280};
  return (
    <div className={"vertical-shelf " + props.classType}>
      {props.deck.map((signature, index) => {
        return (
          <Card
            key={index}
            className="signature"
            style={containerSize}
            onClick={() => {
              openCardView(signature);
            }}
          >
            <Image
              // src={"https://source.unsplash.com/random/100x100?sig=1" + index}
              src={signature.thumbnail}
              fallback={<Shimmer width={placeHolderSize} height={placeHolderSize} />}
            />
            <Card.Body className="rack-card-body">
              <div className="signature-title">
                <Card.Title>
                  {signature.description.length > 50 ? signature.description.substring(0,50) +"...": signature.description || "Click to see this idea"}
                    
                </Card.Title>
              </div>
              <div className="signature-content">
                <Card.Text className="">
                  {signature.owner || "Anonymous"}
                </Card.Text>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};
export default Rack;
