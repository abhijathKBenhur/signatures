import _ from "lodash";
import { Row, Col, Carousel, Container, Image } from "react-bootstrap";
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
import berklee from "../../../assets/images/announcements/berklee.png"
import TRBG from "../../../assets/images/announcements/TRBG.png"
import brand from "../../../assets/images/announcements/logo_blue.png"
import cover from "../../../assets/images/cover.png"

import CommentsPanel from "../../components/comments/CommentsPanel";
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
          {/* <Row
            className="search-discover d-flex flex-column justify-content-center"
            style={{
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
          </Row> */}
          <Row
            className="d-flex flex-column align-content-center position-relative justify-content-center search-container"
            style={{
              background: `url(${cover})`,
                height: "300px",
            }}
          >
            <SearchBar searchTextChanged={refreshCollection} />
            <DiscoverMore categorySelected={refreshCollection}></DiscoverMore>
          </Row>
          <div className="separator"> </div>
          {collectionList && <Rack deck={collectionList}></Rack>}
        </Col>
        <Col md="3" className="latest-news desktop-view mt-3">
          <div className="gutter-block mt-3">
            {/* <span className="second-header color-primary">
              Recent stories
            </span>
            <hr></hr> */}
            <div className="activity-entry d-flex flex-row">
              <div className="activity-content  d-flex flex-column">
                <div className="activity-title master-grey">
                  Partnership announcement
                </div>
                <div className="activity-description second-grey">
                  IdeaTribe inks MoU with Berklee School of Music to collaborate on developing principles for music rights and their use.
                </div>
              </div>
              <div className="activity-thumbnail">
                <Image src={berklee}  height="50px" width="50px" roundedCircle />
              </div>
            </div>

            <div className="activity-entry d-flex flex-row mt-3">
              <div className="activity-content  d-flex flex-column">
                <div className="activity-title master-grey">
                  It’s raining TribeGold!
                </div>
                <div className="activity-description second-grey">
                  Earn TribeGold for publishing ideas and inviting friends.
                </div>
              </div>
              <div className="activity-thumbnail">
              <Image src={TRBG} width="50px"  height="50px"  />
              </div>
            </div>

            <div className="activity-entry d-flex flex-row mt-3">
              <div className="activity-content  d-flex flex-column">
                <div className="activity-title master-grey">
                  Versioning Feature coming soon
                </div>
                <div className="activity-description second-grey">
                  You can soon update & re-tokenize your ideas. That way you don’t have to wait for your idea to be perfect to mint an NFT of it.
                </div>
              </div>
              <div className="activity-thumbnail">
              <Image src={brand}  width="50px"  height="50px" roundedCircle />
              </div>
            </div>
          </div>
          <hr></hr>

          <div className="gutter-block mt-5">
            <span className="second-header color-primary">Talk to the tribe</span>
            <CommentsPanel entity={CONSTANTS.ENTITIES.PUBLIC}></CommentsPanel>
          </div>
        </Col>
      </div>
    </Container>
  );
}

export default gallery;
