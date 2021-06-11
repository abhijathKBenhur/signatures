import React, {  useEffect, useState  } from "react";
import _ from "lodash";
import "./footer.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
const Header = (props) => {
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(undefined);
  const reduxState = useSelector((state) => state, shallowEqual);
  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
  }, [reduxState]);

  return (
    <div>
      <nav className="navbar navbar-light bg-light flex-md-nowrap shadow appFooter justify-content-center">
        <Container fluid>
          here is the mask ID {currentMetamaskAccount}
        </Container>
      </nav>
    </div>
  );
};

export default Header;
