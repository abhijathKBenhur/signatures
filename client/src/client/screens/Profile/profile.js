import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Container,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
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
import { setCollectionList } from "../../redux/actions";
import store from "../../redux/store";
function Profile(props) {
  //const [collectionList, setCollectionList] = useState([]);
  const [fetchInterval, setFetchInterval] = useState(0);
  const [userDetails, setUserDetails] = useState(0);
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    undefined
  );
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, collectionList = [] } = reduxState;
  let history = useHistory();
  const [key, setKey] = useState("collections");

  const dispatch = useDispatch();
  useEffect(() => {
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  useEffect(() => {
    fetchSignatures();
    // const fetchInterval = setInterval(() => {
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
    //  }, 1000);
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
        dispatch(setCollectionList(response));
      }
    );
  }

  return (
    <Container fluid>
      <Row className="profile">
        {true ? (
          <Row className="register-modal">
            <Register></Register>
          </Row>
        ) : (
          <div className="separator">
            <Col md="12" className="mycollection">
              <Row>
                <div className="userPane">
                  <div>
                    <div className="first-section">
                      <div className="image-part">
                        <img src={userDetails.imageUrl} />
                      </div>
                      <div className="user-personal-info">
                        <h5>{userDetails.fullName}</h5>
                        <p style={{ margin: "0" }}>{userDetails.email}</p>
                        <p style={{ color: "#5252f3", cursor: "pointer" }}>
                          Epic Coders
                        </p>
                        <div className="buttons-block"></div>
                      </div>
                    </div>
                    <div className="second-section"></div>
                  </div>
                </div>
              </Row>
              <Row className="loggedIn">
                <Col md="2">
                  <div className="right-block">
                    <h5>Website</h5>
                    <div className="options">
                      <p>Website</p>
                      <p>Blog</p>
                      <p>Portfolio</p>
                    </div>
                  </div>
                </Col>
                <Col md="8">
                  <div className="tabs-wrapper">
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                    >
                      <Tab eventKey="collections" title="Collection">
                        <div className="collection-wrapper">
                          <div className="middle-block">
                            <Collections collectionList={collectionList} />
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
                <Col md="2">
                  <div className="right-block">
                    <h5>Website</h5>
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
