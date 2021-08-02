import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container, Tabs, Tab } from "react-bootstrap";
import NotificationPanel from "../../components/notifications/NotificationPanel";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import { Shimmer } from "react-shimmer";
import Register from "../../modals/Register/Register";
import SignatureInterface from "../../interface/SignatureInterface";
import NotificationInterface from "../../interface/NotificationInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ExternalLink, Award, User } from "react-feather";
import Clans from '../Clans/Clans'
import ShareModal from "../../modals/share/share.modal";

import Collections from "./collections";
import store from "../../redux/store";
import { setCollectionList } from "../../redux/actions";
import SendMessage from "../../modals/send-message/send-message";
import EditProfile from "../../modals/edit-profile/edit-profile";
import CreateClan from "../../modals/create-clan/create-clan";
import UserInterface from "../../interface/UserInterface";
function Profile(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const {
    metamaskID = undefined,
    userDetails = {},
    collectionList = [],
  } = reduxState;
 
  const [profileCollection, setProfileCOllection] = useState([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [myNotifications, setMyNotifications] = useState([]);
  const [ billetList, setBilletList] = useState([]);

  let history = useHistory();
  const [key, setKey] = useState("collections");
  const viewUser = _.get(history.location.state, "userName");
  const dispatch = useDispatch();
  const [modalShow, setShowModal] = useState({
    editProfile: false,
    createClan: false,
    sendMessage: false,
    shareProfile: false
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
      setLoggedInUserDetails(userDetails);
    }
  }, [reduxState.userDetails]);

  useEffect(() => {
    fetchSignatures(loggedInUserDetails.metamaskId);
    fetchNotifications();
  }, [loggedInUserDetails]);


  const getUserDetails = (payLoad) => {
    UserInterface.getUserInfo(payLoad).then((response) => {
      let userDetails = _.get(response, "data.data");
      setLoggedInUserDetails(userDetails);
    });
  };

  function fetchSignatures(address) {
    if (address || loggedInUserDetails.metamaskId) {
      SignatureInterface.getSignatures().then((signatures) => {
        let response = _.get(signatures, "data.data");
        let isEmptyPresent = _.find(response, (responseItem) => {
          return _.isEmpty(responseItem.ideaID);
        });
        const billetList = _.filter(response, (responseItem) => _.get(responseItem, 'owner.metamaskId') === _.get(loggedInUserDetails, 'metamaskId'));
        console.log('billetList ==> ',billetList);
        setBilletList([...billetList])
        setProfileCOllection(response);
        dispatch(setCollectionList(response));
      });
    }
  }

  function fetchNotifications() {
    NotificationInterface.getNotifications({ to: loggedInUserDetails.userName }).then(
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

  function followUser(){
  }

  return (
    <Container fluid>
      <Row className="profile">
        {_.isEmpty(loggedInUserDetails.userName) ? (
          <Row className="register-modal">
            <Register></Register>
          </Row>
        ) : (
          <div className="separator w-100">
            <Col md="12" className="mycollection">
              <Row className="loggedIn h-100">
                <Col md="12" className="p-0 d-flex">
                  <Col md="2" className="userPane w-100 flex-column h-100">
                  < div className="profile-section d-flex flex-column">
                      {/* <div className="separatorline"></div> */}

                      <img
                        src={loggedInUserDetails.imageUrl}
                        height={140}
                        width={140}
                        className=""
                        style={{
                          background: "#f1f1f1",
                          borderRadius: "140px",
                          zIndex: "1",
                        }}
                        alt="user"
                      />
                      <div className="d-flex justify-content-center master-grey mt-1">
                        <span>
                        {/* {loggedInUserDetails.fullName} */}
                        </span>
                      </div>
                      
                    </div>
                    <div className="profile-info">
                      <Row className="d-flex justify-content-center align-items-center">
                        <span className="master-header userName">
                          {_.get(loggedInUserDetails, "userName")}
                        </span>
                      </Row>
                      <Row className="">
                        <Col className="address-copy d-flex align-items-center justify-content-center">
                          <span className="address-value third-header">
                            {_.get(loggedInUserDetails, "metamaskId") &&
                              _.get(loggedInUserDetails, "metamaskId").substring(
                                0,
                                5
                              ) +
                                " ..... " +
                                _.get(
                                  loggedInUserDetails,
                                  "metamaskId"
                                ).substring(
                                  _.get(loggedInUserDetails, "metamaskId")
                                    .length - 5,
                                  _.get(loggedInUserDetails, "metamaskId").length
                                )}
                          </span>
                          <i
                            className="fa fa-external-link ml-2"
                            onClick={() => {
                              window.open(
                                "https://kovan.etherscan.io/address/" +
                                  _.get(loggedInUserDetails, "metamaskId")
                              );
                            }}
                          ></i>
                        </Col>
                      </Row>
                    </div>
                    <div className="actions mt-4">
                    <Button
                          variant="action"
                          className="button"
                          bsstyle="primary"
                          onClick={() => {
                            setShowModal({...modalShow, editProfile: true})
                          }}
                        >
                          <i className="fa fa-user mr-1"></i>
                        </Button>

                        <Button
                          variant="action"
                          className="button"
                          bsstyle="primary"
                          onClick={() => {
                            setShowModal({...modalShow, createClan: true})
                          }}
                        >
                          <i className="fa fa-users mr-1"></i>
                        </Button>
                    </div>
                  </Col>

                  <Col md="8" className="tabs-wrapper mt-3">
                    <Row className="profile-details">
                      <Col md="5">
                        <span className="second-header"> {loggedInUserDetails.fullName} </span> <br></br>
                        <span className="second-grey"> {loggedInUserDetails.bio} </span>
                      
                      </Col>
                      <Col md="7">
                        <Row className="justify-content-end pr-3 cursor-pointer color-secondary">
                          <Button variant="action"   onClick={() => {
                            setShowModal({...modalShow, sendMessage: true})
                          }}>
                            <i className="fa fa-envelope"></i>
                          </Button>
                        </Row>
                        <Row className="justify-content-end pr-3 cursor-pointer color-secondary">
                          <Button variant="action"   onClick={() => {
                            setShowModal({...modalShow, shareProfile: true})
                          }}>
                            <i className="fa fa-share"></i>
                          </Button>
                        </Row>
                        <Row className="justify-content-end pr-3 cursor-pointer color-secondary">
                          <Button variant="action"   onClick={() => {
                            followUser()
                          }}>
                            <i className="fa fa-user-plus"></i>
                          </Button>
                        </Row>
                      </Col>
                    </Row>
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
                     <Tab eventKey="clan" title="Clans">
                        <Clans></Clans>
                      </Tab>
                    </Tabs>
                  </Col>
                  <Col md="2" className="notification-wrapper mt-1 flex-column h-100">
                      <span className="second-header notification-title">Notifications</span>
                      <NotificationPanel myNotifications={myNotifications}></NotificationPanel>
                      
                  </Col> 
                </Col>
              </Row>
            </Col>
          </div>
        )}
      </Row>
      {
        modalShow.sendMessage && <SendMessage userDetails={loggedInUserDetails} show={modalShow.sendMessage}  onHide={() => setShowModal({...modalShow, sendMessage: false})} />
      }
      {
        modalShow.editProfile && <EditProfile userDetails={loggedInUserDetails} show={modalShow.editProfile}  onHide={() => setShowModal({...modalShow, editProfile: false})} />
      }
      {
         modalShow.createClan && <CreateClan  userDetails={loggedInUserDetails} billetList= {billetList} show={modalShow.createClan}  onHide={() => setShowModal({...modalShow, createClan: false})} />
      }
      {
         modalShow.shareProfile && <ShareModal  thumbnail={loggedInUserDetails.imageUrl} show={modalShow.shareProfile}  onHide={() => setShowModal({...modalShow, shareProfile: false})} />
      }
    </Container>
  );
}

export default Profile;
