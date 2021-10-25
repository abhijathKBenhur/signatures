import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./footer.scss";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import CONSTANTS from "../../commons/Constants";

import { useHistory } from "react-router-dom";

const Footer = (props) => {
  const history = useHistory();

  const redirectTo = (route) => history.push(route);
  return (
    <div>
      <nav className="navbar navbar-light bg-light flex-md-nowrap shadow appFooter fixed-bottom">
        <Container fluid>
          <div className="footer-info ">
            <div className="footer-info-wrapper d-flex justify-content-around">
              <span className="secondary-grey cursor-pointer" onClick={() => redirectTo("/about")}>About IdeaTribe</span>
              <span className="secondary-grey cursor-pointer" onClick={() => redirectTo("/Tokenomics")}>Tokenomics</span>
              <span className="secondary-grey cursor-pointer" onClick={() => redirectTo("/FAQ")}>FAQs</span>
              <span className="secondary-grey cursor-pointer" onClick={() => redirectTo("/about")}>Terms</span>
              <span className="secondary-grey cursor-pointer" onClick={() => redirectTo("/about")}>Privacy</span>
              <span className="secondary-grey cursor-pointer" onClick={() => redirectTo("/about")}>Contact Us</span>


              {/* <div className="products">
                <h6>Products</h6>
                <div className="products-list">
                  <ul>
                    {[
                      { option: "Our daily reads", route: "/daily-reads" },
                      { option: "Tutorials", route: "/tutorial" },
                      { option: "ICO", route: "/ico" },
                      { option: "Roadmap", route: "/roadmap" },
                    ].map((product) => (
                      <li onClick={() => redirectTo(product.route)}>
                        {product.option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
              {/* <div className="company">
                <h6>Company</h6>
                <div className="company-list">
                  <ul>
                    {[
                      { option: "About us", route: "/about" },
                      { option: "Whitepaper", route: "/ico" },
                      // { option: "Blog", route: "/blog" },
                    ].map((company,i) => (
                      <li key={i} onClick={() => redirectTo(company.route)}>
                        {company.option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="resources">
                <h6>Resources</h6>
                <div className="resources-list">
                  <ul>
                    {[
                      { option: "Get help", route: "/help" },
                      { option: "FAQ", route: "/support" },
                      { option: "Partner with us", route: "/partner" },
                      { option: "Contact us", route: "/contact" },
                    ].map((resource) => (
                      <li onClick={() => redirectTo(resource.route)}>
                        {resource.option}
                      </li>
                    ))}
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        </Container>
      </nav>
    </div>
  );
};

export default Footer;
