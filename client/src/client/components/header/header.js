import React, { useState, useEffect } from "react";
import { Button, Image, Form, Nav } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import logo from "../../../assets/logo/signatures.png";
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
import Web3 from "web3";

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
  }, []);

  useEffect(() => {
    refreshUserDetails();
  }, [currentMetamaskAccount]);


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
          Publish Idea
        </Button>
      );
    }
    return null;
  };
  const hideModal = (type) => {
    setShowRegisterPopup(false);
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light flex-md-nowrap shadow appHeader justify-content-center">
        <Container fluid>
          <div className="left-section">
            <a
              className="navbar-brand"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={logo}
                width="35"
                height="35"
                alt=""
                className="cursor-pointer"
                onClick={() => gotoGallery()}
              ></img>

              {/* <span class="master-header color-primary">ideaTribe</span> */}
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
              variant="primary"
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
                  variant="primary"
                  className="button"
                  bsstyle="primary"
                  onClick={() => {
                    gotoPortfolio();
                  }}
                >
                  Register
                </Button>
              ) : (
                isUserAuthForPublish()
              )}
              {_.isEmpty(loggedInUserDetails.imageUrl) ? (
                <User
                  color="white"
                  className="cursor-pointer header-icons"
                  onClick={() => {
                    gotoPortfolio();
                  }}
                ></User>
              ) : (
                <Image
                  className="cursor-pointer header-icons"
                  src={loggedInUserDetails.imageUrl}
                  roundedCircle
                  width="36px"
                  onClick={() => {
                    gotoPortfolio();
                  }}
                ></Image>
              )}

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
    </div>
  );
};

export default Header;
