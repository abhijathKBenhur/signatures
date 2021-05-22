import React from "react";
import { Card, CardDeck, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, User } from "react-feather";
import "./Rack.scss";
const Rack = (props) => {
  let history = useHistory();
  function openCardView(tokenId, owner) {
    history.push("/card/" + tokenId + "?owner=" + owner);
  }

  return (
    <div className={"vertical-shelf " + props.classType}>
      {[1,2,3,4,5,6,7,78,9,10].map((signature, index) => {
        return (
          <Card
            key={index}
            className="signature"
            onClick={() => {
              openCardView(signature.tokenId, signature.owner);
            }}
          >
            <Card.Img
              className="signature-thumbnail"
              variant="top"
            //   src={window.location.origin + signature.uri}
              src={"https://source.unsplash.com/random/50x50?sig=1" + index}
            />
            <Card.Body className="rack-card-body">
              <div className="signature-title">
                <Card.Title>{signature.name || "Title"}</Card.Title>
              </div>

              <div className="signature-content">
                <Card.Text className="">
                  {signature.owner || "Owner"}
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
