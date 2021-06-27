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
import coinBaseLogo from "../../../assets/images/coinbase.png";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockchainInterface from "../../interface/BlockchainInterface";
import { Check, X } from "react-feather";
import { useHistory } from "react-router-dom";
import store from "../../redux/store";
// MetamaskID and userDetails are stored in separate redux stores
// userDetails are stored as state

const Register = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [registrationLevel, setRegistrationLevel] = useState(
    CONSTANTS.REGISTRATION_LEVEL.BASE_1
  );
  let history = useHistory();
  const [steps, setSteps] = useState([
    {
      key: "chainAddress",
      label: "Integrate wallet",
      isDone: true,
      index: 0,
    },
    {
      key: "socialLogin",
      label: "Social login",
      isDone: false,
      index: 1,
    },
    {
      key: "userID",
      label: "Pick your username",
      isDone: false,
      index: 2,
    },
  ]);
  const [activeStep, setActiveStep] = useState(steps[0]);
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: _.get(reduxState, "firstName"),
    LastName: _.get(reduxState, "LastName"),
    email: _.get(reduxState, "email"),
    fullName: _.get(reduxState, "fullName"),
    imageUrl: _.get(reduxState, "imageUrl"),
    metamaskId: _.get(reduxState, "metamaskID"),
    userID: _.get(reduxState, "userID"),
    loginMode: _.get(reduxState, "loginMode"),
  });

  function registerUser() {
    BlockchainInterface.register_user(userDetails)
      .then((success) => {
        MongoDBInterface.registerUser(userDetails).then((mongoSuccess) => {
          setRegistered(true);
        });
        console.log(success);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function publishUserToApp() {
    store.dispatch(setReduxUserDetails(userDetails));
  }

  const handleNext = () => {
    if (steps[steps.length - 1].key == activeStep.key) {
      if(registered){
        history.push("/profile");
      }else{
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
    if (index === 0) return;

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
    reEvaluateUserStage();
  }, [reduxState]);

  function reEvaluateUserStage() {
    if (!userDetails.metamaskId) {
      setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_1);
    } else {
      if (!userDetails.email) {
        setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_2);
      } else {
        if (!userDetails.userID) {
          setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_3);
        } else {
          setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_4);
        }
      }
    }
  }

  function googleLogIn(googleFormResponseObject) {
    setUserDetails({
      ...userDetails,
      firstName: _.get(googleFormResponseObject.profileObj, "givenName"),
      LastName: _.get(googleFormResponseObject.profileObj, "familyName"),
      email: _.get(googleFormResponseObject.profileObj, "email"),
      fullName: _.get(googleFormResponseObject.profileObj, "name"),
      imageUrl: _.get(googleFormResponseObject.profileObj, "imageUrl"),
      loginMode: "google",
    });
  }

  function metamaskGuide() {
    let metamaskAvailable = window.ethereum || window.web3;
    if (metamaskAvailable) {
      window.ethereum.enable();
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
      );
    }
  }

  function coinBase() {
    let metamaskAvailable = window.ethereum || window.web3;
    if (metamaskAvailable) {
      window.ethereum.enable();
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
          <div>
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
                <div
                  className="metamaskLogin loginMode d-flex flex-column align-items-center cursor-pointer"
                  onClick={() => {
                    metamaskGuide();
                  }}
                >
                  <img src={metamaskLogo} width="70"></img>
                  <Button
                    variant="secondary"
                    className="button mt-2"
                    bsstyle="primary"
                    onClick={() => {
                      metamaskGuide();
                    }}
                  >
                    Connect Metamask
                  </Button>
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
      case "userID":
        return (
          <div>
            <Row className="">
              {registered ? (
                <div> Hi {userDetails.fullName}, Welcome to the tribe. You have signed up to the unlimited possibilities in the world of idea sharing.</div>
              ) : (
                <Form.Group
                  as={Col}
                  className="formEntry userIDSection"
                  md="12"
                  controlId="userID"
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
                    name="userID"
                    value={userDetails.userID}
                    className={"userID"}
                    placeholder="User name"
                    onChange={handleChange}
                  />
                  {userDetails.userID &&
                  userDetails.userID.length > 0 &&
                  validated ? (
                    <Check></Check>
                  ) : userDetails.userID &&
                    userDetails.userID.length > 0 &&
                    !validated ? (
                    <X></X>
                  ) : (
                    <div></div>
                  )}
                </Form.Group>
              )}
            </Row>
          </div>
        );
        break;
    }
  }

  function handleChange(event) {
    var key = event.keyCode;
    let returnObj = {};
    returnObj[event.target.name] =
      _.get(event, "target.name") === "price"
        ? Number(event.target.value)
        : event.target.value;
    setUserDetails({
      ...userDetails,
      ...returnObj,
    });
    MongoDBInterface.getUserInfo({ userID: event.target.value })
      .then((userDetails) => {
        setValidated(false);
      })
      .catch((error) => {
        setValidated(true);
      });
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
        <Modal.Title>Hi, you are not yet registered with us.</Modal.Title>
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
                  <div className="step-content">
                    Step {i + 1}
                    <br />
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
          {activeStep.index == 0  || registered? (
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
              Back
            </Button>
          )}

          <Button
            disabled={!validated && activeStep.index == 2}
            variant="primary"
            className="button"
            bsstyle="primary"
            onClick={() => {
              handleNext();
            }}
          >
            {activeStep.index == steps.length - 1 ? 
            registered ? "Done" : "Register" 
            : "Next"}
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default Register;
