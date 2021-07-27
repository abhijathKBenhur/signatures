import { Container, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import ClanInterface from "../../interface/ClanInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import _ from 'lodash'
import "./Clans.scss";

const Clans = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [currentUserDetails, setCurrentUserDetails] = useState(props.currentUserDetails);
  const [ownClans, setOwnClans] = useState([]);

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    ClanInterface.getClans({
      leader:userDetails.userName
    }).then(success => {
      let clansData = _.get(success,'data.data')
      setOwnClans(clansData)
    }).catch(err => {

    })
  
  }, [reduxState.userDetails]);

  return (
    <Container className="clans">
     {ownClans.map(clan =>{
       return (
         <div>{clan.name}</div>
       )
     })}
    </Container>
  );
};

export default Clans;
