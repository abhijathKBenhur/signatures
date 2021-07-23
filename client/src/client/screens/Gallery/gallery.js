import _ from "lodash";
import { Row, Col, Carousel, Container,Button } from "react-bootstrap";
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
    SignatureInterface.getSignatures().then((signatures) => {
      let response = _.get(signatures, "data.data")
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
        {/* <Row className="userPane profile-row" >
          {true ? (
            <div className="profileHolder">
              <Banner></Banner>
            </div>
          ) : null}
        </Row> */}
         <Row className="search-discover d-flex flex-column align-items-center" >
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
