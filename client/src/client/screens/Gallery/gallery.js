import _ from "lodash";
import { Row, Col, Carousel, Container, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Rack from "../../components/Rack/Rack";
import "./gallery.scss";
import CONSTANTS from "../../commons/Constants";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SignatureInterface from "../../interface/SignatureInterface";
import StatsInterface from "../../interface/StatsInterface";
import { useHistory } from "react-router-dom";
import Cookies from "universal-cookie";
import DiscoverMore from "../../components/discover-more/discover-more";
import SearchBar from "../../components/searchBar/SearchBar";
import cover from "../../../assets/images/cover2.jpg";
import CommentsPanel from "../../components/comments/CommentsPanel";
import logo from "../../../assets/logo/signatures.png";
function gallery(props) {
  let history = useHistory();
  const cookies = new Cookies();
  const reduxState = useSelector((state) => state, shallowEqual);
  const [collectionList, setCollectionList] = useState([]);
  const [visitedUser, setIsVisitedUser] = useState(cookies.get("visitedUser"));

  const [galleryFilters, setGalleryFilters] = useState({
    searchString: "",
    categories: "",
  });

  const [stats, setStats] = useState({
    totalIdeas: 0,
    totalusers: 0,
    totalTribegoldDistributed: 0,
    totalSaleValue: 0,
  });

  useEffect(() => {
    cookies.set("visitedUser", true);
    getStats();
  }, []);

  function refreshCollection(type, filter) {
    let constraints = {}
    switch (type) {
      case CONSTANTS.FILTERS_TYPES.SEARCH:
        setGalleryFilters({ ...galleryFilters, searchString: filter });
        constraints = {...galleryFilters, searchString: filter}
        break;
      case CONSTANTS.FILTERS_TYPES.CATEGORY_FILTER:
        setGalleryFilters({ ...galleryFilters, categories: filter });
        constraints = {...galleryFilters, categories: filter}
        break;
    }
    reloadGallery(constraints);
  }

  const reloadGallery = (constraints) => {
    SignatureInterface.getSignatures(constraints).then((signatures) => {
      let response = _.get(signatures, "data.data");
      console.log(response)
      setCollectionList(response)
    });
  };

  const getStats = () => {
    let statsList = [
      StatsInterface.getTotalIdeasOnTribe(),
      StatsInterface.getTotalUsersOnTribe(),
      StatsInterface.getTotalSalesHeld(),
      // StatsInterface.getTotalTribeGoldDistributed()
    ];
    Promise.all(statsList).then((values) => {
      setStats({
        ...stats,
        totalIdeas: _.get(values[0], "data.data"),
        totalusers: _.get(values[1], "data.data"),
        totalSaleValue: _.get(values[2], "data.data"),
        // totalTribegoldDistributed:_.get(values[3],"data.data"),
      });
    });
  };

  return (
    <Container fluid>
      <div className="gallery d-flex flex-row">
        <Col md="9" className="galler-area">
          <Row
            className="search-discover d-flex flex-column justify-content-center"
            style={{
              background: `linear-gradient(rgba(255,255,255,.95), rgba(255,255,255,.95)), url(${cover})`,
              height: "300px",
            }}
          >
            <div className="ideatribe-stats d-flex align-items-center w-100">
              <Col
                md="3"
                sm="6"
                className="d-flex flex-column align-items-center stats-entry"
              >
                <span className="stats-title master-header">
                  {" "}
                  {stats.totalIdeas}
                </span>
                <span className="stats-value second-grey">Ideas submitted</span>
              </Col>
              <Col
                md="3"
                sm="6"
                className="d-flex flex-column align-items-center stats-entry"
              >
                <span className="stats-title master-header">
                  {stats.totalusers}
                </span>
                <span className="stats-value second-grey">
                  Users registered
                </span>
              </Col>
              <Col
                md="3"
                sm="6"
                className="d-flex flex-column align-items-center stats-entry"
              >
                <span className="stats-title master-header">0 </span>
                <span className="stats-value second-grey">
                  Gold Incentiviced
                </span>
              </Col>
              <Col
                md="3"
                sm="6"
                className="d-flex flex-column align-items-center stats-entry"
              >
                <span className="stats-title master-header">
                  {stats.totalSaleValue}
                </span>
                <span className="stats-value second-grey">Total Sales</span>
              </Col>
            </div>
          </Row>
          <Row
            className="d-flex flex-column align-content-center position-relative"
            style={{ top: "-10px" }}
          >
            <SearchBar searchTextChanged={refreshCollection} />
            <DiscoverMore categorySelected={refreshCollection}></DiscoverMore>
          </Row>
          <div className="separator"> </div>
          {collectionList && <Rack deck={collectionList}></Rack>}
        </Col>
        <Col md="3" className="latest-news mt-3">
          <div className="gutter-block mt-3">
            <span className="second-header color-secondary">
              Recent stories
            </span>
            <hr></hr>
            <div className="activity-entry d-flex flex-row">
              <div className="activity-content  d-flex flex-column">
                <div className="activity-title master-grey">
                  Elon in the Tribe
                </div>
                <div className="activity-description second-grey">
                  Elon musk upvoted ideaTribe in producthunt.
                </div>
              </div>
              <div className="activity-thumbnail">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg"></img>
              </div>
            </div>

            <div className="activity-entry d-flex flex-row mt-3">
              <div className="activity-content  d-flex flex-column">
                <div className="activity-title master-grey">
                  Surprise airdrop incoming!
                </div>
                <div className="activity-description second-grey">
                  0.5 Tribe Gold for completing first 10 ideas by 1st of January
                  2022
                </div>
              </div>
              <div className="activity-thumbnail">
                <img src={logo} className="primary"></img>
              </div>
            </div>

            <div className="activity-entry d-flex flex-row mt-3">
              <div className="activity-content  d-flex flex-column">
                <div className="activity-title master-grey">
                  David guetta in the Tribe
                </div>
                <div className="activity-description second-grey">
                  David guetta signed up on ideatTribe
                </div>
              </div>
              <div className="activity-thumbnail">
                <img src="https://pbs.twimg.com/profile_images/1335939208595329025/6pVApHxk_400x400.jpg"></img>
              </div>
            </div>
          </div>
          <hr></hr>

          <div className="gutter-block mt-5">
            <span className="second-header color-secondary">We hear you</span>
            <hr></hr>
            <CommentsPanel entity={CONSTANTS.ENTITIES.PUBLIC}></CommentsPanel>
          </div>
        </Col>
      </div>
    </Container>
  );
}

export default gallery;
