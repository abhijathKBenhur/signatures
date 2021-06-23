import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Container,
  Tabs,
  Tab,
} from "react-bootstrap";
import Image from "react-image-resizer";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import { Shimmer } from "react-shimmer";
import Register from "../../modals/Register/Register";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Edit3, Award, User } from "react-feather";
import StorageInterface from "../../interface/StorageInterface";

import Collections from "./collections";
import store from "../../redux/store";
function Profile(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, userDetails = {} } = reduxState;
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    metamaskID
  );
  const [currentUserDetails, setCurrentUserDetails] = useState(userDetails);
  const [profileCollection, setProfileCollection] = useState([]);
  let history = useHistory();
  const [key, setKey] = useState("collections");

  useEffect(() => {
    const { metamaskID = undefined, userDetails = {} } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
      fetchSignatures();
    }
    if (userDetails) {
      setCurrentUserDetails(userDetails);
    }
  }, [reduxState]);

  function fetchSignatures() {
    MongoDBInterface.getSignatures({ userName: currentMetamaskAccount }).then(
      (signatures) => {
        let response = _.get(signatures, "data.data");
        let isEmptyPresent = _.find(response, (responseItem) => {
          return _.isEmpty(responseItem.ideaID);
        });
        setProfileCollection(response);
        // if(isEmptyPresent){
        //   clearInterval(fetchInterval)
        // }
      }
    );
  }

  function registerCallBacks(params) {
    switch (params.action) {
      case "googleLogin":
        break;
      case "FacebookLogin":
        break;
    }
  }

  return (
    <Container fluid>
      <Row className="profile">
        {_.isEmpty(currentUserDetails.userID) ? (
          <Row className="register-modal">
            <Register></Register>
          </Row>
        ) : (
          <div className="separator w-100">
            <Col md="12" className="mycollection">
              <Row className="loggedIn">
                <Col md="2" className="left-block">
                  <Row className="profile-section">
                  <Image
                          src={currentUserDetails.imageUrl}
                          height={150}
                          className=""
                          style={{
                            background: "#f1f1f1",
                            borderRadius: "7px"
                          }}
                        />
                  </Row>
                  <Row className="profile-section">
                    <div className="left-block-content">
                      <h5>Website</h5>
                      <div className="options">
                        <p>Website</p>
                        <p>Blog</p>
                        <p>Portfolio</p>
                      </div>
                    </div>
                  </Row>
                </Col>
                <Col md="7" className="p-0">
                  <div className="userPane">
                    <div>
                      <div className="first-section">
                        <div className="image-part">
                          {JSON.stringify(currentUserDetails)}
                        </div>
                       
                      </div>
                      <div className="second-section"></div>
                    </div>
                  </div>
                  <div className="tabs-wrapper">
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                    >
                      <Tab eventKey="collections" title="Collection">
                        <div className="collection-wrapper">
                          <div className="middle-block">
                            <Collections collectionList={profileCollection} />
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="profile" title="Transactions">
                        <div className="transactions-wrapper">
                          <h6>No transactions yet</h6>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </Col>
                <Col md="3" className="right-block">
                  <div className="right-block-content">
                    <h5>Awards</h5>
                    <div className="options">
                      <p>Website</p>
                      <p>Blog</p>
                      <p>Portfolio</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Profile;
