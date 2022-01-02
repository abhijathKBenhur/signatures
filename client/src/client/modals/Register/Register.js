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
import polygonLogo from  "../../../assets/logo/polygon.png"
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
import WhitelistInterface from "../../interface/WhitelistInterface";
import AlertBanner from "../../components/alert/alert";
import ReactDOM from "react-dom";
// MetamaskID and userDetails are stored in separate redux stores
// userDetails are stored as state

const Register = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  let history = useHistory();
  const PASSED = "PASSED";
  const FAILED = "FAILED";
  const PENDING = "PENDING";
  const appConstants = CONSTANTS;
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
  const [OTPShared, setOTPShared] = useState(undefined);
  const [OTPInitiated, setOTPInitiated] = useState(false);
  const [registration, setRegistration] = useState("");
  const [registrationErrorMessage, setregistrationErrorMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [whiteListCode, setWhiteListCode] = useState("");
  const [userNameError, setuserNameError] = useState(false);
  const [userEmailError, setuserEmailError] = useState(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    if(Number(window.screen.width) < 760  ){
      setIsMobileView(true)
    }
  }, []);

  const [userDetails, setUserDetails] = useState({
    firstName: _.get(reduxState, "firstName"),
    lastName: _.get(reduxState, "lastName"),
    email: _.get(reduxState, "email"),
    imageUrl: "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
    metamaskId: _.get(reduxState, "metamaskID"),
    userName: _.get(reduxState, "userName"),
    loginMode: _.get(reduxState, "loginMode"),
    referredBy: sessionStorage.getItem("inviteCode"),
    myReferralCode: (Math.random() + 1).toString(36).substring(7),
    googleJWTToken: "",
    // isWhitelisted = false
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
          console.log("POSTING SIGN UP NOTIFICATION");
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
              console.log("REGISTER USER SUCCESS");
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
              console.log("REGISTER USER FAILURE", err);
              registrationFailure(err.data, userDetails);
            });
        })
        .catch((error) => {
          console.log("REGISTER USER FAILURE IN CATCH", error);
          registrationFailure(error.data, userDetails);
        });
    } catch (e) {
      console.log("shiotter", e);
    }
  }

  function registrationFailure(message, userDetails) {
    UserInterface.removeUser({
      userName: userDetails.userName,
    });
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
    UserInterface.getUserInfo({
      email: _.get(googleFormResponseObject.profileObj, "email"),
    })
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

  function validateOtp() {
    let success = userDetails.otp == _.get(OTPShared,"data")
    if(success){
      setUserDetails({
        ...userDetails,
        email: userDetails.tempEmail,
      });
    }
  }

  function sendMail() {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(userDetails.tempEmail).toLowerCase())){
      setuserEmailError(true);
    }else{
      setuserEmailError(false);
      setOTPInitiated(true)
      UserInterface.sendMail({tempEmail:userDetails.tempEmail}).then(success =>{
        setOTPShared(success.data)
      }).catch(Err => {
        setOTPShared(undefined)
      })
    }
    
  }

  function getConditionalView(stepKey) {
    switch (stepKey) {
      case "socialLogin":
        return (
          <div className="align-self-center d-flex justify-content-center flex-column mail-flow" >
            {!OTPShared && <Row className="mailinput  d-flex flex-row align-items-center mt-3">
              <Form.Control
                type="text"
                name="tempEmail"
                value={userDetails.tempEmail}
                className={
                  userEmailError ? "username-error userName" : "userName"
                }
                placeholder="Email address"
                autoFocus={true}
                onChange={handleChange}
              />

              <Button
                variant="secondary"
                className="button mt-2 action-button w-100"
                bsstyle="primary"
                disabled={userEmailError || OTPInitiated}
                onClick={() => {
                  sendMail();
                }}
              >
                {OTPInitiated ? "Please wait" : "Send OTP"}
              </Button>
            </Row>}
            {OTPShared && <div className="otpinput flex-column d-flex align-items-center">
              <Form.Control
                type="text"
                name="otp"
                value={userDetails.otp}
                className= "userName"
                autoFocus={true}
                placeholder="OTP"
                onChange={handleChange}
              />
              <Button
              variant={userDetails.email? "secondary" : "primary"}
              className="button mt-2 action-button w-100"
              bsstyle="primary"
              
              onClick={() => {
                validateOtp();
              }}
            >
              {userDetails.email ? "Validated" :"Validate"}
            </Button>
            </div>}

            
            <br />
            {userEmailError && (
              <div className="error-message ml-2">
                {" "}
                Email invalid or already registerd{" "}
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
                  <span className="readable-text second-grey">
                    We could not recognize any connected wallet on this app.
                    Please connect metamask to ideaTribe to continue.
                  </span>
                  <img src={polygonLogo} width="70"></img>
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
                <img src={polygonLogo} width="70"></img>
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
                    Hi {userDetails.firstName}, Congratulations! You have earned
                    1 TribeGold and your wallet is loaded with MATIC to get
                    started!
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
                  className={isMobileView?"formEntry userIDSection h-100 flex-column": "formEntry userIDSection h-100" }
                  controlId="userName"
                >
                  <Image
                    src={userDetails.imageUrl}
                    height={isMobileView ? 100 : 200}
                    width={isMobileView ? 100 : 200}
                    className=""
                    style={{
                      background: "#f1f1f1",
                      borderRadius: "3px",
                    }}
                  />
                  <div className="inputs d-flex flex-column justify-content-around h-100 ml-5 w-100">
                    <div className="userID">
                      <span className="second-grey color-primary">
                        Enter username
                      </span>
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
                      <span className="second-grey">Whitelist Code</span>
                      {whiteListError && (
                        <span className="error-message ml-2">
                          *Invalid whitelist code
                        </span>
                      )}
                      <i className="fa fa-circle-notch fa-spin"></i>
                      {!whiteListError &&
                      whitelistCode &&
                      whitelistCode.length > 0 ? (
                        <i className="icon fa fa-check ml-1"></i>
                      ) : (
                        <div></div>
                      )}
                      <Form.Control
                        type="text"
                        name="referredBy"
                        value={whitelistCode}
                        className={"userName referral"}
                        onChange={changeWhitelistCode}
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

  function changeWhitelistCode(event) {
    if (event.target.name == "whitelistCode") {
      WhitelistInterface.checkWhiteList({ whitelistCode: event.target.value })
        .then((success) => {
          setWhiteListError(true);
        })
        .catch((err) => {
          setWhiteListError(false);
          setUserDetails({
            ...userDetails,
            isWhitelisted: true,
          });
        });
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
      if (/^[A-Z0-9_]+$/i.test(value)) {
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
    if (event.target.name == "whitelistCode") {
      if (/^[A-Z0-9]+$/i.test(value)) {
        setuserNameError(false);
        UserInterface.getUserInfo({ myReferralCode: value })
          .then((userDetails) => {
            setWhiteListError(false);
          })
          .catch((error) => {
            setWhiteListError(false);
          });
      } else {
        setWhiteListError(false);
      }
    }
    if(event.target.name == "tempEmail"){
      UserInterface.getUserInfo({
        email: value,
      })
        .then((userDetails) => {
          setuserEmailError(true);
        })
    }
  }
  const closePopup = () => {
    if (registration != PASSED) {
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
      <Modal.Header
        className="d-flex flex-column signupHeader"
        id="signupHeader"
      >
        <Modal.Title>
          <span className="master-grey color-primary">Sign up</span>
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
              ((userNameError ||
                userEmailError ||
                !userDetails.userName ||
                userDetails.userName.length == 0) &&
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
