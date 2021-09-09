import React, { useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import "./about.scss";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import dummyImg from "../../../assets/images/dummy.png";
import user from "../../../assets/images/user.png";
import cover from "../../../assets/images/cover.jpg";
import dummy1 from "../../../assets/images/dummy1.png";
import dummy2 from "../../../assets/images/dummy2.jpg";
import about_idea from "../../../assets/images/about_idea.png";
import RelationsInterface from "../../interface/RelationsInterface";
import { showToaster } from "../../commons/common.utils";
const About = () => {
  let history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const submitMailId = () => {
    RelationsInterface.subscribe({
      mailID: searchText,
    }).then((success) => {
      showToaster("Sucbscribed!", { type: "dark" });
      setSubscribed(true);
    });
  };

  const type = (event) => {
    if (event) setSearchText(event.target.value);
  };
  return (
    <Container className="about-container">
      <Row className="about-item about-second">
        <Col md="6" lg="6" sm="6">
          <div className="left">
            <span className="father-grey">IdeaTribe</span>
            {/* <span className="master-header">About Us</span> */}
            <span className="second-header mb-5 color-secondary-light">
              All your best ideas. On the blockchain. Immutable forever.{" "}
            </span>
            <span className="readable-text mb-3">
              Ideatribe knows that the best ideas are truly democratic and
              decentralized. That’s why we make it easy to register your idea
              with us instantly and protect you from those who will want to
              claim it as theirs and profit from it.
            </span>
            We also believe the best ideas come from Global collaboration. Not
            only will you be able to stake claim to your ideas, you’ll also be
            able to collaborate with others!
            <br></br>
            The founding team of Ideatribe are artists, musicians, writers,
            businesspeople, product specialists & brilliant engineering talent
            who have come together for one common purpose...to illuminate your
            ideas and help bring them to reality.
            {/* <br></br><br></br>
        
         Here’s to all the artists, creative people, square pegs in a
        round hole, misfits, rebels, unheralded heroes….get on IdeaTribe, bring
        your ideas to life! */}
          </div>
          <div className="center-box mt-5" style={{ width: "100%" }}>
            <Col>
              {subscribed ? (
                <div className="subscribe-block second-grey ">Thank you!</div>
              ) : (
                <div className="">
                  {/* <Row className="subscribe-block master-header justify-content-center">Subscribe</Row> */}
                  <Row className="subscribe-block master-grey ">
                    Type in your email and we will keep you posted.
                  </Row>
                  <Row className="mt-3 subscribe-container">
                    <Col className="p-0">
                      <input
                        type="text"
                        onKeyUp={type}
                        id="search-box"
                        autoComplete="off"
                        className="search-box w-100 h-100"
                        placeholder="Email"
                        style={{paddingLeft:"10px"}}
                      />
                    </Col>
                    <Col className="p-0">
                      <Button
                        variant="primary"
                        className="subscribe-btn h-100 ml-2"
                        onChan
                        onClick={() => {
                          submitMailId();
                        }}
                      >
                        {" "}
                        Subscribe
                      </Button>
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
          </div>
        </Col>
        <Col md="6" lg="6" sm="6">
          <img src={about_idea} width="100%"></img>
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default About;
