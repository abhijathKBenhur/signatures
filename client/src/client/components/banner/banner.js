import React, {  useEffect, useState  } from "react";
import _ from "lodash";
import "./banner.scss";
import { Container, Row, Col } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";

const Banner = (props) => {
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(undefined);
  const reduxState = useSelector((state) => state, shallowEqual);
  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  return (
        <Container fluid className="banner">
          <div >
              test
          </div>
        </Container>
  );
};

export default Banner;
