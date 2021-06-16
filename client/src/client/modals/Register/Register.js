import _ from "lodash";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { Row, Col, Form, Modal, Button } from "react-bootstrap";
import "./Register.scss";
import "react-step-progress-bar/styles.css";
import { ProgressBar } from "react-step-progress-bar"

const Register = (props) => {
  const [appLocation, setAppLocatoin] = useState("home");
  function responseGoogle(response) {
    let userDetailsObject = {
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
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
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
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
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
