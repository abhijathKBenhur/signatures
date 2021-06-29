import React from "react";
import _ from "lodash";
import "./footer.scss";
import "react-toastify/dist/ReactToastify.css";
import { Container} from "react-bootstrap";


const Footer = (props) => {
 
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
                        {['Our daily reads', 'Tutorials','ICO','Roadmap'].map(product => <li>{product}</li>)}
                      </ul>
                    </div>
                    </div>
                    <div className="company">
                    <h6>Company</h6>
                    <div className="company-list">
                      <ul>
                        {['About', 'Newsletter','Blog'].map(company => <li>{company}</li>)}
                      </ul>
                    </div>
                    </div>
                    <div className="resources">
                    <h6>Resources</h6>
                    <div className="resources-list">
                      <ul>
                        {['Get help', 'Validation support','Partner with us','Contact us'].map(resource => <li>{resource}</li>)}
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
