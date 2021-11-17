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
import StatsInterface from "../../interface/StatsInterface";
import NotificationInterface from "../../interface/NotificationInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { ExternalLink, Award, User } from "react-feather";
import Clans from "./Clan/Clans";
import ShareModal from "../../modals/share/share.modal";
import { getShortAddress } from "../../commons/common.utils";
import Collections from "./collections";
import SendMessage from "../../modals/send-message/send-message";
import EditProfile from "../../modals/edit-profile/edit-profile";
import PeopleList from "../../modals/people-list/people-list";
import CreateClan from "../../modals/create-clan/create-clan";
import UserInterface from "../../interface/UserInterface";
import * as reactShare from "react-share";
import Wallet from "../../components/wallet/wallet";
import Transactions from "../../components/transactions/transaction";
import RelationsInterface from "../../interface/RelationsInterface";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
import EmitInterface from "../../interface/emitInterface";
function Profile(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const {
    metamaskID = undefined,
    userDetails = {},
    collectionList = [],
  } = reduxState;

  const [profileCollection, setProfileCOllection] = useState([]);

  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [followers, setFollowers] = useState(undefined);
  const [upvotesCount, setUpvotesCount] = useState(0);
  const [myNotifications, setMyNotifications] = useState([]);
  const [billetList, setBilletList] = useState([]);
  const [mobileView, setMobileView] = useState([]);
  const [upvottedList, setUpvottedList] = useState([]);

  let history = useHistory();
  const [key, setKey] = useState("collections");
  const viewUser = _.get(window.location, "pathname").split("profile/")[1];
  const dispatch = useDispatch();
  const [modalShow, setShowModal] = useState({
    editProfile: false,
    createClan: false,
    sendMessage: false,
    shareProfile: false,
    showPeopleList: false,
    showFollowers: false
  });

  useEffect(() => {
    if (_.get(history, "location.state.showCollections")) {
      setKey("collections");
    }
    let subscription = EmitInterface.getMessage().subscribe((event) => {
      switch (event.id) {
        case "SHOW_NOTIFICAION":
          setMobileView(true);
          break;
        default:
          break;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const { userDetails = {} } = reduxState;

    if (viewUser && !isMyPage()) {
      let payLoad = {};
      payLoad.userName = viewUser;
      getUserDetails(payLoad);
    } else if (userDetails && (!viewUser || isMyPage())) {
      //own profile page
      setLoggedInUserDetails(userDetails);
    }
    setMobileView(_.get(history, "location.state.mobileView"));
    console.log("userDetails = ", userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    fetchSignatures(loggedInUserDetails.userName);
    if (loggedInUserDetails.userName) {
      fetchNotifications();
      loadFollowers();
      getStats();
    }
    setKey("collections");

    // if (!isMyPage() || _.get(history, "location.state.showCollections")) {
    //   loadFollowers();
    // } else {
    //   setKey("wallet");
    // }
  }, [loggedInUserDetails]);

  const getStats = () => {
    StatsInterface.getTotalUpvotesForUser({
      userName: loggedInUserDetails._id,
    }).then((success) => {
      let upvotedUsers = [];
      _.forEach(_.get(success, "data.data"), (item) => {
        _.forEach(item, (val) => {
          if (upvotedUsers.indexOf(val.from) == -1) {
            upvotedUsers.push(val.from);
          }
        });
      });
      setUpvottedList(upvotedUsers);
      setUpvotesCount(_.get(success, "data.data").length);
    });
  };

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
        }
      );
    }
  }

  function loadFollowers() {
    RelationsInterface.getRelations({
      to: viewUser,
    })
      .then((success) => {
        setFollowers(_.map(success.data.data, "from"));
      })
      .catch((err) => {});
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

  function gotoHome() {
    history.push("/home");
  }

  function followUser() {
    if (followers.indexOf(userDetails.userName) < 0) {
      RelationsInterface.postRelation(
        userDetails.userName,
        viewUser,
        CONSTANTS.ACTIONS.FOLLOW,
        CONSTANTS.ACTION_STATUS.PENDING,
        "I would like to follow you.",
        {
          creditorAddress: loggedInUserDetails.metamaskId,
        }
      ).then((success) => {
        let newFollowlist = _.concat(followers, [userDetails.userName]);
        setFollowers(newFollowlist);
        NotificationInterface.postNotification(
          loggedInUserDetails._id,
          viewUser,
          CONSTANTS.ACTIONS.FOLLOW,
          CONSTANTS.ACTION_STATUS.PENDING,
          userDetails.userName + " followed you."
        );
      });
    } else {
      RelationsInterface.removeRelation(
        userDetails.userName,
        viewUser,
        CONSTANTS.ACTIONS.FOLLOW
      ).then((success) => {
        let followeIndex = followers.indexOf(userDetails.userName);
        let followersCopy = _.clone(followers);
        followersCopy.splice(followeIndex, 1);
        setFollowers(followersCopy);
      });
    }
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
                <Col md="12" className="p-0 d-flex-mobile">
                  <Col
                    md="2"
                    className={`userPane w-100 flex-column h-10 ${
                      mobileView ? "display-none" : ""
                    }`}
                  >
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
                      <div className="d-flex justify-content-center master-grey mt-1"></div>
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
                            {getShortAddress(
                              _.get(loggedInUserDetails, "metamaskId"),
                              4
                            )}
                          </span>
                          <i
                            className="fa fa-external-link ml-2"
                            onClick={() => {
                              window.open(
                                "https://mumbai.polygonscan.com/address/" +
                                  _.get(loggedInUserDetails, "userName")
                              );
                            }}
                          ></i>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {followers && (
                            <span className="address-value third-header justify-content-center d-flex mt-2 cursor-pointer" onClick={() =>{
                              setShowModal({
                                ...modalShow,
                                showFollowers: true,
                              });
                            }}>
                              {followers.length} followers.
                            </span>
                          )}
                        </Col>
                      </Row>
                    </div>
                    {isMyPage() ? (
                      <div className="actions mt-4">
                        <OverlayTrigger
                          key={"editProfile"}
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-top`}>Edit Profile</Tooltip>
                          }
                        >
                          <Button
                            variant="primary"
                            className="button"
                            bsstyle="primary"
                            onClick={() => {
                              setShowModal({ ...modalShow, editProfile: true });
                            }}
                          >
                            <i className="fa fa-pencil mr-1"> </i>
                            <span class=" ">Edit Profile</span>
                          </Button>
                        </OverlayTrigger>

                        {/* <OverlayTrigger
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
                        </OverlayTrigger> */}
                      </div>
                    ) : (
                      <div className="sharables d-flex">
                        {userDetails.facebookUrl && (
                          <reactShare.FacebookShareButton
                            url={userDetails.facebookUrl}
                            quote={"Hey! Check out this idea."}
                          >
                            <div className="social-icon-wrapper fb">
                              <i class="fa fa-facebook" aria-hidden="true"></i>
                            </div>
                            {/* <reactShare.FacebookIcon size={32} round /> */}
                          </reactShare.FacebookShareButton>
                        )}
                        {userDetails.twitterUrl && (
                          <reactShare.TwitterShareButton
                            url={userDetails.twitterUrl}
                            title={"Hey! Check out this idea."}
                          >
                            <div className="social-icon-wrapper twitter ml-2">
                              <i class="fa fa-twitter" aria-hidden="true"></i>
                            </div>
                            {/* <reactShare.TwitterIcon size={32} round /> */}
                          </reactShare.TwitterShareButton>
                        )}
                        {userDetails.instaUrl && (
                          <reactShare.WhatsappShareButton
                            url={userDetails.instaUrl}
                            title={"Hey! Check out this idea."}
                            separator=":: "
                          >
                            <div className="social-icon-wrapper whatsapp ml-2">
                              <i class="fa fa-instagram" aria-hidden="true"></i>
                            </div>
                            {/* <reactShare.WhatsappIcon size={32} round /> */}
                          </reactShare.WhatsappShareButton>
                        )}
                        {userDetails.linkedInUrl && (
                          <reactShare.LinkedinShareButton
                            url={userDetails.linkedInUrl}
                          >
                            <div className="social-icon-wrapper linkedin ml-2">
                              <i class="fa fa-linkedin" aria-hidden="true"></i>
                            </div>
                            {/* <reactShare.LinkedinIcon size={32} round /> */}
                          </reactShare.LinkedinShareButton>
                        )}
                      </div>
                    )}

                    <Row className="mt-3">
                      <Col
                        md="6"
                        className="d-flex flex-column align-items-center stats-entry"
                      >
                        <span className="stats-title master-grey">
                          {billetList.length}
                        </span>
                        <span className="stats-value second-grey  text-center">
                          Ideas
                        </span>
                      </Col>
                      <Col
                        md="6"
                        className="d-flex flex-column align-items-center stats-entry"
                      >
                        <span className="stats-title master-grey cursor-pointer" onClick={() => {
                            if (upvotesCount > 0) {
                              setShowModal({
                                ...modalShow,
                                showPeopleList: true,
                              });
                            }
                          }}>
                          {upvotesCount}
                        </span>
                        <span
                          className="stats-value second-grey  text-center"
                          onClick={() => {
                            if (upvotesCount > 0) {
                              setShowModal({
                                ...modalShow,
                                showPeopleList: true,
                              });
                            }
                          }}
                        >
                          Upvotes
                        </span>
                      </Col>
                    </Row>
                    <div className="p-2 mt-3 text-center color-secondary">
                      {_.isEmpty(loggedInUserDetails.bio) && isMyPage() ? (
                        <div className="d-flex justify-content-center text-center">
                          <span className="second-grey">
                            Your profile might need more information. Please try
                            <span
                              className="cursor-pointer color-primary"
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
                        </div>
                      ) : (
                        <span className="second-grey">
                          {" "}
                          {loggedInUserDetails.bio}{" "}
                        </span>
                      )}
                    </div>
                    {/* <div className="d-flex justify-self-end logout align-content-center cursor-pointer" style={{position:"absolute", bottom:"10px"}}>
                      <i className="fa fa-power-off second-grey"></i>
                      <span className="second-grey ml-1">logout</span>
                    </div> */}
                  </Col>

                  <Col
                    className={`
                      ${
                        isMyPage()
                          ? "tabs-wrapper mt-3 col-md-8"
                          : "tabs-wrapper mt-3 col-md-10"
                      }
                        ${mobileView ? "display-none" : ""}
                    `}
                  >
                    <Row className="profile-details">
                      <Col md="11">
                        {isMyPage() ? (
                          <Wallet className=""></Wallet>
                        ) : (
                          <div></div>
                        )}
                        <Tabs
                          id="controlled-tab-example"
                          activeKey={key}
                          onSelect={(k) => setKey(k)}
                          className=""
                        >
                          <Tab
                            eventKey="collections"
                            title="Collection"
                            tabClassName="tab_category"
                          >
                            <div className="collection-wrapper">
                              <div className="middle-block">
                                {_.isEmpty(profileCollection) ? (
                                  <Col
                                    md="12"
                                    className="empty-collection d-flex flex-column align-items-center "
                                  >
                                    <Row>
                                      <span className="second-grey">
                                        You currently do not own any billets.
                                        <span
                                          className="cursor-pointer color-primary"
                                          onClick={() => {
                                            createnew();
                                          }}
                                        >
                                          {" "}
                                          Mint
                                        </span>{" "}
                                        an idea or{" "}
                                        <span
                                          className="cursor-pointer color-primary"
                                          onClick={() => {
                                            gotoHome();
                                          }}
                                        >
                                          buy
                                        </span>{" "}
                                        one
                                      </span>
                                    </Row>
                                  </Col>
                                ) : (
                                  <Collections
                                    collectionList={profileCollection}
                                  />
                                )}
                              </div>
                            </div>
                          </Tab>
                        </Tabs>
                      </Col>
                      <Col md="1">
                        {!isMyPage() && (
                          <Row className="justify-content-end pr-3 cursor-pointer color-primary mb-1">
                            {userDetails.userName && (
                              <OverlayTrigger
                                key={"sendMessage"}
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
                            )}
                          </Row>
                        )}

                        <Row className="justify-content-end pr-3 cursor-pointer color-primary mb-1">
                          <OverlayTrigger
                            key={"share"}
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
                        {!_.isUndefined(followers) &&
                          userDetails.userName &&
                          !isMyPage() && (
                            <Row className="justify-content-end pr-3 cursor-pointer color-primary mb-1">
                              <OverlayTrigger
                                key={"follow"}
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-top`}>
                                    {followers.indexOf(userDetails.userName) >
                                    -1
                                      ? "Following"
                                      : "Follow User"}
                                  </Tooltip>
                                }
                              >
                                <Button
                                  variant="action"
                                  className={
                                    followers.indexOf(userDetails.userName) > -1
                                      ? "following"
                                      : ""
                                  }
                                  onClick={() => {
                                    followUser();
                                  }}
                                >
                                  <i className="fa fa-user-plus"></i>
                                </Button>
                              </OverlayTrigger>
                            </Row>
                          )}
                      </Col>
                    </Row>
                  </Col>
                  {isMyPage() ? (
                    <Col
                      className={`notification-wrapper mt-1 flex-column h-100 ${
                        mobileView ? "col-md-12" : "col-md-2"
                      }`}
                    >
                      <span className="second-grey notification-title pl-2">
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
          onupdate={(params) => {
            setLoggedInUserDetails(_.get(params, "profileData.data"));
          }}
          onHide={() => setShowModal({ ...modalShow, editProfile: false })}
        />
      )}
      {modalShow.showPeopleList && (
        <PeopleList
          action="Upvoted By"
          userDetails={loggedInUserDetails}
          list={upvottedList}
          show={modalShow.showPeopleList}
          onHide={() => setShowModal({ ...modalShow, showPeopleList: false })}
        />
      )}
      {modalShow.showFollowers && (
        <PeopleList
          action="Followers"
          userDetails={loggedInUserDetails}
          list={followers}
          show={modalShow.showFollowers}
          onHide={() => setShowModal({ ...modalShow, showFollowers: false })}
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
