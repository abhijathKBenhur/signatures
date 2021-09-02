import React from "react";
import {
  Row,
  Col, Container, Button
} from "react-bootstrap";
import "./prelaunch.scss";
import { useHistory } from "react-router-dom";
const Prelaunch = () => {
  let history = useHistory();
  return (
    <Container className="about-container">
        prelaunching here
    </Container>
  );
};

export default Prelaunch;
