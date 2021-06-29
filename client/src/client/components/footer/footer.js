import React, { useEffect, useState } from "react";
import _ from "lodash";
import "./footer.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Row, Col } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import CONSTANTS from "../../commons/Constants";

const Footer = (props) => {
  return (
    <div>
      <nav className="navbar navbar-light bg-light flex-md-nowrap shadow appFooter justify-content-center">
        <Container fluid>
          <div className="footer-info">
            <div className="footer-info-wrapper">
              {/* <div className="Support">
                <h6>Products</h6>
                <div className="products-list">
                  <ul>
                    {["Get Help", "FAQs", "Contact US", "Roadmap"].map(
                      (product) => (
                        <li>{product}</li>
                      )
                    )}
                  </ul>
                </div>
              </div> */}
              <div className="company">
                <h6>Company</h6>
                <div className="company-list">
                  <ul>
                    {["About US", "Whitepaper", "Blogs"].map((company) => (
                      <li>{company}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="resources">
                <h6>Resources</h6>
                <div className="resources-list">
                  <ul>
                    {["Get help", "FAQs", "Partner with us", "Contact us"].map(
                      (resource) => (
                        <li>{resource}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </div>
  );
};

export default Footer;
