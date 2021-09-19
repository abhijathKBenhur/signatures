import React from "react";
import _ from "lodash";
import './progressbar.scss'
import { Button, Card, CardDeck } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Feather, ExternalLink } from "react-feather";
import Image from "react-image-resizer";
import { Row, Col, Container } from "react-bootstrap";

const ProgressBar = (props) => {
  return (
    <div className="custom-slider">
        <div className="line"></div>
        <div className="subline inc"></div>
        <div className="subline dec"></div>
    </div>
  );
};
export default ProgressBar;
