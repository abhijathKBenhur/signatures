import React, { useState, useEffect } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import "./about.scss";
import $ from "jquery";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import about_idea from "../../../assets/images/about_idea.png";
import RelationsInterface from "../../interface/RelationsInterface";
import { showToaster } from "../../commons/common.utils";
const About = () => {
  let history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribedCount, setSubscribedCount] = useState(0);

  const submitMailId = () => {
    RelationsInterface.subscribe({
      mailID: searchText,
    }).then((success) => {
      setSubscribed(true);
      setSubscribed(subscribedCount + 1);
    });
  };

  useEffect(() => {
    RelationsInterface.getPrelaunches()
      .then((success) => {
        setSubscribedCount(_.get(success, "data.data").length);
      })
      .catch((err) => {
        setSubscribedCount(0);
      });
  }, []);

  const type = (event) => {
    if (event) setSearchText(event.target.value);
  };
  return (
    <Container fluid className="about-container">
      <Row className="about-item about-second">
        <Col md="7" lg="8" sm="12">
          <div className="left">
            <span className="father-grey">IdeaTribe</span>
            {/* <span className="master-header">About Us</span> */}
            <span className="second-header mb-5 color-secondary-light">
              All your best ideas. On the blockchain. Forever.{" "}
            </span>
            <span className="readable-text mb-1">
              Great ideas can come to anyone, anywhere. And inspiration is
              fleeting.
              <br />
              <br />
              So, IdeaTribe makes it easy to register your idea on the
              blockchain. Instantly.
              <br />
              <br />
              Not only can you stake claim on your ideas, you can also
              collaborate with others! After all, magic is when great minds come
              together.
              <br />
              <br />
              The founders of IdeaTribe are artists, musicians, writers,
              businesspeople, product specialists and engineering talent who
              have come together for one common purpose, to help you to bring
              your ideas to reality.
              <br />
              <br />
            </span>

            {/* <br></br><br></br>
        
         Here’s to all the artists, creative people, square pegs in a
        round hole, misfits, rebels, unheralded heroes….get on IdeaTribe, bring
        your ideas to life! */}
          </div>
          <div className="center-box mt-3" style={{ width: "100%" }}>
            <Col>
              {subscribed ? (
                <Row>
                  <div className="subscribe-block master-grey color-secondary subscribed">
                    Thank you for sharing your email. We will be in touch!
                  </div>
                </Row>
              ) : (
                <div className="">
                  {/* <Row className="subscribe-block master-header justify-content-center">Subscribe</Row> */}
                  <Row className="subscribe-block master-grey ">
                    Type your email and we will keep you posted.
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
                        style={{ paddingLeft: "10px" }}
                      />
                    </Col>
                    <Col className="p-0">
                      <Button
                        variant="primary"
                        className="subscribe-btn h-100 ml-2"
                        onClick={() => {
                          submitMailId();
                        }}
                      >
                        {" "}
                        Let me know
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mt-5 master-grey color-secondary">
                    {subscribedCount} Subscribers
                  </Row>
                </div>
              )}
            </Col>
          </div>
        </Col>
        <Col md="5" lg="4" sm="12">
          <img src={about_idea} width="100%"></img>
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default About;
