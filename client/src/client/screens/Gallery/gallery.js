import _ from "lodash";
import { Row, Col, Carousel, Container,Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Rack from "../../components/Rack/Rack";
import "./gallery.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import MongoDBInterface from "../../interface/MongoDBInterface";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import user from "../../../assets/images/user1.png";
import DiscoverMore from "../../components/discover-more/discover-more";

import { setCollectionList } from "../../redux/actions";

function gallery(props) {
  let history = useHistory();
  const cookies = new Cookies();
  const reduxState = useSelector((state) => state, shallowEqual);
  const { collectionList = [] } = reduxState;
  //const [visitedUser, setIsVisitedUser] = useState(cookies.get("visitedUser"));
  const dispatch = useDispatch()
  useEffect(() => {
    console.log("getting signatures ");
    MongoDBInterface.getSignatures({ limit: 14 }).then((signatures) => {
      let response = _.get(signatures, "data.data");
      dispatch(setCollectionList(response));
    });
    
  }, []);

  useEffect(() => {
    return function cleanup() {
      cookies.set("visitedUser", true);
      //setIsVisitedUser(true);
    };
  },[])
  function gotoProfile(){
    history.push("/profile");
  }

  return (
    <Container fluid>
      <div className="gallery d-flex flex-column">
        <Row className="userPane profile-row">
          {true ? (
            <div className="profileHolder">
              <Carousel interval={5000} className="d-flex align-items-center">
                <Carousel.Item>
                  <Container fluid>
                    <Row>
                      <Col sm={3}>
                        <div>
                          <Button
                            variant="dark"
                            className="button"
                            bsstyle="primary"
                            onClick={() => {
                              gotoProfile();
                            }}
                          >
                            Getting Started
                          </Button>
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
                        <Button
                      variant="dark"
                      className="button"
                      bsstyle="primary"
                      onClick={() => {
                        gotoProfile();
                      }}
                    >
                      View our contract
                    </Button>
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
                        <Button
                      variant="dark"
                      className="button"
                      bsstyle="primary"
                      onClick={() => {
                        gotoProfile();
                      }}
                    >
                      What is metamask
                    </Button>
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
        <Rack deck={collectionList}></Rack>
      </div>
      <DiscoverMore />
    </Container>
  );
}

export default gallery;
