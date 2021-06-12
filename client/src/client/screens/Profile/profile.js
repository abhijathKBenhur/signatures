import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import Image, { Shimmer } from "react-shimmer";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useSelector } from "react-redux";
import { Edit3, Award, User } from "react-feather";
import StorageInterface from "../../interface/StorageInterface";
import CollectionCard from "../../components/CollectionCard/CollectionCard";
import DiscoverMore from "../../components/discover-more/discover-more";

function Profile(props) {
  const [collectionList, setCollectionList] = useState([]);
  const [fetchInterval, setFetchInterval] = useState(0);
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(undefined);
  const reduxState = useSelector((state) => state, shallowEqual);
  let history = useHistory();

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  useEffect(() => {
    fetchSignatures();
    const fetchInterval = setInterval(() => {
      MongoDBInterface.getSignatures({
        userName: currentMetamaskAccount,
        getOnlyNulls: true,
      }).then((signatures) => {
        let response = _.get(signatures, "data.data");
        if (response.length == 0) {
          clearInterval(fetchInterval);
          fetchSignatures();
        }
      });
    }, 1000);
    setFetchInterval(fetchInterval);
    return () => clearInterval(fetchInterval);
  }, []);

  function fetchSignatures() {
    MongoDBInterface.getSignatures({ userName: currentMetamaskAccount }).then(
      (signatures) => {
        let response = _.get(signatures, "data.data");
        let isEmptyPresent = _.find(response, (responseItem) => {
          return _.isEmpty(responseItem.ideaID);
        });
        // if(isEmptyPresent){
        //   clearInterval(fetchInterval)
        // }
        setCollectionList(response);
      }
    );
  }

  return (
    <Container fluid>
      <Row className="profile">
        <Col md="12" className="mycollection">
          <Row className="userPane">
            <div className="profileHolder">
              <Award size={50}></Award>
            </div>
          </Row>
          <div className="separator"> </div>
          <Container>
            <Row className="collections">
              {collectionList.map((collection, index) => {
                return (
                  <CollectionCard key={index} card={collection}>
                    {" "}
                  </CollectionCard>
                );
              })}
            </Row>
          </Container>
        </Col>
      </Row>
      <DiscoverMore />
    </Container>
  );
}

export default Profile;
