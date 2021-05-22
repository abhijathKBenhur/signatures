import React from "react";
import { Card, CardDeck } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, User } from "react-feather";
import Image, { Shimmer } from "react-shimmer";

import "./Rack.scss";
const Rack = (props) => {
  let history = useHistory();
  function openCardView(tokenId, owner) {
    history.push("/card/" + tokenId + "?owner=" + owner);
  }
  let sideSize = props.classType == "primary" ? 424 : 280;
  return (
    <div className={"vertical-shelf " + props.classType}>
      {props.deck.map((signature, index) => {
        return (
          <Card
            key={index}
            className="signature"
            onClick={() => {
              openCardView(signature.tokenId, signature.owner);
            }}
          >
            <Image
              src={"https://source.unsplash.com/random/100x100?sig=1" + index}
              fallback={<Shimmer width={sideSize} height={sideSize} />}
            />
            <Card.Body className="rack-card-body">
              <div className="signature-title">
                <Card.Title>
                  {signature.name ||
                    "This is a ling snentence titl with lorem ipsum and whwatebe rshit that they can user klajbsdlkanldkan ldskans"}
                </Card.Title>
              </div>
              <div className="signature-content">
                <Card.Text className="">
                  {signature.owner || "Owner name can also be a "}
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
