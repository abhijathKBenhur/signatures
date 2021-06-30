import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./banner.scss";
import { Container, Row, Col, Carousel, Button } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import cover from "../../../assets/images/cover.jpeg";
import bg1 from "../../../assets/banners/background1.jpg";
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
      interval={5000}
      className="d-flex align-items-center banner"
      style={{ backgroundImage: `url(${bg2})` }}
      cover
    >
      {/* <Carousel.Item style={{background:`url(${cover})`}}> */}
      <Carousel.Item>
        <Container fluid className="carousal-first">
          <Row className="carousal-row1">
            <Col sm={8}>
              <Row className="banner_header">What is IdeaTribe?</Row>
              <Row>
                <div className="content">
                  IdeaTribe is first and foremost, a registry of original ideas.
                  You can register your original idea with IdeaTribe and it is
                  stored in your name on a blockchain forever. Like a
                  provisional patent, registering your idea with us helps you
                  claim priority - as the real creator.
                </div>
              </Row>
            </Col>
            <Col sm={4}>
              <div className="content-profile">{/* <img src={user} /> */}</div>
            </Col>
          </Row>
        </Container>
      </Carousel.Item>
      <Carousel.Item>
        <Container fluid className="carousal-first">
          <Row className="carousal-row1">
            <Col sm={8}>
              <Row className="banner_header">How should I use it?.</Row>
              <Row>It’s simple, really.</Row>
              <Row>
                <ul>
                  <li>
                    Sign up and connect your crypto wallet [Metamask] with
                    IdeaTribe{" "}
                  </li>
                  <li>Upload PDF, JPEG or .mp3 file of your idea</li>
                  <li>
                    Click Register Idea. [We pay the registration fee for early
                    adopters!]
                  </li>
                  <li>Get your Billet of Registration</li>
                  <li>Share your idea with the world!</li>
                </ul>
              </Row>
            </Col>
          </Row>
        </Container>
      </Carousel.Item>

      {/* <Carousel.Item style={{background:`url(${bg2})`}}> */}
      <Carousel.Item>
        <Container fluid className="carousal-third">
          <Row>
            <Col sm={8}>
              <Row className="banner_header">
                What is blockchain and crypto wallet?
              </Row>
              <Row>
                <div className="content">
                  Blockchain is revolutionary technology that helps create
                  un-hackable registers and smart contracts. Records registered
                  in blockchain are stored forever and cannot be changed. To
                  register in a blockchain, you need crypto currencies - like
                  Bitcoin, Ethereum or Binance. A crypto wallet is simply where
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
      <Carousel.Item>
        <Container fluid className="carousal-third">
          <Row>
            <Col sm={8}>
              <Row className="banner_header">What is TribeCoin?</Row>
              <Row>
                <div className="content">
                  TribeCoin is the currency of IdeaTribe. You earn TribeCoins
                  when you use our app in a way that benefits the community. So,
                  you earn TribeCoins for registering an idea, sharing it with
                  people and collaborating with others.
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
