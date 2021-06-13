import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import { Row, Col, Form, InputGroup, Container, Button, Tabs, Tab  } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import  { Shimmer } from "react-shimmer";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Edit3, Award, User } from "react-feather";
import StorageInterface from "../../interface/StorageInterface";
import CollectionCard from "../../components/CollectionCard/CollectionCard";
import DiscoverMore from "../../components/discover-more/discover-more";
import Collections from "./collections";
import { setCollectionList } from "../../redux/actions";

function Profile(props) {
  //const [collectionList, setCollectionList] = useState([]);
  const [fetchInterval, setFetchInterval] = useState(0);
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(undefined);
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, collectionList = [] } = reduxState;
  let history = useHistory();
  const [key, setKey] = useState('collections');

  const dispatch = useDispatch()
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

  return (
    <Container fluid>
      <Row className="profile">
        <Col md="12" className="mycollection">
          <div className="userPane">
            <div className="first-section">
              <div className="image-part">
                <img src='http://res.cloudinary.com/thoughtblocks/image/upload/v1623506941/h8jbaj1sbtihi81jdthy.jpg' />
              </div>
              <div className="user-personal-info">
                <h5>John Doe</h5>
                <p style={{margin: '0'}}>Full stack developer</p>
                <p style={{color: '#5252f3', cursor:'pointer'}}>Epic Coders</p>
                <div className="buttons-block">
                <Button variant="success">Success</Button>{' '}
                <Button variant="outline-primary">Primary</Button>{' '}

                </div>
              </div>

            </div>
            <div className="second-section">
                <div className="detail">
                  <div className="key-name">Availability:</div>
                  <div className="value">Full time</div>
                </div>
                <div className="detail">
                  <div className="key-name">Age:</div>
                  <div className="value">30</div>
                </div>
                <div className="detail">
                  <div className="key-name">Location:</div>
                  <div className="value">Idaho, Boise</div>
                </div>
                <div className="detail">
                  <div className="key-name">Year's Experience:</div>
                  <div className="value">6</div>
                </div>
            </div>
            {/* <div className="profileHolder">
              <Award size={50}></Award>
            </div> */}
          </div>
          <div className="separator">
          <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="collections" title="Collection">
            <Collections collectionList={collectionList} />
        </Tab>
        <Tab eventKey="profile" title="Profile">
                 <h1>Profile tab</h1>

        </Tab>
        <Tab eventKey="contact" title="Contact" >
                 <h1>COntact tab</h1>

        </Tab>
      </Tabs>
             </div>
          
        </Col>
      </Row>
      <DiscoverMore />
    </Container>
  );
}

export default Profile;
