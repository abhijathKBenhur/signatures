import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container, Tabs, Tab } from "react-bootstrap";
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
import EditProfile from "../../modals/edit-profile/edit-profile";
import CreateClan from "../../modals/create-clan/create-clan";
function Profile(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const {
    metamaskID = undefined,
    userDetails = {},
    collectionList = [],
  } = reduxState;
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    metamaskID
  );
  const [profileCollection, setProfileCOllection] = useState([]);
  const [currentUserDetails, setCurrentUserDetails] = useState({});
  const [myNotifications, setMyNotifications] = useState([]);
  let history = useHistory();
  const [key, setKey] = useState("collections");
  const viewUser = _.get(history.location.state, "userName");
  const dispatch = useDispatch();
  const [modalShow, setShowModal] = useState({
    editProfile: false,
    createClan: false
  })
  useEffect(() => {
    const { userDetails = {} } = reduxState;
    const viewUser = _.get(history.location.state, "userName");
    if (viewUser && viewUser.toLowerCase() !== userDetails.userName) {
      let payLoad = {};
      payLoad.userName = viewUser;
      getUserDetails(payLoad);
    } else if (
      userDetails &&
      (!viewUser || viewUser.toLowerCase() === userDetails.userName)
    ) {
      setCurrentUserDetails(userDetails);
    }
  }, [reduxState.userDetails]);

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
    if (address || currentUserDetails.metamaskId) {
      MongoDBInterface.getSignatures().then((signatures) => {
        let response = _.get(signatures, "data.data");
        let isEmptyPresent = _.find(response, (responseItem) => {
          return _.isEmpty(responseItem.ideaID);
        });
        setProfileCOllection(response);
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

  function createnew() {
    history.push("/create");
  }

  return (
    <Container fluid>
      <Row className="profile">
        {_.isEmpty(currentUserDetails.userName) ? (
          <Row className="register-modal">
            <Register></Register>
          </Row>
        ) : (
          <div className="separator w-100">
            <Col md="12" className="mycollection">
              <Row className="loggedIn">
                <Col md="12" className="p-0">
                  <div className="userPane w-100 d-column">
                  < div className="profile-section d-flex flex-column ml-5 align-self-center">
                      {/* <div className="separatorline"></div> */}

                      <img
                        src={currentUserDetails.imageUrl}
                        height={150}
                        width={150}
                        className=""
                        style={{
                          background: "#f1f1f1",
                          borderRadius: "5px",
                          zIndex: "1",
                        }}
                        alt="user"
                      />
                    </div>
                    <div className="profile-info ml-3">
                      <Row className="d-flex justify-content-center align-items-center">
                        <span className="master-header userName">
                          {_.get(currentUserDetails, "userName")}
                        </span>
                      </Row>
                      <Row className="">
                        <Col className="address-copy d-flex align-items-center justify-content-center">
                          <span className="address-value third-header">
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
                                    .length - 5,
                                  _.get(currentUserDetails, "metamaskId").length
                                )}
                          </span>
                          <i
                            className="fa fa-external-link ml-2"
                            onClick={() => {
                              window.open(
                                "https://kovan.etherscan.io/address/" +
                                  _.get(currentUserDetails, "metamaskId")
                              );
                            }}
                          ></i>
                        </Col>
                      </Row>
                    </div>
                    <div className="actions">
                    <Button
                          variant="primary"
                          className="button uploadButton"
                          bsstyle="primary"
                          onClick={() => {
                            setShowModal({...modalShow, editProfile: true})
                          }}
                        >
                          Edit Profile
                        </Button>

                        <Button
                          variant="primary"
                          className="button uploadButton"
                          bsstyle="primary"
                          onClick={() => {
                            setShowModal({...modalShow, createClan: true})
                          }}
                        >
                          Create Clan
                        </Button>
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
                            {_.isEmpty(profileCollection) ? (
                              <Col
                                md="12"
                                className="empty-collection d-flex flex-column align-items-center "
                              >
                                <Row>
                                  You currently dont own any ideas. Start by
                                  uploading one.
                                </Row>
                                <Row>
                                  <Button
                                    onClick={() => {
                                      createnew();
                                    }}
                                    variant="primary"
                                  >
                                    {" "}
                                    Upload{" "}
                                  </Button>
                                </Row>
                              </Col>
                            ) : (
                              <Collections collectionList={profileCollection} />
                            )}
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="alerts" title="Notifications">
                        <div className="transactions-wrapper">
                          <div className="middle-block">
                            {myNotifications && myNotifications.length > 0 && (
                              <table>
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
                            )}
                          </div>
                        </div>
                      </Tab>
                      <Tab eventKey="clan" title="Clans"></Tab>
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
      {
        modalShow.editProfile && <EditProfile  show={modalShow.editProfile}  onHide={() => setShowModal({...modalShow, editProfile: false})} />
      }
      {
         modalShow.createClan && <CreateClan  show={modalShow.createClan}  onHide={() => setShowModal({...modalShow, createClan: false})} />
      }
    </Container>
  );
}

export default Profile;
