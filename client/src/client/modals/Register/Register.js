import _ from "lodash";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import "./Register.scss";
import "react-step-progress-bar/styles.css";
import { shallowEqual, useSelector } from "react-redux";
import CONSTANTS from "../../commons/Constants";
import { setReduxUserDetails } from "../../redux/actions";
import metamaskLogo from "../../../assets/images/metamask.png";
import coinBaseLogo from "../../../assets/images/coinbase.png";
import MongoDBInterface from "../../interface/MongoDBInterface";
import store from '../../redux/store';
// MetamaskID and userDetails are stored in separate redux stores
// userDetails are stored as state

const Register = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [registrationLevel, setRegistrationLevel] = useState(
    CONSTANTS.REGISTRATION_LEVEL.BASE_1
  );
  const [steps, setSteps] = useState([
    {
      key: "socialLogin",
      label: "My First Step",
      isDone: true,
      index: 0,
    },
    {
      key: "chainAddress",
      label: "My Second Step",
      isDone: false,
      index: 1,
    },
    {
      key: "userID",
      label: "My Final Step",
      isDone: false,
      index: 2,
    },
  ]);
  const [activeStep, setActiveStep] = useState(steps[0]);
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


  function registerUser(){
    MongoDBInterface.registerUser(userDetails).then(success => {
      store.dispatch(setReduxUserDetails(userDetails))
      console.log(success)
    }).catch(error => {
      console.log(error)
    })
  }

  const handleNext = () => {
    if (steps[steps.length - 1].key == activeStep.key) {
      registerUser()
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
      firstName: _.get(googleFormResponseObject.profileObj, "firstName"),
      LastName: _.get(googleFormResponseObject.profileObj, "LastName"),
      email: _.get(googleFormResponseObject.profileObj, "email"),
      fullName: _.get(googleFormResponseObject.profileObj, "fullName"),
      imageUrl: _.get(googleFormResponseObject.profileObj, "imageUrl"),
      loginMode: "google",
    });
    handleNext();
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
              <div>
                <span> You are logged in with </span>
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
                <div
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
                </div>
              </div>
            ) : (
              <div>you are connected with {userDetails.metamaskId}</div>
            )}
          </Col>
        );
        break;
      case "userID":
        return (
          <div>
            <Row className="">
              <Form.Group
                as={Col}
                className="formEntry"
                md="12"
                controlId="userID"
              >
                <Form.Control
                  type="text"
                  name="userID"
                  label="Set your user name"
                  value={userDetails.userID}
                  className={"userID"}
                  placeholder="User name"
                  onChange={handleChange}
                />
              </Form.Group>
            </Row>
          </div>
        );
        break;
    }
  }

  function handleChange(event){
    let returnObj = {};
    returnObj[event.target.name] = _.get(event, 'target.name') === 'price' ? Number(event.target.value):  event.target.value;
    setUserDetails({
      ...userDetails,
      ...returnObj
    })
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
          {activeStep.index == 0 ? (
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
            variant="primary"
            className="button"
            bsstyle="primary"
            onClick={() => {
              handleNext();
            }}
          >
            {activeStep.index == steps.length - 1 ? "Register" : "Next"}
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default Register;
