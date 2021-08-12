import _ from "lodash";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Tabs,
  Tab,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
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
import Clans from "../Clans/Clans";
import ShareModal from "../../modals/share/share.modal";

import Collections from "./collections";
import store from "../../redux/store";
import { setCollectionList } from "../../redux/actions";
import SendMessage from "../../modals/send-message/send-message";
import EditProfile from "../../modals/edit-profile/edit-profile";
import CreateClan from "../../modals/create-clan/create-clan";
import UserInterface from "../../interface/UserInterface";
import * as reactShare from "react-share";
import Wallet from "../../components/wallet/wallet";
import Transactions from "../../components/transactions/transaction";
import RelationsInterface from "../../interface/RelationsInterface";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
function Profile(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const {
    metamaskID = undefined,
    userDetails = {},
    collectionList = [],
  } = reduxState;

  const [profileCollection, setProfileCOllection] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [myNotifications, setMyNotifications] = useState([]);
  const [billetList, setBilletList] = useState([]);

  let history = useHistory();
  const [key, setKey] = useState(isMyPage() ? "Wallet" : "collections");
  const viewUser = _.get(window.location, "pathname").split("profile/")[1];
  const dispatch = useDispatch();
  const [modalShow, setShowModal] = useState({
    editProfile: false,
    createClan: false,
    sendMessage: false,
    shareProfile: false,
  });

  const [walletState, setWalletState] = useState({
    selectedWallet: '',
    trasactionList: []
  })

  // wallet Dummy Data
     const WalletData = [
       {
        coinType: 'Tribe Coin',
        coinBalance: '23 TBC',
        description: 'You can create 23 ideas' 
       },
       {
        coinType: 'Tribe Gold',
        coinBalance: '5 TBG',
        description: 'Equalent to 23$' 
       },
       {
        coinType: 'GAS',
        coinBalance: '0.0003 POLYGON',
        description: 'You can post 20 ideas with the remaining gas' 
       },
     ]

     const DummyTransactionList = [
       {
         from: 'account 1',
         to: 'account 2',
         amount: 1
       },
       {
        from: 'account 3',
        to: 'account 5',
        amount: 2
      },{
        from: 'account 6',
        to: 'account 7',
        amount: 10
      },{
        from: 'account 8',
        to: 'account 10',
        amount: 6
      },
     ]


  useEffect(() => {
    const { userDetails = {} } = reduxState;
    if (viewUser && !isMyPage()) {
      let payLoad = {};
      payLoad.userName = viewUser;
      getUserDetails(payLoad);
    } else if (userDetails && (!viewUser || isMyPage())) {
      setLoggedInUserDetails(userDetails);
    }
    console.log('userDetails = ',userDetails)
  }, [reduxState.userDetails]);

  useEffect(() => {
    fetchSignatures(loggedInUserDetails.userName);
    fetchNotifications();
    if(!isMyPage()){
      loadFollowers()

    }
  }, [loggedInUserDetails]);

  const getUserDetails = (payLoad) => {
    UserInterface.getUserInfo(payLoad).then((response) => {
      let userDetails = _.get(response, "data.data");
      setLoggedInUserDetails(userDetails);
    });
  };

  function isMyPage() {
    return viewUser === userDetails.userName;
  }

  function fetchSignatures(userName) {
    if (userName || loggedInUserDetails.userName) {
      SignatureInterface.getSignatures({ userName: userName }).then(
        (signatures) => {
          let response = _.get(signatures, "data.data");
          let isEmptyPresent = _.find(response, (responseItem) => {
            return _.isEmpty(responseItem.ideaID);
          });
          const billetList = _.filter(
            response,
            (responseItem) =>
              _.get(responseItem, "owner.userName") ===
              _.get(loggedInUserDetails, "userName")
          );
          console.log("billetList ==> ", billetList);
          setBilletList([...billetList]);
          setProfileCOllection(response);
          dispatch(setCollectionList(response));
        }
      );
    }
  }

  function loadFollowers(){
    RelationsInterface.getRelations({
      to:viewUser,
    }).then(success =>{
      setFollowers(_.map(success.data,'to'))
    }).catch(err =>{

    })
  }

  function fetchNotifications() {
    NotificationInterface.getNotifications({
      to: loggedInUserDetails.userName,
    }).then((signatures) => {
      let response = _.get(signatures, "data.data");
      setMyNotifications(response);
      console.log(response);
    });
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

  function followUser() {
    RelationsInterface.postRelation(loggedInUserDetails.userName,viewUser,CONSTANTS.NOTIFICATION_ACTIONS.FOLLOWED,CONSTANTS.ACTION_STATUS.PENDING,"I would like to follow you.").then(success =>{
      showToaster("Followed!", {type: 'success'});
      NotificationInterface.postNotification(loggedInUserDetails.userName,viewUser, CONSTANTS.NOTIFICATION_ACTIONS.FOLLOWED, CONSTANTS.ACTION_STATUS.COMPLETED, loggedInUserDetails.userName + " just followed you!")
    })

  }

  const selectWalletHandler = (seletedWallet) => {
    console.log('seletedWallet ==> ',seletedWallet)
    setWalletState({...walletState, selectedWallet:seletedWallet, trasactionList:DummyTransactionList})
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
                    <div className="profile-section d-flex flex-column">
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
                        <span>{loggedInUserDetails.fullName}</span>
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
                              _.get(
                                loggedInUserDetails,
                                "metamaskId"
                              ).substring(0, 5) +
                                " ..... " +
                                _.get(
                                  loggedInUserDetails,
                                  "metamaskId"
                                ).substring(
                                  _.get(loggedInUserDetails, "metamaskId")
                                    .length - 5,
                                  _.get(loggedInUserDetails, "metamaskId")
                                    .length
                                )}
                          </span>
                          <i
                            className="fa fa-external-link ml-2"
                            onClick={() => {
                              window.open(
                                "https://kovan.etherscan.io/address/" +
                                  _.get(loggedInUserDetails, "userName")
                              );
                            }}
                          ></i>
                        </Col>
                      </Row>
                    </div>
                    {isMyPage() ? (
                      <div className="actions mt-4">
                        <OverlayTrigger
                          key={"top"}
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>Edit Profile</Tooltip>
                          }
                        >
                          <Button
                            variant="action"
                            className="button"
                            bsstyle="primary"
                            onClick={() => {
                              setShowModal({ ...modalShow, editProfile: true });
                            }}
                          >
                            <i className="fa fa-user mr-1"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          key={"top"}
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>Create Clan</Tooltip>
                          }
                        >
                          <Button
                            variant="action"
                            className="button"
                            bsstyle="primary"
                            onClick={() => {
                              setShowModal({ ...modalShow, createClan: true });
                            }}
                          >
                            <i className="fa fa-users mr-1"></i>
                          </Button>
                        </OverlayTrigger>
                      </div>
                    ) : (
                      <div className="sharables d-flex">
                        <reactShare.FacebookShareButton
                          url={window.location.href}
                          quote={"Hey! Check out this idea."}
                        >
                           <div className="social-icon-wrapper fb">
                      <i class="fa fa-facebook" aria-hidden="true"></i>
                    </div>
                          {/* <reactShare.FacebookIcon size={32} round /> */}
                        </reactShare.FacebookShareButton>
                        <reactShare.TwitterShareButton
                          url={window.location.href}
                          title={"Hey! Check out this idea."}
                        >
                          <div className="social-icon-wrapper twitter ml-2">
                     <i class="fa fa-twitter" aria-hidden="true"></i>
                    </div>
                          {/* <reactShare.TwitterIcon size={32} round /> */}
                        </reactShare.TwitterShareButton>
                        <reactShare.WhatsappShareButton
                          url={window.location.href}
                          title={"Hey! Check out this idea."}
                          separator=":: "
                        >
                           <div className="social-icon-wrapper whatsapp ml-2">
                    <i class="fa fa-whatsapp" aria-hidden="true"></i>
                    </div>
                          {/* <reactShare.WhatsappIcon size={32} round /> */}
                        </reactShare.WhatsappShareButton>
                        <reactShare.LinkedinShareButton
                          url={window.location.href}
                        >
                           <div className="social-icon-wrapper linkedin ml-2">
                  <i class="fa fa-linkedin" aria-hidden="true"></i>
                    </div>
                          {/* <reactShare.LinkedinIcon size={32} round /> */}
                        </reactShare.LinkedinShareButton>
                      </div>
                    )}
                  </Col>

                  <Col className={isMyPage() ? "tabs-wrapper mt-3 col-md-8" : "tabs-wrapper mt-3 col-md-10"}>
                    <Row className="profile-details">
                      <Col md="11" className="">
                        <Row>
                          <Col md="12">
                            <span className="second-header">
                              {" "}
                              {loggedInUserDetails.fullName}{" "}
                            </span>{" "}
                          </Col>
                        </Row>
                        <Row className="d-flex align-content-center justify-content-center h-100">
                          {_.isEmpty(loggedInUserDetails.bio) && isMyPage() ? (
                            <div>
                              <Row className="d-flex justify-content-center">
                                <span className="second-grey">
                                  Your profile might need more information.
                                  Please try
                                  <span
                                    className="cursor-pointer color-secondary"
                                    onClick={() => {
                                      setShowModal({
                                        ...modalShow,
                                        editProfile: true,
                                      });
                                    }}
                                  >
                                    {" "}
                                    adding{" "}
                                  </span>
                                  more info.
                                </span>
                              </Row>
                            </div>
                          ) : (
                            <span className="second-grey">
                              {" "}
                              {loggedInUserDetails.bio}{" "}
                            </span>
                          )}
                        </Row>
                      </Col>
                      <Col md="1">
                        {!isMyPage() && (
                          <Row className="justify-content-end pr-3 cursor-pointer color-secondary">
                            <OverlayTrigger
                              key={"top"}
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Send Message
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="action"
                                onClick={() => {
                                  setShowModal({
                                    ...modalShow,
                                    sendMessage: true,
                                  });
                                }}
                              >
                                <i className="fa fa-envelope"></i>
                              </Button>
                            </OverlayTrigger>
                          </Row>
                        )}

                        <Row className="justify-content-end pr-3 cursor-pointer color-secondary">
                          <OverlayTrigger
                            key={"top"}
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>Share</Tooltip>
                            }
                          >
                            <Button
                              variant="action"
                              onClick={() => {
                                setShowModal({
                                  ...modalShow,
                                  shareProfile: true,
                                });
                              }}
                            >
                              <i className="fa fa-share"></i>
                            </Button>
                          </OverlayTrigger>
                        </Row>
                        {!isMyPage() && (
                          <Row className="justify-content-end pr-3 cursor-pointer color-secondary">
                            <OverlayTrigger
                              key={"top"}
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  Follow User
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="action"
                                onClick={() => {
                                  followUser();
                                }}
                              >
                                <i className={followers.indexOf(loggedInUserDetails.userName) > -1 ? "fa fa-user-plus following" : "fa fa-user-plus"}></i>
                              </Button>
                            </OverlayTrigger>
                          </Row>
                        )}
                      </Col>
                    </Row>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                    >
                    {isMyPage() ?  <Tab eventKey="Wallet" title="Wallets">
                        <div className="wallet-wrapper">
                        {
                          WalletData.map((wallet, index) => <Wallet key={index} {...wallet} selectWalletHandler={selectWalletHandler} />)
                        }
                        </div>
                        <div className="transaction-wrapper">
                          {
                            <Transactions transactionList={walletState.trasactionList} transactionType={walletState.selectedWallet} />
                          }
                        </div>
                      </Tab>
                      : <div></div> }
                      <Tab eventKey="collections" title="Collection">
                        <div className="collection-wrapper">
                          <div className="middle-block">
                            {_.isEmpty(profileCollection) ? (
                              <Col
                                md="12"
                                className="empty-collection d-flex flex-column align-items-center "
                              >
                                <Row>
                                  <span className="second-grey">
                                    You currently dont own any ideas. Start by
                                    <span
                                      className="cursor-pointer color-secondary"
                                      onClick={() => {
                                        createnew();
                                      }}
                                    >
                                      {" "}
                                      uploading{" "}
                                    </span>{" "}
                                    one.
                                  </span>
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
                  {isMyPage() ? (
                    <Col
                      md="2"
                      className="notification-wrapper mt-1 flex-column h-100"
                    >
                      <span className="second-grey notification-title">
                        Notifications
                      </span>
                      <hr></hr>
                      <NotificationPanel
                        myNotifications={myNotifications}
                      ></NotificationPanel>
                    </Col>
                  ) : (
                    <div></div>
                  )}
                </Col>
              </Row>
            </Col>
          </div>
        )}
      </Row>
      {modalShow.sendMessage && (
        <SendMessage
          userDetails={loggedInUserDetails}
          show={modalShow.sendMessage}
          onHide={() => setShowModal({ ...modalShow, sendMessage: false })}
        />
      )}
      {modalShow.editProfile && (
        <EditProfile
          userDetails={loggedInUserDetails}
          show={modalShow.editProfile}
          onHide={() => setShowModal({ ...modalShow, editProfile: false })}
        />
      )}
      {modalShow.createClan && (
        <CreateClan
          userDetails={loggedInUserDetails}
          billetList={billetList}
          show={modalShow.createClan}
          onHide={() => setShowModal({ ...modalShow, createClan: false })}
        />
      )}
      {modalShow.shareProfile && (
        <ShareModal
          thumbnail={loggedInUserDetails.imageUrl}
          show={modalShow.shareProfile}
          onHide={() => setShowModal({ ...modalShow, shareProfile: false })}
        />
      )}
    </Container>
  );
}

export default Profile;
