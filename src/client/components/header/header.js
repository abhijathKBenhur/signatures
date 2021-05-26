import React, { useState } from "react";
import { Button, Dropdown, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import logo from "../../../assets/logo/signatures.png";
import LoginModal from "../../modals/login-modal/loginModal";
import _ from "lodash";
import { User } from "react-feather";
import "./header.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";
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
  }

  function gotoGallery() {
    history.push("/home");
  }

  function gotoPortfolio() {
    history.push("/profile");
  }

  function connectWallet() {}

  const [showCreateModal, setShowCreateModal] = useState(false);
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
      <User size={35} color="black"></User>
    </a>
  ));

  return (
    <div>
      <nav className="navbar navbar-light bg-light flex-md-nowrap shadow appHeader">
        <Container>
          <a className="navbar-brand" target="_blank" rel="noopener noreferrer">
            <img
              src={logo}
              width="50"
              height="50"
              alt=""
              onClick={() => gotoGallery()}
            ></img>
          </a>
          <Dropdown>
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
          </Dropdown>
        </Container>
      </nav>
    </div>
  );
};

export default Header;
