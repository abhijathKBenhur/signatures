import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./banner.scss";
import { Container, Row, Col, Carousel, Button } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import bg2 from "../../../assets/banners/background2.jpg";
const Banner = (props) => {
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    undefined
  );
  const reduxState = useSelector((state) => state, shallowEqual);
  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  function gotoProfile() {
    console.log("clicked");
  }
  return (
    <Carousel
      interval={10000}
      className="d-flex align-items-center banner"
      style={{ backgroundImage: `url(${bg2})`}}
      cover
    >
      {/* <Carousel.Item style={{background:`url(${cover})`}}> */}
      <Carousel.Item>
        <Container fluid className="carousal-itmes">
          <Row className="carousal-rows">
            <Col sm={9}>
              <Row className="banner_header">What is IdeaTribe?</Row>
              <Row>
                <div className="content text-banner">
                  IdeaTribe is first and foremost, a registry of original ideas, on blockchain.
                  Like a provisional patent, registering your idea with us helps you
                  claim priority - as the creator. <br></br> <br></br>
                  Then you can sell your idea or find collaborators and investors for it.
                </div>
              </Row>
            </Col>
            <Col sm={3}>
              <div className="content-profile">{/* <img src={user} /> */}</div>
            </Col>
          </Row>
        </Container>
      </Carousel.Item>
      <Carousel.Item>
        <Container fluid className="carousal-itmes">
          <Row className="carousal-rows">
            <Col sm={6}>
              <Row className="banner_header">How should I use it?</Row>
              <Row className="text-banner"> It’s simple, really.</Row>
              <Row className="text-banner">
                <ol>
                  <li>
                    Sign up and connect your crypto wallet [Metamask] with
                    IdeaTribe{" "}
                  </li>
                  <li>Upload PDF, JPEG or .mp3 file of your idea</li>
                  <li>
                    Click 'Publish'.
                  </li>
                  <li>Get your Billet of Registration</li>
                  <li>Share your idea with the world!</li>
                </ol>
              </Row>
            </Col>
            <Col md={3}>
              {/* <img src={free} width={"300px"}></img> */}
            </Col>
          </Row>
        </Container>
      </Carousel.Item>

      {/* <Carousel.Item style={{background:`url(${bg2})`}}> */}
      <Carousel.Item>
        <Container fluid className="carousal-itmes">
          <Row className="carousal-rows">
            <Col sm={18}>
              <Row className="banner_header">
                What is blockchain and crypto wallet?
              </Row>
              <Row>
                <div className="content text-banner">
                  Blockchain is a technology that helps create
                  un-hackable registers. Records registered
                  on blockchain are stored forever.<br/><br/>
                  To register in a blockchain, you need crypto currencies - like
                  Bitcoin, Ethereum or Binance.<br/><br/> A crypto wallet is simply where
                  you buy and store your crypto currencies.
                </div>
              </Row>
            </Col>
            <Col sm={4}>
              <div className="content-profile">{/* <img src={user} /> */}</div>
            </Col>
          </Row>
        </Container>
      </Carousel.Item>
     
      
    </Carousel>
  );
};

export default Banner;