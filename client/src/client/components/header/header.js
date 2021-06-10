import React, { useState } from "react";
import { Button, Dropdown, Form, Nav } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import logo from "../../../assets/logo/signatures.png";
import LoginModal from "../../modals/login-modal/loginModal";
import _ from "lodash";
import { User, Plus, Search } from "react-feather";
import "./header.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";
import BlockchainInterface from "../../interface/BlockchainInterface";
const Header = (props) => {
  let history = useHistory();

  function logoutUser() {
    console.log("logging out");
    localStorage.removeItem("userInfo");
    toast.error("Logged out!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
  const [showLoginModal, setShowLoginModal] = useState(false);
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
                width="50"
                height="50"
                alt=""
                onClick={() => gotoGallery()}
              ></img>
            </a>

            <Nav.Item>
              <Nav.Link
                active={appLocation == "home"}
                onClick={() => {
                  gotoGallery();
                }}
              >
                Discover
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={appLocation == "profile"}
                onClick={() => {
                  gotoPortfolio();
                }}
              >
                Collection
              </Nav.Link>
            </Nav.Item>
          </div>
          <div className="middle-section">
            {/* <Form.Control size="sm" type="text" placeholder="Normal text" /> */}
          </div>

          <div className="right-section">
            {/* <Button
              variant="danger"
              className="button"
              bsstyle="primary"
              onClick={() => {
                connectWallet();
              }}
            >
              Connect
            </Button> */}

            <Button
              variant="danger"
              className="button"
              bsstyle="primary"
              onClick={() => {
                createnew();
              }}
            >
              Create
            </Button>

            <User
              className="cursor-pointer header-icons"
              onClick={() => {
                gotoPortfolio();
              }}
            ></User>

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
