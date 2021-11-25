import _ from "lodash";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import {
  Row,
  Col,
  Form,
  Modal,
  Button,
  Image,
  CloseButton,
} from "react-bootstrap";
import "./Register.scss";
import "react-step-progress-bar/styles.css";
import { shallowEqual, useSelector } from "react-redux";
import CONSTANTS from "../../commons/Constants";
import { setReduxUserDetails } from "../../redux/actions";
import metamaskLogo from "../../../assets/images/metamask.png";
import successLogo from "../../../assets/images/success.png";
import SignatureInterface from "../../interface/SignatureInterface";
import BlockchainInterface from "../../interface/BlockchainInterface";
import { Check, RefreshCcw, X } from "react-feather";
import { useHistory } from "react-router-dom";
import store from "../../redux/store";
import UserInterface from "../../interface/UserInterface";
import ProgressBar from "../../components/progressbar/progress";
import NotificationInterface from "../../interface/NotificationInterface";
import reactGA from "react-ga";
// MetamaskID and userDetails are stored in separate redux stores
// userDetails are stored as state

const Register = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  let history = useHistory();
  const PASSED = "PASSED";
  const FAILED = "FAILED";
  const PENDING = "PENDING";
  const appConstants = CONSTANTS
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
  const [registrationErrorMessage, setregistrationErrorMessage] = useState("");
  const [referralError, setReferralError] = useState(false);
  const [userNameError, setuserNameError] = useState(false);
  const [userEmailError, setuserEmailError] = useState(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
  }, [reduxState.userDetails]);

  const [userDetails, setUserDetails] = useState({
    firstName: _.get(reduxState, "firstName"),
    lastName: _.get(reduxState, "lastName"),
    email: _.get(reduxState, "email"),
    imageUrl: _.get(reduxState, "imageUrl"),
    metamaskId: _.get(reduxState, "metamaskID"),
    userName: _.get(reduxState, "userName"),
    loginMode: _.get(reduxState, "loginMode"),
    referredBy: sessionStorage.getItem("inviteCode"),
    myReferralCode: (Math.random() + 1).toString(36).substring(7),
    googleJWTToken: "",
  });

  function getNonceAndRegister() {
    UserInterface.getNonceAndRegister({
      metamaskId: userDetails.metamaskId,
    }).then((nonceValue) => {
      let nonceString = _.get(nonceValue, "data.data");
      BlockchainInterface.signToken(nonceString)
        .then((secret) => {
          registerUser(nonceString, secret);
        })
        .catch((err) => {
          console.log(err);
          setRegistration(FAILED);
        });
    });
  }

  function registerUser(nonce, secret) {
    try {
      BlockchainInterface.register_user({ ...userDetails, secret, nonce })
        .then((success) => {
          NotificationInterface.postNotification(
            CONSTANTS.ENTITIES.PUBLIC,
            _.get(loggedInUserDetails, "_id"),
            CONSTANTS.ACTIONS.UPVOTE,
            CONSTANTS.ACTION_STATUS.PENDING,
            "Invite 10 friends and this is your referral code: " +
              userDetails.myReferralCode
          );
          let response = success.data;
          UserInterface.registerUser({ ...userDetails, secret, nonce })
            .then((mongoSuccess) => {
              setTokenInSession(mongoSuccess.token);
              publishUserToApp();
              setRegistration(PASSED);
              reactGA.event({
                category: "Button",
                action: "USER_REGISTERED",
                label: "User registered",
              });
              BlockchainInterface.addToken("ERC20", "TRBG", 18);
            })
            .catch((err) => {
              registrationFailure(err.data, userDetails);
            });
        })
        .catch((error) => {
          registrationFailure(error.data, userDetails);
        });
    } catch (e) {
      console.log("shiotter", e);
    }
  }

  function registrationFailure(message, userDetails) {
    UserInterface.removeUser({
      userName: userDetails.userName
    })
    reactGA.event({
      category: "Button",
      action: "USER_REGISTER_FAILED",
      label: "User registered failed",
    });
    setRegistration(FAILED);
    setregistrationErrorMessage(message);
  }

  function publishUserToApp() {
    store.dispatch(setReduxUserDetails(userDetails.metamaskId));
  }

  const setTokenInSession = (token) => {
    sessionStorage.setItem(appConstants.COOKIE_TOKEN_PHRASE, token);
  };

  const handleNext = () => {
    
    if (steps[steps.length - 1].key == activeStep.key) {
      if (registration == PASSED) {
        publishUserToApp();
        history.push("/profile/" + userDetails.userName);
        window.location.reload();
      } else if (registration == FAILED) {
        setRegistration("");
      } else {
        setRegistration(PENDING);
        getNonceAndRegister();
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
      props.onHide();
    } else {
      setSteps((prevStep) =>
        prevStep.map((x) => {
          if (x.key === activeStep.key) x.isDone = false;
          return x;
        })
      );
      setActiveStep(steps[index - 1]);
      if (activeStep.index == 2) {
        setRegistration("");
      }
    }
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
    UserInterface.getUserInfo({ email: _.get(googleFormResponseObject.profileObj, "email") })
      .then((userDetails) => {
        setuserEmailError(true);
      })
      .catch((error) => {
        setUserDetails({
          ...userDetails,
          firstName: _.get(googleFormResponseObject.profileObj, "givenName"),
          lastName: _.get(googleFormResponseObject.profileObj, "familyName"),
          email: _.get(googleFormResponseObject.profileObj, "email"),
          imageUrl: _.get(googleFormResponseObject.profileObj, "imageUrl"),
          loginMode: "google",
          userName: "",
          googleJWTToken: _.get(googleFormResponseObject.tokenObj, "id_token"),
        });
        setuserEmailError(false);
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
          <div className="align-self-center d-flex justify-content-center flex-column">
            {_.isEmpty(userDetails.email) ? (
              <GoogleLogin
                //secretKey:I0YMKAriMhc6dB7bN44fHuKj
                clientId="639340003430-0gldnqd5a7tll38k5jpa7q6dqtv5c62v.apps.googleusercontent.com"
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
            <br/>
            {userEmailError  && 
             <div className="error-message ml-2">  User with this email already registerd </div>
            }
          </div>
        );
        break;
      case "chainAddress":
        return (
          <Col md="12" className="d-flex justify-content-md-around">
            {_.isEmpty(userDetails.metamaskId) ? (
              <div className="network-container">
                <div className="metamaskLogin loginMode d-flex flex-column align-items-center cursor-pointer">
                  <span className="readable-text second-grey">
                    We could not recognize any connected wallet on this app.
                    Please connect metamask to ideaTribe to continue.
                  </span>
                  <img src={metamaskLogo} width="70"></img>
                  <div className="metamask_integration">
                    <Button
                      variant="secondary"
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
                <div className="d-flex align-items-center flex-column mb-2">
                  <img src={successLogo} className="success-logo"></img>
                  <span className="second-grey">
                    Hi {userDetails.firstName}, Congratulations! You have earned 1 TribeGold and your wallet
                  is loaded with MATIC to get started!
                  </span>
                </div>
              </div>
            ) : registration == FAILED ? (
              <div>
                {" "}
                Hi {userDetails.firstName}, we were unable to onboard you to the
                Tribe this time.
                <br></br>
                {registrationErrorMessage}
              </div>
            ) : (
              <>
                <Form.Group
                  as={Col}
                  className="formEntry userIDSection h-100"
                  controlId="userName"
                >
                  <Image
                    src={userDetails.imageUrl}
                    height={200}
                    width={200}
                    className=""
                    style={{
                      background: "#f1f1f1",
                      borderRadius: "3px",
                    }}
                  />
                  <div className="inputs d-flex flex-column justify-content-around h-100 ml-5 w-100">
                    <div className="userID">
                      <span className="second-grey color-primary">Enter username</span>
                      {userNameError && (
                        <span className="error-message ml-2">
                          *{userNameError}
                        </span>
                      )}
                      <i className="fa fa-circle-notch fa-spin"></i>
                      {!userNameError &&
                      userDetails.userName &&
                      userDetails.userName.length > 0 ? (
                        <i className="icon fa fa-check ml-1"></i>
                      ) : (
                        <div></div>
                      )}
                      <Form.Control
                        type="text"
                        name="userName"
                        value={userDetails.userName}
                        className={
                          userNameError ? "username-error userName" : "userName"
                        }
                        autoFocus={true}
                        onChange={handleChange}
                      />
                    </div>

                    {/* <div>
                      <span className="second-grey">Referral Code</span>
                      {referralError && (
                        <span className="error-message ml-2">
                          *Invalid referral code
                        </span>
                      )}
                      <i className="fa fa-circle-notch fa-spin"></i>
                      {!referralError &&
                      userDetails.referredBy &&
                      userDetails.referredBy.length > 0 ? (
                        <i className="icon fa fa-check ml-1"></i>
                      ) : (
                        <div></div>
                      )}
                      <Form.Control
                        type="text"
                        name="referredBy"
                        value={userDetails.referredBy}
                        className={"userName referral"}
                        onChange={handleChange}
                      />
                    </div> */}
                  </div>
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
    const value = event.target.value;
    returnObj[event.target.name] = value;
    setUserDetails({
      ...userDetails,
      ...returnObj,
    });
    if (event.target.name == "userName") {
      if (/^[A-Z0-9]+$/i.test(value)) {
        setuserNameError(false);
        UserInterface.getUserInfo({ userName: value })
          .then((userDetails) => {
            setuserNameError("Username already taken");
          })
          .catch((error) => {
            setuserNameError(false);
          });
      } else {
        setuserNameError("Username invalid");
      }
    }
    if (event.target.name == "referredBy") {
      if (/^[A-Z0-9]+$/i.test(value)) {
        setuserNameError(false);
        UserInterface.getUserInfo({ myReferralCode: value })
          .then((userDetails) => {
            setReferralError(false);
          })
          .catch((error) => {
            setReferralError(false);
          });
      } else {
        setReferralError(false);
      }
    }
  }
  const closePopup = () => {
    if(registration != PASSED){
      props.onHide();
    }
  };

  return (
    <Modal
      show={props.show}
      dialogClassName="register-modal"
      centered
      size="lg"
      fullscreen={true}
      onHide={props.onHide}
      backdrop={registration == PASSED ? "static" : true}
    >
      {registration == PENDING && <ProgressBar></ProgressBar>}
      <Modal.Header className="d-flex flex-column">
        <Modal.Title>
          <span className="master-grey color-primary">
            Sign up
          </span>
          <CloseButton
            onClick={() => {
              closePopup();
            }}
          ></CloseButton>
        </Modal.Title>
        <div className="steps">
          <ul className="nav">
            {steps.map((step, i) => {
              return (
                <li
                  key={i}
                  className={`${
                    _.get(activeStep, "key") === step.key ? "active" : ""
                  } ${step.isDone ? "done" : ""}`}
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
            <div className="step-component d-flex justify-content-center">
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
          {registration == PASSED || registration == FAILED ? (
            <div></div>
          ) : (
            <Button
              className="button"
              bsstyle="primary"
              onClick={() => {
                handleBack();
              }}
            >
              {activeStep.index == 0 ? "Cancel" : "Back"}
            </Button>
          )}
          <Button
            disabled={
              ((userNameError || userEmailError ||
                !userDetails.userName ||
                userDetails.userName.length == 0 ||
                referralError) &&
                //  || !userDetails.referredBy || userDetails.referredBy.length == 0
                activeStep.index == 2) ||
              registration == PENDING ||
              (_.isEmpty(userDetails.metamaskId) && activeStep.index == 1) ||
              (_.isEmpty(userDetails.email) && activeStep.index == 0) ||
              userNameError
            }
            variant="ternary"
            className="button"
            bsstyle="primary"
            onClick={() => {
              handleNext();
            }}
          >
            {activeStep.index == steps.length - 1
              ? registration == PASSED
                ? "Get Started"
                : registration == PENDING
                ? "Registering"
                : registration == FAILED
                ? "Retry"
                : "Register"
              : "Next"}
          </Button>
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

export default Register;
