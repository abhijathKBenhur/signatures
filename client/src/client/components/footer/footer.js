import React, {  useEffect, useState  } from "react";
import _ from "lodash";
import "./footer.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import CONSTANTS from '../../commons/Constants';

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
          <div className="footer-info">
              <div className="footer-info-wrapper">
                    <div className="products">
                    <h6>Products</h6>
                    <div className="products-list">
                      <ul>
                        {['Must-read articles', 'Daily newsletter','Pocket Premium','Save to Pocket extensions'].map(product => <li>{product}</li>)}
                      </ul>
                    </div>
                    </div>
                    <div className="company">
                    <h6>Company</h6>
                    <div className="company-list">
                      <ul>
                        {['About', 'Careers','Blog'].map(company => <li>{company}</li>)}
                      </ul>
                    </div>
                    </div>
                    <div className="resources">
                    <h6>Resources</h6>
                    <div className="resources-list">
                      <ul>
                        {['Get help', 'Developer API','Pocket for publishers','Advertise'].map(resource => <li>{resource}</li>)}
                      </ul>
                    </div>
                    </div>
                </div>
          </div>
          <div className="metamask-id">
            here is the mask ID {currentMetamaskAccount}
          </div>
        </Container>
      </nav>
    </div>
  );
};

export default Header;
