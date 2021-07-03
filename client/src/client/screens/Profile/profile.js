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
import ActionsInterface from "../../interface/ActionsInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ExternalLink, Award, User } from "react-feather";
import StorageInterface from "../../interface/StorageInterface";

import Collections from "./collections";
import store from "../../redux/store";
import { setCollectionList } from "../../redux/actions";
function Profile(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, userDetails = {}, collectionList = []} = reduxState;
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    metamaskID
  );
  const [currentUserDetails, setCurrentUserDetails] = useState(userDetails);
  const [myNotifications, setMyNotifications] = useState([]);
  let history = useHistory();
  const [key, setKey] = useState("collections");
  const viewUser = _.get(history.location.state, "userID");
  const dispatch = useDispatch()
  

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    const viewUser = _.get(history.location.state, "userID");
    if (viewUser && viewUser.toLowerCase() !== userDetails.userID) {
      let payLoad = {};
      payLoad.userID = viewUser;
      getUserDetails(payLoad);
    }
    if (userDetails && !viewUser) {
      setCurrentUserDetails(userDetails);
    }
    
  }, [reduxState.userDetails ]);


  useEffect(() => {
    fetchSignatures(currentUserDetails.metamaskId);
    fetchNotifications();
  }, [currentUserDetails]);

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState.metamaskID]);

  const getUserDetails = (payLoad) => {
    MongoDBInterface.getUserInfo(payLoad).then((response) => {
      let userDetails = _.get(response, "data.data");
      setCurrentUserDetails(userDetails);
    });
  };

  function fetchSignatures(address) {
    if(address || currentUserDetails.metamaskId){
      MongoDBInterface.getSignatures({
        ownerAddress: address || currentUserDetails.metamaskId,
      }).then((signatures) => {
        let response = _.get(signatures, "data.data").reverse()
        let isEmptyPresent = _.find(response, (responseItem) => {
          return _.isEmpty(responseItem.ideaID);
        });
        dispatch(setCollectionList(response));
    });
    }
  }

  function fetchNotifications() {
    ActionsInterface.getActions({ to: currentUserDetails.metamaskId }).then(
      (signatures) => {
        let response = _.get(signatures, "data.data");
        setMyNotifications(response);
        console.log(response);
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
                  {/* <Row className="profile-section"> */}

                  {/* </Row>  */}
                  {/* <Row className="profile-section"> */}
                  <div className="left-block-content">
                    <div className="options">
                      <h6 className="mt-1"></h6>
                    </div>
                  </div>
                  {/* </Row> */}
                </Col>
                <Col md="8" className="p-0">
                  <div className="userPane">
                    <div className="w-100">
                      <div className="first-section">
                        <div className="d-flex flex-row">
                          <Col>
                            <Row>
                              {/* <span>{_.get(currentUserDetails, "email")}</span> */}
                            </Row>
                          </Col>
                          <Col>
                            <Row className=" justify-content-end align-items-center">
                              <span></span>
                            </Row>
                            <Row className=" justify-content-end">
                              <span>
                                {/* Total ideas owned : {profileCollection.length} */}
                              </span>
                            </Row>
                          </Col>
                        </div>

                        {/* <div className="image-part">
                          {JSON.stringify(currentUserDetails)}
                        </div>
                        */}
                      </div>
                    </div>
                  </div>
                  <div className="profile-secction d-flex justify-content-center flex-column">
                    {/* <div className="separatorline"></div> */}
                    <img
                      src={currentUserDetails.imageUrl}
                      height={100}
                      width={100}
                      className=""
                      style={{
                        background: "#f1f1f1",
                        borderRadius: "50px",
                        zIndex: "1",
                      }}
                    />
                    <div className="profile-info">
                      <Row className="d-flex justify-content-center">
                        <h4>{_.get(currentUserDetails, "userID")}</h4>
                      </Row>
                      <Row>
                        <Col className="address-copy d-flex align-items-center">
                          <span className="address-value">
                            {_.get(currentUserDetails, "metamaskId") &&
                              _.get(currentUserDetails, "metamaskId").substring(
                                0,
                                5
                              ) +
                                " ..... " +
                                _.get(
                                  currentUserDetails,
                                  "metamaskId"
                                ).substring(
                                  _.get(currentUserDetails, "metamaskId")
                                    .length - 4,
                                  _.get(currentUserDetails, "metamaskId").length
                                )}
                          </span>
                          <ExternalLink
                            size={15}
                            onClick={() => {
                              window.open(
                                "https://kovan.etherscan.io/address/" +
                                  _.get(currentUserDetails, "metamaskId")
                              );
                            }}
                          ></ExternalLink>
                        </Col>
                       
                      </Row>
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
                            <Collections collectionList={collectionList} />
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="profile" title="Notifications">
                        <div className="transactions-wrapper">
                          {myNotifications  && myNotifications.length > 0 && <table>
                            <tr>
                              <td>From</td>
                              <td>Action</td>
                              <td>ideaID</td>
                              <td>message</td>
                            </tr>
                            {myNotifications.map((notification) => {
                              return (
                                <tr>
                                  <td>{notification.from}</td>
                                  <td>{notification.action}</td>
                                  <td>{notification.ideaID}</td>
                                  <td>{notification.message}</td>
                                </tr>
                              );
                            })}
                          </table>
}
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </Col>
                {/* <Col md="2" className="right-block">
                  <div className="right-block-content">
                    <h5>Awards</h5>
                    <div className="options">
                      <p>Website</p>
                      <p>Blog</p>
                      <p>Portfolio</p>
                    </div>
                  </div>
                </Col> */}
              </Row>
            </Col>
          </div>
        )}
      </Row>
    </Container>
  );
}

export default Profile;
