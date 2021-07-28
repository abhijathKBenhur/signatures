import React, { useState } from "react";
import { Button, Card, CardDeck, Image } from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";

import "./collection-card.scss";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
import { getPurposeIcon } from "../../commons/common.utils";


const CollectionCard = (props) => {
  let history = useHistory();
  function openCardView() {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }

  const goToUserProfile = (id) => {
    let history = useHistory();
    history.push({
      pathname: "/profile/" + id,
      state: {
        userName: id,
      },
    });
  };

  const [signature, setSignature] = useState(props.collection);
  return (
    <Col
      key={signature._id}
      className="main-container col-lg-2-4"
      md="4"
      lg="3"
      sm="6"
      xs="12"
    >
      <div className="card-container">
        <div className="card-float-header">
          <div className="user-logo">
            <Image src={signature.owner.imageUrl} color="F3F3F3" />
            <div className="user-popup-outer">
              <div className="user-popup">
                <div className="user-logo">
                  <Image src={signature.owner.imageUrl} />
                </div>
                <div>
                  {JSON.parse(signature.category) &&
                    JSON.parse(signature.category)
                      .slice(0, 2)
                      .map((category, i) => {
                        return (
                          <Button key={i} disabled variant="pill">
                            {category.value}
                          </Button>
                        );
                      })}
                </div>
              </div>
            </div>
          </div>
          <div
            className="user-name third-header ml-2"
            onClick={(event) => {
              event.stopPropagation();
              goToUserProfile(signature.creator.userName);
            }}
          >
            {signature.title}
          </div>

          <div className="date second-grey">
            {moment(signature.createdAt).format("DD-MMM-YYYY")}
          </div>
        </div>
        <div className="image-container"
          onClick={() => {
            openCardView();
          }}
        >
          <div className="masking third-header h-100">
            <div className="description">
              {signature.description
                .split("")
                .slice(0, 40)
                .join("") + " ..."}
            </div>
            <div className="title master-grey color-white h-100">
              {signature.title}
            </div>
          </div>
          <Image
            src={signature.thumbnail}
            className="img-fluid"
            style={{
              background: "#f1f1f1",
            }}
          />
           
        </div>
        <div className="bottom-content d-flex justify-content-between align-items-center ">
          <div class="tag-n-location">
            <div className="location second-header">{signature.location}Location</div>
            <div className="tags second-grey">{JSON.parse(signature.category)[0].label}</div>
          </div>
          <div class="purpose-badge">
              <i className={getPurposeIcon(signature.purpose)}></i>
          </div>
        </div>
        {/* <div className="footer-area">testing bottom footer area</div> */}
      </div>
    </Col>
  );
};
export default CollectionCard;
