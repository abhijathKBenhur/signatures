import React, {  useEffect, useState  } from "react";
import _ from "lodash";
import "./banner.scss";
import { Container, Row, Col,Carousel, Button } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import cover from "../../../assets/images/cover.jpeg"
const Banner = (props) => {
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(undefined);
  const reduxState = useSelector((state) => state, shallowEqual);
  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  function gotoProfile(){
    console.log("clicked")
  }
  return (
    <Carousel interval={5000} className="d-flex align-items-center banner">
    <Carousel.Item>
      <Container fluid className="carousal-global">
        <Row className="carousal-row1">
          <Col sm={3}>
            <div>
              <Button
                variant="dark"
                className="button"
                bsstyle="primary"
                onClick={() => {
                  gotoProfile();
                }}
              >
                Getting Started
              </Button>
            </div>
          </Col>
          <Col sm={8}>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </div>
          </Col>
          <Col sm={1}>
            <div className="content-profile">
              {/* <img src={user} /> */}
            </div>
          </Col>
        </Row>
      </Container>
    </Carousel.Item>
    <Carousel.Item>
      <Container fluid>
        <Row>
          <Col sm={3}>
            <div>
            <Button
          variant="dark"
          className="button"
          bsstyle="primary"
          onClick={() => {
            gotoProfile();
          }}
        >
          View our contract
        </Button>
            </div>
          </Col>
          <Col sm={8}>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </div>
          </Col>
          <Col sm={1}>
            <div className="content-profile">
              {/* <img src={user} /> */}
            </div>
          </Col>
        </Row>
      </Container>
    </Carousel.Item>
    <Carousel.Item>
      <Container fluid>
        <Row>
          <Col sm={3}>
            <div>
            <Button
          variant="dark"
          className="button"
          bsstyle="primary"
          onClick={() => {
            gotoProfile();
          }}
        >
          What is metamask
        </Button>
            </div>
          </Col>
          <Col sm={8}>
            <div className="content">
              Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </div>
          </Col>
          <Col sm={1}>
            <div className="content-profile">
              {/* <img src={user} /> */}
            </div>
          </Col>
        </Row>
      </Container>
    </Carousel.Item>
  </Carousel>
  );
};

export default Banner;
