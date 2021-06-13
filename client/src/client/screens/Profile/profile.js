import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Container,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import { Shimmer } from "react-shimmer";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Edit3, Award, User } from "react-feather";
import StorageInterface from "../../interface/StorageInterface";
import { GoogleLogin } from 'react-google-login';
import DiscoverMore from "../../components/discover-more/discover-more";
import Collections from "./collections";
import { setCollectionList } from "../../redux/actions";

function Profile(props) {
  //const [collectionList, setCollectionList] = useState([]);
  const [fetchInterval, setFetchInterval] = useState(0);
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    undefined
  );
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, collectionList = [] } = reduxState;
  let history = useHistory();
  const [key, setKey] = useState("collections");

  const dispatch = useDispatch();
  useEffect(() => {
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  useEffect(() => {
    fetchSignatures();
    // const fetchInterval = setInterval(() => {
    MongoDBInterface.getSignatures({
      userName: currentMetamaskAccount,
      getOnlyNulls: true,
    }).then((signatures) => {
      let response = _.get(signatures, "data.data");
      if (response.length == 0) {
        clearInterval(fetchInterval);
        fetchSignatures();
      }
    });
    //  }, 1000);
    setFetchInterval(fetchInterval);
    return () => clearInterval(fetchInterval);
  }, []);

  function fetchSignatures() {
    MongoDBInterface.getSignatures({ userName: currentMetamaskAccount }).then(
      (signatures) => {
        let response = _.get(signatures, "data.data");
        let isEmptyPresent = _.find(response, (responseItem) => {
          return _.isEmpty(responseItem.ideaID);
        });
        // if(isEmptyPresent){
        //   clearInterval(fetchInterval)
        // }
        dispatch(setCollectionList(response));
      }
    );
  }
  function responseGoogle(response){
    console.log(response)
  }

  return (
    <Container fluid>
      <Row className="profile">
        <Col md="12" className="mycollection">
          <div className="userPane">
            <div className="first-section">
              <div className="image-part">
                <img src="http://res.cloudinary.com/thoughtblocks/image/upload/v1623506941/h8jbaj1sbtihi81jdthy.jpg" />
              </div>
              <div className="user-personal-info">
                <h5>John Doe</h5>
                <p style={{ margin: "0" }}>Full stack developer</p>
                <p style={{ color: "#5252f3", cursor: "pointer" }}>
                  Epic Coders
                </p>
                <div className="buttons-block"></div>
              </div>
            </div>
            <div className="second-section">
            <GoogleLogin
            // secretKey:I0YMKAriMhc6dB7bN44fHuKj
              clientId="639340003430-d17oardcjjpo9qnj0m02330l5orgn8sp.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
            </div>
            {/* <div className="profileHolder">
              <Award size={50}></Award>
            </div> */}
          </div>
          <div className="separator">
            {/* <div className="intial-block">
              <h5>Website</h5>
              <div className="options">
                <p>Website</p>
                <p>Blog</p>
                <p>Portfolio</p>
              </div>
            </div> */}
            <div className="tabs-wrapper">
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
              >
                <Tab eventKey="collections" title="Collection">
                  <div className="collection-wrapper">
                    <div className="middle-block">
                      <Collections collectionList={collectionList} />
                    </div>
                  </div>
                </Tab>
                <Tab eventKey="profile" title="Transactions">
                  <h1>Profile tab</h1>
                </Tab>
              </Tabs>
            </div>
            {/* <div className="right-block">
              <h5>Website</h5>
              <div className="options">
                <p>Website</p>
                <p>Blog</p>
                <p>Portfolio</p>
              </div>
            </div> */}
          </div>
        </Col>
      </Row>
      <DiscoverMore />
    </Container>
  );
}

export default Profile;
