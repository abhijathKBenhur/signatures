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
import "./Clan.scss";
import { Shimmer } from "react-shimmer";
import Register from "../../modals/Register/Register";
import SignatureInterface from "../../interface/SignatureInterface";
import NotificationInterface from "../../interface/NotificationInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ExternalLink, Award, User } from "react-feather";

import ShareModal from "../../modals/share/share.modal";

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
import ClanInterface from "../../interface/ClanInterface";
function Clan(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const {
    metamaskID = undefined,
    userDetails = {},
    collectionList = [],
  } = reduxState;

  const [clan, setClan] = useState(props.clan || {});
  const [clanCollection, setclanCollection] = useState([]);
  const [followers, setClanFollowers] = useState([]);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [clanNotifications, setClanNotifications] = useState([]);
  const [billetList, setClanBilletList] = useState([]);

  let history = useHistory();
  const [key, setKey] = useState("Actions");
  const clanName = _.get(window.location, "pathname").split("clan/")[1];
  const dispatch = useDispatch();
  const [modalShow, setShowModal] = useState({
    editProfile: false,
    createClan: false,
    sendMessage: false,
    shareProfile: false,
  });

  const [walletState, setWalletState] = useState({
    selectedWallet: "",
    trasactionList: [],
  });

  // wallet Dummy Data
  const WalletData = [
    // {
    //   coinType: "Tribe Coin",
    //   coinBalance: "23 TBC",
    //   description: "You can create 23 ideas",
    // },
    {
      coinType: "Tribe Gold",
      coinBalance: "5 TBG",
      description: "Equalent to 23$",
    },
    // {
    //   coinType: "GAS",
    //   coinBalance: "0.0003 POLYGON",
    //   description: "You can post 20 ideas with the remaining gas",
    // },
  ];

  const DummyTransactionList = [
    {
      from: "account 1",
      to: "account 2",
      amount: 1,
    },
    {
      from: "account 3",
      to: "account 5",
      amount: 2,
    },
    {
      from: "account 6",
      to: "account 7",
      amount: 10,
    },
    {
      from: "account 8",
      to: "account 10",
      amount: 6,
    },
  ];

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    let payLoad = {};
    payLoad.userName = userDetails.userName;
    getUserDetails(payLoad);
    console.log("userDetails = ", userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    if (_.isEmpty(clan)) {
      ClanInterface.getClan({ name: clanName }).then((success) => {
        setClan(_.get(success, "data.data[0]"));
      });
    }
  }, []);

  const getUserDetails = (payLoad) => {
    UserInterface.getUserInfo(payLoad).then((response) => {
      let userDetails = _.get(response, "data.data");
      setLoggedInUserDetails(userDetails);
    });
  };

  function isMyClan() {
    let memberIfPart = _.find(clan.members, {
      memberId: loggedInUserDetails._id,
    });
    return memberIfPart && memberIfPart.status;
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
          setClanBilletList([...billetList]);
          setclanCollection(response);
          dispatch(setCollectionList(response));
        }
      );
    }
  }

  function loadFollowers() {
    RelationsInterface.getRelations({
      to: clanName,
    })
      .then((success) => {
        setClanFollowers(_.map(success.data.data, "from"));
      })
      .catch((err) => {});
  }

  function fetchNotifications() {
    NotificationInterface.getNotifications({
      to: loggedInUserDetails.userName,
    }).then((signatures) => {
      let response = _.get(signatures, "data.data");
      setClanNotifications(response);
      console.log(response);
    });
  }

  const selectWalletHandler = (seletedWallet) => {
    console.log("seletedWallet ==> ", seletedWallet);
    setWalletState({
      ...walletState,
      selectedWallet: seletedWallet,
      trasactionList: DummyTransactionList,
    });
  };

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
                  <Col md="2" className="clanPane w-100 flex-column h-100">
                    <div className="profile-section d-flex flex-column">
                      {/* <div className="separatorline"></div> */}

                      <img
                        src={clan.thumbnail}
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
                      <div className="d-flex justify-content-center master-grey mt-1"></div>
                    </div>
                    <div className="profile-info">
                      <Row className="d-flex justify-content-center align-items-center">
                        <span className="master-header userName">
                          {_.get(clan, "name")}
                        </span>
                      </Row>
                    </div>
                    <Row>
                      <div className="clan-members mt-5">
                        <Row className="d-flex ">
                          <span className="master-grey">Members</span>
                        </Row>
                      </div>
                    </Row>
                  </Col>

                  <Col
                    className={
                      isMyClan()
                        ? "tabs-wrapper mt-3 col-md-8"
                        : "tabs-wrapper mt-3 col-md-10"
                    }
                  >
                    <Row className="profile-details">
                      <Col md="11" className="">
                        <Row className="d-flex align-content-center justify-content-center h-100">
                          {_.isEmpty(loggedInUserDetails.bio) && isMyClan() ? (
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
                        {!isMyClan() && (
                          <Row className="justify-content-end pr-3 cursor-pointer color-secondary mb-1">
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

                        <Row className="justify-content-end pr-3 cursor-pointer color-secondary mb-1">
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
                      </Col>
                    </Row>
                    <Tabs
                      id="controlled-tab-example"
                      activeKey={key}
                      onSelect={(k) => setKey(k)}
                    >
                      {isMyClan() ? (<Tab eventKey="Actions" title="Actions">
                        testing actions
                      </Tab>): <div></div>}
                      <Tab eventKey="collections" title="Collection">
                        <div className="collection-wrapper"></div>
                      </Tab>
                      
                      {isMyClan() ? (
                        <Tab eventKey="Wallet" title="Wallets">
                          <div className="wallet-wrapper">
                            {WalletData.map((wallet, index) => (
                              <Wallet
                                key={index}
                                {...wallet}
                                selectWalletHandler={selectWalletHandler}
                              />
                            ))}
                          </div>
                          <div className="transaction-wrapper">
                            {
                              <Transactions
                                transactionList={walletState.trasactionList}
                                transactionType={walletState.selectedWallet}
                              />
                            }
                          </div>
                        </Tab>
                      ) : (
                        <div></div>
                      )}
                    </Tabs>
                  </Col>
                  {isMyClan() ? (
                    <Col
                      md="2"
                      className="notification-wrapper mt-1 flex-column h-100"
                    >
                      <span className="second-grey notification-title pl-2">
                        Notifications
                      </span>
                      <hr></hr>
                      <NotificationPanel
                        myNotifications={clanNotifications}
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

export default Clan;
