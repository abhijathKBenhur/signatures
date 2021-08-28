import { Container, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import ClanInterface from "../../interface/ClanInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import _ from 'lodash'
import "./Clans.scss";
import ClanCard from "../../components/clan-card/clan-card";

const Clans = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [currentUserDetails, setCurrentUserDetails] = useState(props.currentUserDetails);
  const [ownClans, setOwnClans] = useState([]);

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    ClanInterface.getClans({
      leader:userDetails._id
    }).then(success => {
      let clansData = _.get(success,'data.data')
      setOwnClans(clansData)
    }).catch(err => {

    })
  
  }, [reduxState.userDetails]);

  return (
    <Container className="clans">
       {ownClans.map((clan, index) => {
        return (
          <ClanCard clan={clan} key={index} index={index}  />
        );
      })}
    </Container>
  );
};

export default Clans;
