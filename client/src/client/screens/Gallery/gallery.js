import _ from "lodash";
import { Row, Col, Carousel, Container, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Rack from "../../components/Rack/Rack";
import "./gallery.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SignatureInterface from "../../interface/SignatureInterface";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import Banner from "../../components/banner/banner";
import DiscoverMore from "../../components/discover-more/discover-more";
import SearchBar from "../../components/searchBar/SearchBar";
import cover from "../../../assets/images/cover.jpg";
import { setCollectionList } from "../../redux/actions";

function gallery(props) {
  let history = useHistory();
  const cookies = new Cookies();
  const reduxState = useSelector((state) => state, shallowEqual);
  const { collectionList = [] } = reduxState;
  //const [visitedUser, setIsVisitedUser] = useState(cookies.get("visitedUser"));
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("getting signatures ");
    SignatureInterface.getSignatures().then((signatures) => {
      let response = _.get(signatures, "data.data");
      dispatch(setCollectionList(response));
    });
  }, []);

  useEffect(() => {
    return function cleanup() {
      cookies.set("visitedUser", true);
      //setIsVisitedUser(true);
    };
  }, []);
  function gotoProfile() {
    history.push("/profile");
  }

  return (
    <Container fluid>
      <div className="gallery d-flex flex-column">
        {/* <Row className="userPane profile-row" >
          {true ? (
            <div className="profileHolder">
              <Banner></Banner>
            </div>
          ) : null}
        </Row> */}
        <Row
          className="search-discover d-flex flex-column justify-content-center"
          style={{
            background: `linear-gradient(rgba(255,255,255,.95), rgba(255,255,255,.95)), url(${cover})`,
            height: "300px",
          }}
        >
          <div className="ideatribe-stats d-flex align-items-center w-100">
            <Col md="3" className="d-flex flex-column align-items-center stats-entry">
              <span className="stats-title master-header"> 113</span>
              <span className="stats-value second-grey">Ideas submitted</span>
            </Col>
            <Col md="3" className="d-flex flex-column align-items-center stats-entry">
              <span className="stats-title master-header">1102</span>
              <span className="stats-value second-grey">Users registered</span>
            </Col>
            <Col md="3" className="d-flex flex-column align-items-center stats-entry">
              <span className="stats-title master-header">11 </span>
              <span className="stats-value second-grey">Gold rewarded</span>
            </Col>
            <Col md="3" className="d-flex flex-column align-items-center stats-entry">
              <span className="stats-title master-header">113</span>
              <span className="stats-value second-grey">Users registered</span>
            </Col>
          </div>
        </Row>
        <Row
          className="d-flex flex-column align-content-center position-relative"
          style={{ top: "-10px" }}
        >
          <SearchBar />
          <DiscoverMore></DiscoverMore>
        </Row>
        <div className="separator"> </div>
        <Rack deck={collectionList}></Rack>
      </div>
    </Container>
  );
}

export default gallery;
