import React, { useState, useEffect } from "react";
import { Button, Image, Form, Nav } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import logo from "../../../assets/logo/signatures.png";
import _ from "lodash";
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
const Header = (props) => {
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
    console.log("getting user ingo");
    connectWallet();
  }, []);

  useEffect(() => {
    refreshUserDetails();
  }, [currentMetamaskAccount]);

  function refreshUserDetails() {
    if (!_.isEmpty(currentMetamaskAccount)) {
      UserInterface.getUserInfo({ metamaskId: currentMetamaskAccount })
        .then((userDetails) => {
          store.dispatch(setReduxUserDetails(_.get(userDetails, "data.data")));
          setLoggedInUserDetails(_.get(userDetails, "data.data"));
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
    loggedInUserDetails.userName ?
    history.push( "/profile/"+ loggedInUserDetails.userName) :
    setShowRegisterPopup(true)
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
    
    if(!window.location.href.includes('create')) {
     return  (
        <Button
          variant="primary"
          className="button uploadButton"
          bsstyle="primary"
          onClick={() => {
            createnew();
          }}
        >
          Publish Idea
        </Button>
      )
    }
    return null
  }
  const hideModal = (type) => {
    setShowRegisterPopup(false)
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

           {!_.isEmpty(currentMetamaskAccount) &&  <div className="right-section">
            <span className="loggedinaccount secondary-grey color-white" title={currentMetamaskAccount} onClick={() => {
              window.open("https://mumbai.polygonscan.com/address/" + currentMetamaskAccount);
            }}>
              {getShortAddress(currentMetamaskAccount,4)}
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
            { _.isEmpty(loggedInUserDetails) ? (
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
            ) : 
                isUserAuthForPublish()
            }
            {_.isEmpty(loggedInUserDetails.imageUrl) ? (
              <User color="white"
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
          </div>}
        </Container>
      </nav>
      <Register show={showRegisterPopup} onHide={() => hideModal()}></Register>
    </div>
  );

 
};

export default Header;
