import _ from "lodash";
import { Row, Col, Carousel, Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Rack from "../../components/Rack/Rack";
import "./gallery.scss";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Cookies from "universal-cookie";
import cover from "../../../assets/cover.jpeg";
import user from "../../../assets/user1.png";
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
        <Row className="userPane profile-row">
          {true ? (
            <div className="profileHolder">
              <Carousel interval={5000}>
                <Carousel.Item>
                  <Container fluid>
                    <Row>
                      <Col sm={3}>
                        <div>
                          <div className="button-label">Getting Started</div>
                        </div>
                      </Col>
                      <Col sm={8}>
                        <div className="content">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum.
                        
                        </div>
                      </Col>
                      <Col sm={1}>
                          <div className="content-profile">
                            <img src={user} />
                          </div>
                      </Col>
                    </Row>
                  </Container>
                </Carousel.Item>
                <Carousel.Item>
                  <Container fluid>
                    <Row>
                      <Col sm={3}>
                        <div>
                          <div className="button-label">Validate</div>
                        </div>
                      </Col>
                      <Col sm={8}>
                        <div className="content">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum.
                         
                        </div>
                      </Col>
                      <Col sm={1}>
                          <div className="content-profile">
                            <img src={user} />
                          </div>
                      </Col>
                    </Row>
                  </Container>
                </Carousel.Item>
                <Carousel.Item>
                  <Container fluid>
                    <Row>
                      <Col sm={3}>
                        <div>
                          <div className="button-label">View Contact</div>
                        </div>
                      </Col>
                      <Col sm={8}>
                        <div className="content">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat. Duis aute irure dolor in
                          reprehenderit in voluptate velit esse cillum dolore eu
                          fugiat nulla pariatur. Excepteur sint occaecat
                          cupidatat non proident, sunt in culpa qui officia
                          deserunt mollit anim id est laborum.
                        
                        </div>
                      </Col>
                      <Col sm={1}>
                          <div className="content-profile">
                            <img src={user} />
                          </div>
                      </Col>
                    </Row>
                  </Container>
                </Carousel.Item>
              </Carousel>
            </div>
          ) : null}
        </Row>
        <div className="separator"> </div>
        <Rack deck={signatureList}></Rack>
      </div>
      <DiscoverMore />
    </Container>
  );
}

export default gallery;
