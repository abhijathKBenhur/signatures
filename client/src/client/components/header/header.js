import React, { useState, useEffect } from "react";
import { Button, Image, Form, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
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
import MongoDBInterface from "../../interface/MongoDBInterface";
import { setReduxUserDetails } from "../../redux/actions";
import { showToaster } from "../../commons/common.utils";
const Header = (props) => {
  let history = useHistory();
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, userDetails = {} } = reduxState;
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    metamaskID
  );
  const [currentUserDetails, setCurrentUserDetails] = useState(userDetails);

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
      MongoDBInterface.getUserInfo({ metamaskId: currentMetamaskAccount })
        .then((userDetails) => {
          store.dispatch(setReduxUserDetails(_.get(userDetails, "data.data")));
          setCurrentUserDetails(_.get(userDetails, "data.data"));
        })
        .catch((success) => {
          setCurrentUserDetails({});
          store.dispatch(setReduxUserDetails({}));
        });
    }
  }

  function logoutUser() {
    console.log("logging out");
    localStorage.removeItem("userInfo");
    showToaster("Logged out!", {type: 'error'})
    window.location.reload();
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
    history.push("/profile");
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
    if(!window.location.href.includes('create') && !_.isEmpty(userDetails)) {
     return  (
        <Button
          variant="primary"
          className="button"
          bsstyle="primary"
          onClick={() => {
            createnew();
          }}
        >
          Register your Idea
        </Button>
      )
    }
    return null
  }

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
            </a>
            <SearchBar />
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

          <div className="right-section">
            <span className="loggedinaccount">{currentMetamaskAccount}</span>
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
            {_.isEmpty(currentMetamaskAccount) || _.isEmpty(currentUserDetails) ? (
              <Button
                variant="primary"
                className="button"
                bsstyle="primary"
                onClick={() => {
                  gotoPortfolio();
                }}
              >
                Connect Wallet
              </Button>
            ) : 
                isUserAuthForPublish()
            }

            {_.isEmpty(currentUserDetails.imageUrl) ? (
              <User
                className="cursor-pointer header-icons"
                onClick={() => {
                  gotoPortfolio();
                }}
              ></User>
            ) : (
              <Image
                className="cursor-pointer header-icons"
                src={currentUserDetails.imageUrl}
                roundedCircle
                width="20px"
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
        </Container>
      </nav>
    </div>
  );
};

export default Header;
