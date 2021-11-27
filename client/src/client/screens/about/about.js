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
          <span className="mt-3 master-header color-primary-light">
            Immortalize your Inspiration
          </span>
          {/* <span className="master-header color-primary">
            at the right time.
          </span> */}
          <div className="mt-1 readable-text second-grey">
          Have you noticed that the best ideas come to you when you least expect them?  <br/> <br/>

          Those are precious moments of inspiration and originality. We are here to save them for posterity and help you change the world! <br/> <br/>

          IdeaTribe was born out of the founding team’s desire to harness the creativity of the everyman. <br/> <br/>

          <span className="color-primary">You. Us. Everyone! </span>
          </div>
          <div>
            <Button variabt="secondary" className="mt-2" onClick={() => {
              history.push("/home");
            }}><span className="master-grey color-white"> Take me to the Tribe </span></Button>
          </div>
        </Col>
        <Col className="right desktop-view" xs={12} sm={4}>
          <img src={girl_idea} />
        </Col>
      </Row>
      <Row className="about-item mt-3 about-second align-items-start">
      <Col className="left">
          <img src={creativity} />
        </Col>
        <Col className="right">
          <span className="father-grey mt-3">All your best Ideas. </span>
          <span className="father-grey color-primary-light">
            On the blockchain.
           </span>
          <span className="master-header color-primary">
            Forever. 
           </span>
          <br/>
          <div className="mt-3 mb-1 readable-text second-grey">
          IdeaTribe recognizes that the best ideas are truly democratic and decentralized. That is why you can mint your Idea with us instantly and record it as yours forever. <br/> <br/>

          We know that Ideas become real with the support of great collaborators. That is why, at IdeaTribe, you can collaborate with others in the safety of smart contracts! <br/> <br/>
          
          The founding team of IdeaTribe are artists, musicians, writers, businesspeople, product specialists & brilliant engineering talent who have come together for one common purpose: To shine light on your ideas and help bring them to reality.
          
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
