import _ from "lodash";
import { Row, Col, Carousel, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Rack from "../../components/Rack/Rack";
import "./gallery.scss";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Cookies from "universal-cookie";
import cover from "../../../assets/cover.jpeg";
import DiscoverMore from "../../components/discover-more/discover-more";
function gallery(props) {
  const cookies = new Cookies();
  const [signatureList, setSignatureList] = useState([]);
  const [visitedUser, setIsVisitedUser] = useState(cookies.get("visitedUser"));
  useEffect(() => {
    console.log("getting signatures ");
    MongoDBInterface.getSignatures({ limit: 14 }).then((signatures) => {
      let response = _.get(signatures, "data.data");
      setSignatureList(response);
    });
    return function cleanup() {
      cookies.set("visitedUser", true);
      setIsVisitedUser(true);
    };
  }, []);

  return (
    <Container fluid>
      <div className="gallery d-flex flex-column">
        <Row className="userPane">
          {!_.isEmpty(visitedUser) && visitedUser ? (
            <div className="profileHolder">
              <Carousel activeIndex={0}>
                <Carousel.Item>
                  <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>
                      Nulla vitae elit libero, a pharetra augue mollis interdum.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur.
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </div>
          ) : (
            <img className="cover" src={cover}></img>
          )}
        </Row>
        <div className="separator"> </div>
        <Rack deck={signatureList}></Rack>
      </div>
      <DiscoverMore />
    </Container>
  );
}

export default gallery;
