import React from "react";
import {
  Row,
  Col, Container, Button
} from "react-bootstrap";
import "./about.scss";
import { useHistory } from "react-router-dom";
import dummyImg from "../../../assets/images/dummy.png"
import user from "../../../assets/images/user.png"
import cover from "../../../assets/images/cover.jpeg"
import dummy1 from "../../../assets/images/dummy1.png"
import dummy2 from "../../../assets/images/dummy2.jpg"
import dummy3 from "../../../assets/images/dummy3.jpeg"
const About = () => {
  let history = useHistory();
  return (
    <Container className="about-container">
      <Row className="about-item about-first">
        <Col className="left" xs={12} sm={8}>
          <h2>
            Doing the right thing,
          </h2>
          <h2>
            at the right time.
          </h2>
          <div>
            We’ve noticed the best ideas come when
            you least expect them. We’re here to store them for posterity and help
            you change the world. Ideatribe was born out of a desire by the founding
            team to harness the creativity of the everyman ...You, us, everyone!
          </div>
          <div>
            <Button variabt="secondary" className="mt-5" onClick={() => {
              history.push("/home");
            }}>Take me to the tribe</Button>
          </div>
        </Col>
        <Col className="right" xs={12} sm={4}>
          <img src={dummyImg} />
        </Col>
      </Row>
      <Row className="about-item about-second">
        <Col className="left">
          <h2>
            About Us
          </h2>
          <b>All your best ideas. On the blockchain. Immutable forever. </b>
          That's the promise of Ideatribe.
          <br></br>

          <br></br>
          Ideatribe knows that the best ideas are truly democratic and
          decentralized. That’s why we make it easy to register your idea with us
          instantly and protect you from those who will want to claim it as theirs
          and profit from it.
          <br></br>

          We also believe the best ideas come from Global
          collaboration. Not only will you be able to stake claim to your ideas,
          you’ll also be able to collaborate with others!
          <br></br><br></br>

          The founding team of
          Ideatribe are artists, musicians, writers, businesspeople, product
          specialists & brilliant engineering talent who have come together for
          one common purpose...to illuminate your ideas and help bring them to
          reality.
          {/* <br></br><br></br>
        
         Here’s to all the artists, creative people, square pegs in a
        round hole, misfits, rebels, unheralded heroes….get on IdeaTribe, bring
        your ideas to life! */}
        </Col>
        <Col className="right">
          <img src={dummyImg} />
        </Col>

      </Row>
      <Row className="about-item about-third">
        <Col xs={12} md={12} lg={12} className="heading">
          <h3>Meet our Solution for you</h3>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <h6> dummy heading</h6>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <h6> dummy heading</h6>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <h6> dummy heading</h6>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <h6> dummy heading</h6>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <h6> dummy heading</h6>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <h6> dummy heading</h6>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
      </Row>
      <Row className="about-item about-fourth">
        <Col xs={12} md={12} lg={12} className="heading">
          <h3>What They Said About Us</h3>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <div className="user-image">
              <img src={user} />
            </div>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <div className="user-image">
              <img src={user} />
            </div>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <div className="user-image">
              <img src={user} />
            </div>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>

      </Row>
      <Row className="about-item about-fifth">
        <Col className="image-overlay">
          <div style={{ backgroundImage: `url(${cover})`, height: '300px' }} >

          </div>
          <div className="overlay">
            <Row>
              <Col xs={12} sm={6} className="facts">
                Some of Our Companies Real Facts.
              </Col>
              <Col xs={12} sm={2}>
                <div>

                </div>
                <h3>
                  256
                </h3>
              </Col >
              <Col xs={12} sm={2}>
                <div>

                </div>
                <h3>
                  455
                </h3>
              </Col>
              <Col xs={12} sm={2}>
                <div>

                </div>
                <h3>
                  54
                </h3>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="about-item about-sixth">
        <Col xs={12} md={12} lg={12} className="heading">
          <h3>Comapany News</h3>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <div className="image-conatiner">
              <img src={dummy1} />
            </div>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <div className="image-conatiner">
            <img src={dummy3} />
            </div>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
        <Col xs={12} sm={4} >
          <div className="card">
            <div className="image-conatiner">
            <img src={dummy2} />
            </div>
            <div>
              asdasd asdasd asdasdas
            </div>
          </div>
        </Col>
       
      </Row>
    </Container>
  );
};

export default About;
