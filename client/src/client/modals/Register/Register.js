import _ from "lodash";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { Row, Col, Form, Modal, Button, Image } from "react-bootstrap";
import "./Register.scss";
import "react-step-progress-bar/styles.css";
import { shallowEqual, useSelector } from "react-redux";
import CONSTANTS from "../../commons/Constants";
import { setReduxUserDetails } from "../../redux/actions";
import metamaskLogo from "../../../assets/images/metamask.png";
import successLogo from "../../../assets/images/sucess.png";
import SignatureInterface from "../../interface/SignatureInterface";
import BlockchainInterface from "../../interface/BlockchainInterface";
import { Check, RefreshCcw, X } from "react-feather";
import { useHistory } from "react-router-dom";
import store from "../../redux/store";
import UserInterface from "../../interface/UserInterface";
// MetamaskID and userDetails are stored in separate redux stores
// userDetails are stored as state

const Register = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  let history = useHistory();
  const PASSED = "PASSED";
  const FAILED = "FAILED";
  const PENDING = "PENDING";

  const [steps, setSteps] = useState([
    {
      key: "socialLogin",
      label: "Social login",
      isDone: true,
      index: 0,
    },
    {
      key: "chainAddress",
      label: "Integrate wallet",
      isDone: false,
      index: 1,
    },
    {
      key: "userName",
      label: "Pick your username",
      isDone: false,
      index: 2,
    },
  ]);
  const [activeStep, setActiveStep] = useState(steps[0]);
  const [registration, setRegistration] = useState("");

  const [validated, setValidated] = useState(false);
  const [userNameError, setuserNameError] = useState(false);
  const [registrationErrorMessage, setregistrationErrorMessage] = useState("");

  const [userDetails, setUserDetails] = useState({
    firstName: _.get(reduxState, "firstName"),
    lastName: _.get(reduxState, "lastName"),
    email: _.get(reduxState, "email"),
    fullName: _.get(reduxState, "fullName"),
    imageUrl: _.get(reduxState, "imageUrl"),
    metamaskId: _.get(reduxState, "metamaskID"),
    userName: _.get(reduxState, "userName"),
    loginMode: _.get(reduxState, "loginMode"),
    referral: undefined
  });

  function registerUser() {
    try {
      BlockchainInterface.register_user(userDetails)
        .then((success) => {
          let response = success.data;
          if (response.success) {
            UserInterface.registerUser(userDetails).then((mongoSuccess) => {
              setRegistration(PASSED);
            });
            console.log(success);
          } else {
            setRegistration(FAILED);
            setregistrationErrorMessage(response.data);
            console.log(response.data);
          }
        })
        .catch((error) => {
          setRegistration(FAILED);
          setregistrationErrorMessage(error.data);
          console.log(error.data);
        });
    } catch (e) {
      console.log("shiotter", e);
    }
  }

  function publishUserToApp() {
    store.dispatch(setReduxUserDetails(userDetails));
  }

  const handleNext = () => {
    if (steps[steps.length - 1].key == activeStep.key) {
      if (registration == PASSED) {
        publishUserToApp();
        window.location.reload();
      } else {
        setRegistration(PENDING);
        registerUser();
      }
      return;
    }

    const index = steps.findIndex((x) => x.key === activeStep.key);
    setSteps((prevStep) =>
      prevStep.map((x) => {
        if (x.key === activeStep.key) x.isDone = true;
        return x;
      })
    );
    setActiveStep(steps[index + 1]);
  };

  const handleBack = () => {
    const index = steps.findIndex((x) => x.key === activeStep.key);
    if (index === 0) {
      history.push("/home");
    };

    setSteps((prevStep) =>
      prevStep.map((x) => {
        if (x.key === activeStep.key) x.isDone = false;
        return x;
      })
    );
    setActiveStep(steps[index - 1]);
  };

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setUserDetails({
        ...userDetails,
        metamaskId: metamaskID,
      });
    }
  }, [reduxState]);

  function googleLogIn(googleFormResponseObject) {
    setUserDetails({
      ...userDetails,
      firstName: _.get(googleFormResponseObject.profileObj, "givenName"),
      lastName: _.get(googleFormResponseObject.profileObj, "familyName"),
      email: _.get(googleFormResponseObject.profileObj, "email"),
      fullName: _.get(googleFormResponseObject.profileObj, "name"),
      imageUrl: _.get(googleFormResponseObject.profileObj, "imageUrl"),
      loginMode: "google",
      userName: _.get(googleFormResponseObject.profileObj, "email").split("@")[0]
    });
  }

  function metamaskGuide() {
    let metamaskAvailable = window.ethereum || window.web3;
    if (metamaskAvailable) {
      BlockchainInterface.getAccountDetails();
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
      );
    }
  }

  function getConditionalView(stepKey) {
    switch (stepKey) {
      case "socialLogin":
        return (
          <div className="w-100 align-self-center d-flex justify-content-center">
            {_.isEmpty(userDetails.email) ? (
              <GoogleLogin
                //secretKey:I0YMKAriMhc6dB7bN44fHuKj
                clientId="639340003430-d17oardcjjpo9qnj0m02330l5orgn8sp.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={googleLogIn}
                onFailure={googleLogIn}
                cookiePolicy="single_host_origin"
              />
            ) : (
              <div className="d-flex align-items-center flex-column">
                <Image
                  roundedCircle
                  src={userDetails.imageUrl}
                  height={100}
                  className=""
                  style={{
                    background: "#f1f1f1",
                    borderRadius: "7px",
                  }}
                />
                <span> {userDetails.email} </span>
              </div>
            )}
          </div>
        );
        break;
      case "chainAddress":
        return (
          <Col md="12" className="d-flex justify-content-md-around">
            {_.isEmpty(userDetails.metamaskId) ? (
              <div className="network-container">
                <div className="metamaskLogin loginMode d-flex flex-column align-items-center cursor-pointer">
                  <span className="readable-text">
                    We could not recognize any connected wallet on this app.
                    Please install, login with an account and connect to this
                    app to continue.You might have to refresh the page after
                    installation
                  </span>
                  <img src={metamaskLogo} width="70"></img>
                  <div className="metamask_integration">
                    <Button
                      variant="primary"
                      className="button mt-2"
                      bsstyle="primary"
                      onClick={() => {
                        metamaskGuide();
                      }}
                    >
                      Connect wallet
                    </Button>
                    <Button
                      variant="secondary"
                      className="button ml-2 mt-2"
                      size
                      bsstyle="primary"
                      onClick={() => {
                        window.location.reload();
                      }}
                    >
                      <RefreshCcw size={15}></RefreshCcw>
                    </Button>
                  </div>
                  <p className="mt-1"></p>
                </div>
                {/* <div
                  className="coinbaseLogin loginMode d-flex flex-column align-items-center cursor-pointer"
                  onClick={() => {
                    coinBase();
                  }}
                >
                  <img src={coinBaseLogo} width="70"></img>
                  <Button
                    variant="secondary"
                    className="button mt-3"
                    bsstyle="primary"
                    onClick={() => {
                      coinBase();
                    }}
                  >
                    Connect Coinbase
                  </Button>
                </div> */}
              </div>
            ) : (
              <div className="d-flex align-items-center flex-column">
                <img src={metamaskLogo} width="70"></img>
                <div className="connected">Connected</div>
                <div> {userDetails.metamaskId}</div>
              </div>
            )}
          </Col>
        );
        break;
      case "userName":
        return (
          <div className="w-100 d-flex flex-row align-items-center justify-content-center">
              {registration == PASSED ? (
                <div className="d-flex flex-column align-items-center">
                  <div>
                    <img src={successLogo} width="70"></img>
                    <span className="second-grey">Welcome to IdeaTribe</span>
                  </div>
                  <span>
                  Hi {userDetails.fullName} You have
                  signed up to the unlimited possibilities in the world of idea
                  sharing.
                  </span>
                </div>
              ) : registration == FAILED ? (
                <div>
                  {" "}
                  Hi {userDetails.fullName}, We were unable to onboard you to
                  the tribe this time. 
                  <br></br>{registrationErrorMessage}
                </div>
              ) : (
                <>
                  <Form.Group
                    as={Col}
                    className="formEntry userIDSection"
                    md="6"
                    controlId="userName"
                  >
                    <Image
                      roundedCircle
                      src={userDetails.imageUrl}
                      height={100}
                      className=""
                      style={{
                        background: "#f1f1f1",
                        borderRadius: "7px",
                      }}
                    />
                    <Form.Control
                      type="text"
                      name="userName"
                      value={userDetails.userName}
                      className={
                        userNameError ? "username-error userName" : "userName"
                      }
                      placeholder="User name"
                      onChange={handleChange}
                    />
                    {!userNameError &&
                    userDetails.userName &&
                    userDetails.userName.length > 0 &&
                    validated ? (
                      <Check></Check>
                    ) : !userNameError &&
                      userDetails.userName &&
                      userDetails.userName.length > 0 &&
                      !validated ? (
                      <X></X>
                    ) : null}
                  </Form.Group>
                  <Form.Group className="d-flex align-items-center justify-content-end" as={Col}
                    md="6">
                
                    <div>
                    <Form.Control
                      type="text"
                      name="referral"
                      value={userDetails.referral}
                      className={
                        "userName referral"
                      }
                      placeholder="referral code"
                      onChange={(handleChange)}
                    />
                    </div>
                  {/* {userNameError && (
                    <span className="username-error-txt">
                      Invalid username please use lowercase with no special
                      charaters
                    </span>
                  )} */}
                  </Form.Group>
                  
                </>
              )}
          </div>
        );

      default:
        return null;
    }
  }

  function handleChange(event) {
    var key = event.keyCode;
    let returnObj = {};
    const value = String(event.target.value).toLowerCase();
    returnObj[event.target.name] = value;
    setUserDetails({
      ...userDetails,
      ...returnObj,
    });
    if(event.target.name == "userName"){
      if (/^[A-Z0-9]+$/i.test(value)) {
        setuserNameError(false);
        UserInterface.getUserInfo({ userName: value })
          .then((userDetails) => {
            setValidated(false);
          })
          .catch((error) => {
            setValidated(true);
          });
      } else {
        setuserNameError(true);
      }
    }
    
  }

  return (
    <Modal
      show={true}
      dialogClassName="register-modal"
      backdrop="static"
      keyboard={false}
      centered
      showClose="false"
      size="lg"
    >
      <Modal.Header className="d-flex flex-column">
        <Modal.Title>Hi! You are not yet registered with us.</Modal.Title>
        <div className="steps">
          <ul className="nav">
            {steps.map((step, i) => {
              return (
                <li
                  key={i}
                  className={`${activeStep.key === step.key ? "active" : ""} ${
                    step.isDone ? "done" : ""
                  }`}
                >
                  <div className="step-content d-flex align-items-center">
                    <span>{step.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md="12" className="box">
            <div className="step-component">
              {getConditionalView(activeStep.key)}
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Col
          md="12"
          className="d-flex justify-content-between align-items-center "
        >
          {registration == PASSED ? (
            <div></div>
          ) : (
            <Button
              variant="secondary"
              className="button"
              bsstyle="primary"
              onClick={() => {
                handleBack();
              }}
            >
               {activeStep.index == 0
              ? "Cancel"
              : "Back"}
            </Button>
          )}
          <Button
            disabled={
              (!validated && activeStep.index == 2) ||
              registration == PENDING ||
              (_.isEmpty(userDetails.metamaskId) && activeStep.index == 1) ||
              (_.isEmpty(userDetails.email) && activeStep.index == 0) ||
              userNameError
            }
            variant="primary"
            className="button"
            bsstyle="primary"
            onClick={() => {
              handleNext();
            }}
          >
            {activeStep.index == steps.length - 1
              ? registration == PASSED
                ? "Done"
                : "Register"
              : "Next"}
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default Register;
