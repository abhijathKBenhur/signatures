import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Container,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import Image, { Shimmer } from "react-shimmer";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";

import { Edit3, Award, User } from "react-feather";
import StorageInterface from "../../interface/StorageInterface";
import CollectionCard  from "../../components/CollectionCard/CollectionCard"



function Profile(props) {
  const [collectionList, setCollectionList] = useState([]);
  let history = useHistory();

  useEffect(() => {
    fetchSignatures();
  }, []);

  function getUnpublishedIdeas(){
    console.log("checking empty")
      BlockChainInterface.getAccountDetails()
      .then((metamaskID) => {
        MongoDBInterface.getSignatures({ userName: metamaskID, getOnlyNulls:true }).then(
          (signatures) => {
            let response = _.get(signatures, "data.data");
            if(response.length > 0){
              
            }
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

 

  function fetchSignatures(){
    BlockChainInterface.getAccountDetails()
    .then((metamaskID) => {
      MongoDBInterface.getSignatures({ userName: metamaskID }).then(
        (signatures) => {
          let response = _.get(signatures, "data.data");
          let isEmptyPresent = _.find(response, responseItem => {
            return _.isEmpty(responseItem.ideaID)
          })
          if(isEmptyPresent){
            getUnpublishedIdeas()
          }
          setCollectionList(response);
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <Container>
      <Row className="profile">
        <Col md="12" className="mycollection">
          <Row className="userPane">
            <div className="profileHolder">
              <Award size={50}></Award>
            </div>
          </Row>
          <div className="separator"> </div>
          <Row className="collections">
            {collectionList.map((collection, index) => {
              return (
                <CollectionCard key={index} card={collection}> </CollectionCard>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
