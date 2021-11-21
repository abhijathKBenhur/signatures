import React from "react";
import {
  Row,
  Col, Container, Button
} from "react-bootstrap";
import "./contactus.scss";
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
        <Col className="left mt-6 text-center" xs={12}>
          <span className="father-grey color-secondary mb-4 uppercase">
            Contact Us
          </span>
          {/* <span className="master-header color-primary">
            at the right time.
          </span> */}
          <div className="mt-3 color-primary readable-text">
            <span> IdeaTribe, Inc. </span>
            <br/>
            <span>Attn. DMCA Notice 16192 Coastal Highway,  </span>
            <br/>
            <span>Lewes, Delaware 19958 </span>
            <br/>Email: contact@IdeaTribe.io
          </div>
          <div>
            <Button variabt="secondary" className="mt-5" onClick={() => {
              history.push("/home");
            }}><span className="master-grey color-white" onClick={(e) => window.location.href = "mailto:"+"contact@ideatribe.io"+'?subject='+"Query"+'&body='+""}>Send us an Email</span></Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
