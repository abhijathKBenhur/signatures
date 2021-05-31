import React from "react";
import { Card, CardDeck } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, User } from "react-feather";
import Image, { Shimmer } from "react-shimmer";

import "./Rack.scss";
import BlockchainInterface from "../../interface/BlockchainInterface";
import Signature from "../../beans/Signature";
const Rack = (props) => {
  let history = useHistory();
  function openCardView(signature) {
    history.push({pathname:"/signature/" + signature.PDFHash, state:signature});
  }

  function getRandomTileSize(){
    let classTypes = ["small","square","medium","large"];
    var pick = classTypes[Math.floor(Math.random() * classTypes.length)];
  }

  function getImageFromHash(hash){
    BlockchainInterface.getImageFromIPFS(hash).then(files =>{
      let file =  URL.createObjectURL(
        new Blob([files[0].content], { type: 'image/png' } /* (1) */)
      );
      return file
    }).catch(error =>{
      console.log(error)
    })
  }


  let placeHolderSize = props.classType == "primary" ? 424 : 280;
  let containerSize = props.classType == "primary" ? { width:424} : { width:280};
  return (
    <div className={"cursor-pointer vertical-shelf " + props.classType}>
      {props.deck.map((signatureResponse, index) => {
        let signature = new Signature(signatureResponse)
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
              // src={getImageFromHash(signature.thumbnail)}
              src={signature.thumbnail}
              fallback={<Shimmer width={placeHolderSize} height={placeHolderSize} />}
            />
            <Card.Body className="rack-card-body">
              <div className="signature-title">
                <Card.Title>
                  {signature.title.length > 50 ? signature.title.substring(0,50) +"...": signature.title || "Click to see this idea"}
                </Card.Title>
              </div>
              <div className="signature-content">
                <Card.Text className="">
                {signature.owner.length > 50 ? signature.owner.substring(0,50) +"...": signature.owner || "Anonymous"}
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
