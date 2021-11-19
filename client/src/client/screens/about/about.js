import React from "react";
import {
  Row,
  Col, Container, Button
} from "react-bootstrap";
import "./about.scss";
import { useHistory } from "react-router-dom";
import girl_idea from "../../../assets/images/girl_idea.png"
import creativity from "../../../assets/images/creativity.png"
import user from "../../../assets/images/user.png"
import ProgressBar from "../../components/progress-bar/progressbar"
const About = () => {
  let history = useHistory();
  return (
    <Container className="about-container">
      <ProgressBar></ProgressBar>
      <Row className="about-item about-first second-grey">
        <Col className="left" xs={12} sm={8}>
          <span className="master-header color-primary-light">
            Contact Us
          </span>
          {/* <span className="master-header color-primary">
            at the right time.
          </span> */}
          <div className="mt-3 color-primary readable-text">
          We’ve noticed the best Ideas come when you least expect them. We’re here to store them for posterity and help you change the world. Ideatribe was born out of a desire by the founding team to harness the creativity of the everyman. You. Us. Everyone!
          </div>
          <div>
            <Button variabt="secondary" className="mt-5" onClick={() => {
              history.push("/home");
            }}><span className="master-grey color-white" onClick={(e) => window.location.href = "mailto:"+"contact@ideatribe.io"+'?subject='+"Query"+'&body='+""}> Take me to the tribe </span></Button>
          </div>
        </Col>
        <Col className="right desktop-view" xs={12} sm={4}>
          <img src={girl_idea} />
        </Col>
      </Row>
      <Row className="about-item about-second">
      <Col className="left">
          <img src={creativity} />
        </Col>
        <Col className="right">
          <span className="father-grey mt-3">All your best Ideas. On the blockchain. </span>
          
          <span className="master-header color-primary">
          Immutable forever. 
           </span>
          <br/>
          <div className="mt-3 readable-text color-grey">
          Ideatribe knows that the best Ideas are truly democratic and
          decentralized. That’s why we make it easy to register your idea with us
          instantly and protect you from those who will want to claim it as theirs
          and profit from it.

          We also believe the best Ideas come from Global
          collaboration. Not only will you be able to stake claim to your Ideas,
          you’ll also be able to collaborate with others!
          <br></br>

          The founding team of
          Ideatribe are artists, musicians, writers, businesspeople, product
          specialists & brilliant engineering talent who have come together for
          one common purpose...to illuminate your Ideas and help bring them to
          reality.
          </div>
          {/* <br></br><br></br>
        
         Here’s to all the artists, creative people, square pegs in a
        round hole, misfits, rebels, unheralded heroes….get on IdeaTribe, bring
        your Ideas to life! */}
        </Col>
       

      </Row>
      {/* <Row className="about-item about-third">
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
       
      </Row> */}
    </Container>
  );
};

export default About;
