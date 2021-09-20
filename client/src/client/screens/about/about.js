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
  const [subscribedList, setSubscribedList] = useState(0);
  const [showMembers, setShowMembers] = useState(false);
  const [errorMailId, setErrorMail] = useState(false);

  const submitMailId = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(String(searchText).toLowerCase())){
      setErrorMail(true)
    }else{
      setErrorMail(false)
      RelationsInterface.subscribe({
        mailID: searchText,
      }).then((success) => {
        setSubscribed(true);
        let list = _.clone(subscribedList)
        list.push(_.get(success,"data.data"))
        setSubscribedList(list);
        RelationsInterface.sendMail({mailID:searchText}).then(succes =>{
          console.log(success)
        }).catch(err =>{
          console.error(err)
        })
      });
    }
    
  };

  useEffect(() => {
    RelationsInterface.getPrelaunches()
      .then((success) => {
        setSubscribedList(success.data.data)
      })
      .catch((err) => {
        setSubscribedList([])
      });
  }, []);

  const getSubscribers = () => {
    setShowMembers(true)
  }

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
                        placeholder="E-mail"
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
                  <Row>
                  {errorMailId &&  <span className="second-grey color-red mt-2">Please enter a valid e-mail address.</span>}
                    </Row>
                 
                  <Row className="mt-5 master-grey color-secondary">
                    {subscribedList.length} Subscribers
                  </Row>
                </div>
              )}
            </Col>
          </div>
        </Col>
        <Col md="5" lg="4" sm="12">
          <img src={about_idea} onDoubleClick={() => {getSubscribers()}} width="100%"></img>
          {showMembers && JSON.stringify(_.map(subscribedList,"mailID"))}
        </Col>
      </Row>
      <Row></Row>
    </Container>
  );
};

export default About;
