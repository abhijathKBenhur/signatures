import React, { useState, useEffect } from "react";
import { Button, Image, Form, Nav, DropdownButton, Dropdown } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import logo from "../../../assets/logo/logo_blue.png";
import _, { isEmpty } from "lodash";
import { User, Plus, Search } from "react-feather";
import "./header.scss";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";
import BlockchainInterface from "../../interface/BlockchainInterface";
import store from "../../redux/store";
import { shallowEqual, useSelector } from "react-redux";
import SearchBar from "../searchBar/SearchBar";
import SignatureInterface from "../../interface/SignatureInterface";
import UserInterface from "../../interface/UserInterface";
import { setReduxUserDetails } from "../../redux/actions";
import { showToaster } from "../../commons/common.utils";
import Register from "../../modals/Register/Register";
import { getShortAddress } from "../../commons/common.utils";
import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import CONSTANTS from "../../commons/Constants";
import AlertBanner from "../alert/alert";
import ReactDOM from 'react-dom';
import { func } from "prop-types";
import EmitInterface from "../../interface/emitInterface";
import CommentsInterface from "../../interface/CommentsInterface";
import reactGA from "react-ga";

import TransactionsInterface from "../../interface/TransactionInterface";
const Header = (props) => {
  const decoder = jwt_decode;
  const cookies = new Cookies();
  const appConstants = CONSTANTS
  let history = useHistory();
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, userDetails = {} } = reduxState;
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    metamaskID
  );
  const [loggedInUserDetails, setLoggedInUserDetails] = useState(userDetails);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [menu, setMenu] = useState({
    showMenu: false,
    showNotification: false
  });
  const [pathName, setPathName] = useState(false);

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  useEffect(() => {
    if (_.isEmpty(currentMetamaskAccount)) {
      connectWallet();
    }
    updatePendingTransactions()
    setPathName(window.location.pathname)
    addDefaultHashtags();

    reactGA.initialize("UA-207963115-1");
    reactGA.pageview("Subscribe Page");
  }, []);

  useEffect(() => {
    setPathName(window.location.pathname)
  }, [appLocation]);

  useEffect(() => {
    refreshUserDetails();
  }, [currentMetamaskAccount]);


  function addDefaultHashtags() {
    CommentsInterface.getHashTags().then((res) => {
      if(_.isEmpty(_.get(res, 'data.data'))){
        let defaultValues = ["Apparel", "App", "Art", "Book", "Business", "Research", "Craft", "Design", "Discovery", "DIY", "Engineering", "Equipment", "Fashion", "Fitness", "Home", "Invention", "Jewelry", "Logo", "Lyrics", "Material", "Meme", "Method", "Music", "Painting", "Photo", "Phrase", "Poem", "Process", "Product", "Recipe", "Science", "Screenplay", "Script", "Society", "Song", "Sound", "Story", "System", "Technology", "Theme", "Thesis", "Thought", "Tune", "Video", "Word"];
        _.forEach(defaultValues, item=>{
          CommentsInterface.postHashtag({hashtag: item})
        })
      }
    })
  }

  function updatePendingTransactions() {
    console.log("inside pending")
    TransactionsInterface.getTransactions({
      status: CONSTANTS.ACTION_STATUS.PENDING,
      type: CONSTANTS.ACTIONS.POST_IDEA
    }).then(result=> {
      let web3 = BlockchainInterface.retrieveWeb3();
        _.forEach(_.get(result, 'data.data'), (item) => {
          web3.eth.getTransaction(item.transactionID).then(tx =>{
            web3.eth.call(tx, tx.blockNumber).then(res => {
            TransactionsInterface.setTransactionState({
              transactionID:item.transactionID,
              status: CONSTANTS.ACTION_STATUS.COMPLETED,
              user: userDetails._id
            })
            }).catch(error =>{
              TransactionsInterface.setTransactionState({
                transactionID:item.transactionID,
                status: CONSTANTS.ACTION_STATUS.FAILED,
                user: userDetails._id
              })
            })
          }).catch(hashError =>{
            console.log(hashError)
          })
        })
      console.log(result)
    })
  }
  function manageCookies(userData) {
    let authToken = cookies.get(appConstants.COOKIE_TOKEN_PHRASE);
    let decoded = {};
    let reRequestSignature = false;
    if (!_.isEmpty(authToken) || authToken != "undefined") {
      try {
        decoded = decoder(authToken);
      } catch (err) {
        console.log("couldnt decode")
        reRequestSignature = true;
      }
      if (_.get(decoded, "metamaskId") != userData.metamaskId) {
        console.log("id mismatch")
        reRequestSignature = true;
      }
    }
    if (_.isEmpty(authToken) || authToken == "undefined") {
      console.log("authToken mismatch")
      reRequestSignature = true;
    }
    if (reRequestSignature) {
      UserInterface.renewNonce({
        metamaskId: userData.metamaskId,
      })
        .then((success) => {
          let nonce = _.get(success, "data.data.nonce");
          BlockchainInterface.signToken(nonce).then((secret) => {
            BlockchainInterface.verifySignature({
              nonce,
              secret,
            }).then((success) => {
              let token = _.get(success, "data.data.token");
              const cookies = new Cookies();
              console.log("setting token :: " +  token)
              cookies.set(appConstants.COOKIE_TOKEN_PHRASE, token);
              console.log("verified cookies token")
            });
          }).catch((err) => {
            const alertProperty = {
              isDismissible: false,
              variant: "danger",
              content: "Your account is not signed with metamask.",
              actionText: "Sign",
              actionFunction: manageCookies
            }
            ReactDOM.render(<AlertBanner {...alertProperty}></AlertBanner>, document.querySelector('.appHeader'))
          });
        })
        
    }
  }

  function refreshUserDetails() {
    if (!_.isEmpty(currentMetamaskAccount)) {
      UserInterface.getUserInfo({ metamaskId: currentMetamaskAccount })
        .then((userDetails) => {
          let userData = _.get(userDetails, "data.data");
          store.dispatch(setReduxUserDetails(userData));
          setLoggedInUserDetails(userData);
          manageCookies(userData);
        })
        .catch((success) => {
          setLoggedInUserDetails({});
          store.dispatch(setReduxUserDetails({}));
        });
    }
  }

  function createnew() {
    history.push("/create");

  reactGA.event({
    category: "Button",
    action: "CLICK_MINT",
    label: "Clicked mint button",
  });
    setAppLocatoin("create");
  }

  function gotoGallery() {
    setAppLocatoin("home");
    history.push("/home");
  }

  function gotoPortfolio() {
    setAppLocatoin("profile");
    loggedInUserDetails.userName
      ? history.push("/profile/" + loggedInUserDetails.userName)
      : setShowRegisterPopup(true);
  }

  function connectWallet() {
    BlockchainInterface.getAccountDetails()
      .then((succ) => {})
      .catch((err) => {});
  }

  function openOption(e) {
    setMenu({ ...menu, showMenu: !menu.showMenu});
  }

  const [appLocation, setAppLocatoin] = useState("home");
  // const [loggedUserInfo, setLoggedUserInfo] = useState(undefined);

  const ProfileDropDown = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <User className="cursor-pointer header-icons"></User>
    </a>
  ));

  const isUserAuthForPublish = () => {
    if (!window.location.href.includes("create")) {
      return (
        <Button
          variant="ternary"
          className="button uploadButton"
          bsstyle="primary"
          onClick={() => {
            createnew();
          }}
        >
          Mint Idea
        </Button>
      );
    }
    return null;
  };
  const hideModal = (type) => {
    setShowRegisterPopup(false);
  };
  const gotoProfile = (isMobileView) => {
    setMenu({ ...menu, showMenu: false, showNotification: false});
    setAppLocatoin("profile");
    loggedInUserDetails.userName
      ? history.push({pathname: "/profile/" + loggedInUserDetails.userName, state: {mobileView: isMobileView}})
      : setShowRegisterPopup(true);
  }

  const gotoHome = () => {
    gotoGallery(true); 
    setMenu({...menu, showMenu: false, showNotification: false})
  }

  const gotoNotification = () => {
    setMenu({ ...menu, showMenu: false, showNotification: true});
    EmitInterface.sendMessage('SHOW_NOTIFICAION');
  }

  const gotoComments = () => {
    setMenu({...menu, showMenu: false})
    EmitInterface.sendMessage('SHOW_COMMENTS');
  }

  const isIdeaPage = () => {
    return window.location.pathname.indexOf("signature") > -1;
  }

  const redirectTo = (route) => {
    setMenu({ ...menu, showMenu: false});
    history.push(route);
  }

  return (
    <div>
      <nav className="navbar navbar-light bg-light flex-md-nowrap shadow appHeader justify-content-center">
        <Container fluid>
          <div className="left-section">
            <a
              className="navbar-brand cursor-pointer d-flex align-items-center"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => gotoGallery()}
            >
              <img
                src={logo}
                width="45"
                height="45"
                alt=""
                className=""
              ></img>
              <span class="second-header logo_text color-white ml-2">IdeaTribe</span>
            </a>
            {/* <SearchBar /> */}
            {/* <Nav.Item>
              <Nav.Link
                active={appLocation == "home"}
                onClick={() => {
                  gotoGallery();
                }}
              >
                Discover
              </Nav.Link>
            </Nav.Item> */}
            {/* <Nav.Item>
              <Nav.Link
                active={appLocation == "profile"}
                onClick={() => {
                  gotoPortfolio();
                }}
              >
                Collection
              </Nav.Link>
            </Nav.Item> */}
          </div>
          <div className="middle-section">
            {/* <Form.Control size="sm" type="text" placeholder="Normal text" /> */}
          </div>

          {!_.isEmpty(currentMetamaskAccount) && (
            <div className="right-section">
              <span
                className="loggedinaccount secondary-grey color-white"
                title={currentMetamaskAccount}
                onClick={() => {
                  window.open(
                    "https://mumbai.polygonscan.com/address/" +
                      currentMetamaskAccount
                  );
                }}
              >
                {getShortAddress(currentMetamaskAccount, 4)}
              </span>
              {/* <Button
              variant="secondary"
              className="button"
              bsstyle="primary"
              onClick={() => {
                connectWallet();
              }}
            >
              Connect
            </Button> */}
              {_.isEmpty(loggedInUserDetails) ? (
                <Button
                  variant="ternary"
                  className="button"
                  bsstyle="primary"
                  onClick={() => {
                    reactGA.event({
                      category: "Button",
                      action: "REGISTER_BUTTON",
                      label: "Clicked register button",
                    });
                    gotoPortfolio();
                  }}
                >
                  Sign Up
                </Button>
              ) : (
                isUserAuthForPublish()
              )}
              {!_.isEmpty(loggedInUserDetails.imageUrl) && (
                <Image
                  className="cursor-pointer header-icons desktop-view"
                  src={loggedInUserDetails.imageUrl}
                  roundedCircle
                  width="36px"
                  onClick={() => {
                    gotoPortfolio();
                  }}
                ></Image>
              )
            }
            <i className="fa fa-bars responsive-icons mobile-view" onClick={(e) => openOption()}></i>

              {/* <Dropdown>
              <Dropdown.Toggle
                as={ProfileDropDown}
                id="dropdown-custom-components"
              />

              <Dropdown.Menu>
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => {
                    createnew();
                  }}
                >
                  Publish
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => {
                    gotoPortfolio();
                  }}
                >
                  Profile
                </Dropdown.Item>

                <Dropdown.Item
                  eventKey="2"
                  onClick={() => {
                    gotoPortfolio();
                  }}
                >
                  Settings
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
            </div>
          )}
        </Container>
      </nav>
      <Register show={showRegisterPopup} onHide={() => hideModal()}></Register>
      {menu.showMenu && <div className="mobile-menu"> 
          {appLocation == "home" && <div className="items" onClick={(e) => gotoProfile(false)}> <i className="fa fa-user"></i>Profile </div>} 
          {appLocation == "home" && <div className="items" onClick={(e) => gotoProfile(true)}> <i className="fa fa-bell"></i>Notification </div>} 
          {(appLocation == "profile" && !menu.showNotification) && <div className="items" onClick={(e) => gotoNotification()}> <i className="fa fa-bell"></i> Notification </div>}
          {(appLocation == "profile" && menu.showNotification) && <div className="items" onClick={(e) => gotoHome(true)}>  Home </div>}
          {(appLocation == "profile" && menu.showNotification) && <div className="items " onClick={(e) => gotoProfile()}><i className="fa fa-user"></i>Profile </div>}

          {isIdeaPage() && <div className="items" onClick={(e) => gotoComments()}> <i className="fa fa-comment"></i> Comments </div>}
          {isIdeaPage() && <div className="items" onClick={(e) => gotoHome(true)}><i className="fa fa-home"></i> Home </div>}
          {/* <div className="items" onClick={(e) => redirectTo("/about")}> <i className="fa fa-info"></i> About IdeaTribe </div>
          <div className="items" onClick={(e) => redirectTo("/Tokenomics")}> <i className="fa fa-dollar"></i>Tokenomics </div>
          <div className="items" onClick={(e) => redirectTo("/FAQ")}> <i className="fa fa-question-circle"></i>FAQs </div>
          <div className="items" onClick={(e) => redirectTo("/about")}> <i className="fa fa-file-text"></i> Terms </div>
          <div className="items" onClick={(e) => redirectTo("/about")}> <i className="fa fa-lock"></i> Privacy </div>
          <div className="items" onClick={(e) => redirectTo("/about")}> <i className="fa fa-comment"></i>Contact Us </div> */}
      </div>}
    </div>
  );
};

export default Header;
