import _ from "lodash";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import "./Register.scss";
import "react-step-progress-bar/styles.css";
import { shallowEqual, useSelector } from "react-redux";
import CONSTANTS from '../../commons/Constants';
// MetamaskID and userDetails are stored in separate redux stores
// userDetails are stored as state 


function reEvaluateUserStage(){
  if(!userDetails.metamaskId){
    setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_1)
  }else{
    if(!userDetails.email){
      setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_2)
    }else{
      if(!userDetails.userID){
        setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_3)
      }else{
        setRegistrationLevel(CONSTANTS.REGISTRATION_LEVEL.BASE_4)
      }
    }
  }
}

const Register = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [userDetails, setUserDetails] = useState({
    firstName: _.get(reduxState, "firstName"),
    LastName: _.get(reduxState, "LastName"),
    email: _.get(reduxState, "email"),
    fullName: _.get(reduxState, "fullName"),
    imageUrl: _.get(reduxState, "imageUrl"),
    metamaskId: _.get(reduxState, "metamaskID"),
    userID: _.get(reduxState, "userID"),
  });


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

  function googleLogIn(response) {
    let googleFormResponseObject = {
      firstName: _.get(response.profileObj, "givenName"),
      LastName: _.get(response.profileObj, "givenName"),
      email: _.get(response.profileObj, "email"),
      fullName: _.get(response.profileObj, "givenName"),
      imageUrl: _.get(response.profileObj, "imageUrl"),
    };
    console.log(response);
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
      <Modal.Header closeButton>
        <Modal.Title>Hi, you are not yet registered with us.</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md="12">
            <Row>
              <ProgressBar
                percent={75}
                filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
              />
            </Row>
            <Row> Link Account</Row>
            <Row> adjnalksjdnlkajsndlkajndlkanslkdansd</Row>
            <Row>
              <Col md="6">
                <div className="register-wizard">
                  <GoogleLogin
                    //secretKey:I0YMKAriMhc6dB7bN44fHuKj
                    clientId="639340003430-d17oardcjjpo9qnj0m02330l5orgn8sp.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={googleLogIn}
                    onFailure={googleLogIn}
                    cookiePolicy="single_host_origin"
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="register-wizard">
                  <GoogleLogin
                    //secretKey:I0YMKAriMhc6dB7bN44fHuKj
                    clientId="639340003430-d17oardcjjpo9qnj0m02330l5orgn8sp.apps.googleusercontent.com"
                    buttonText="Login with Google"
                    onSuccess={googleLogIn}
                    onFailure={googleLogIn}
                    cookiePolicy="single_host_origin"
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Register;
