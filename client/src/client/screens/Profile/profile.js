import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import { Badge, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import Image, { Shimmer } from "react-shimmer";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";

function Profile(props) {
  const [collectionList, setCollectionList] = useState([]);
  const [rackList, setRackList] = useState([]);
  let history = useHistory();
  function openCardView(signature) {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }
  useEffect(() => {
    BlockChainInterface.getAccountDetails()
      .then((metamaskID) => {
        MongoDBInterface.getSignatures({ userName: metamaskID }).then(
          (signatures) => {
            let response = _.get(signatures, "data.data");
            let rackValues = [];
            setCollectionList(response);
            _.forEach(response, (signature, index) => {
              rackValues[index % 3] = rackValues[index % 3] || [];
              rackValues[index % 3].push(new Signature(signature));
            });
            setRackList(rackValues);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Row className="profile">
      <Col md="12">
        <Row>
          <Col md="6">
            <h2>My collection</h2>
          </Col>
          <Col md="6">
            <h2>Following</h2>
          </Col>
        </Row>
      </Col>
      <Col md="6" className="mycollection">
        <Row>
          <Col md="12" className="collection-container">
            {collectionList.map((collection, index) => {
              return (
                <Row
                  className="long-card cursor-pointer"
                  onClick={() => {
                    openCardView(collection);
                  }}
                >
                  <Col md="3" className="image-container">
                    <Image
                      src={collection.thumbnail}
                      width={50}
                      height={50}
                      fallback={<Shimmer width={50} height={50} />}
                    />
                  </Col>

                  <Col md="8" className="description-container">
                    <Row>
                      <Col md="12">
                        <h4>{collection.title}</h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        {collection.description.length > 50
                          ? collection.description.substring(0, 50) + "..."
                          : collection.description || "Click to see this idea"}
                      </Col>
                    </Row>
                  </Col>
                  <Col md="1">
                    <Row></Row>
                    <Row></Row>
                    <Row></Row>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
        <Row></Row>
      </Col>
      <Col md="6" className="favorites"></Col>
    </Row>
  );
}

export default Profile;
