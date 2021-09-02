import React, { useEffect, useState } from "react";
import { Button, Card, CardDeck, Image } from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";
import _ from "lodash";
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
    history.push({
      pathname: "/profile/" + id,
      state: {
        userName: id,
      },
    });
  };
  useEffect(() => {
    setSignature(props.collection);
  }, [props]);

  const [signature, setSignature] = useState(props.collection);

  const getClassNames = () => {
    return "bottom-content d-flex justify-content-between align-items-center " +
      _.get(JSON.parse(signature.category), "value")
    ;
  };

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
            <Image src={_.get(signature,'owner.imageUrl')} color="F3F3F3" />
            <div className="user-popup-outer">
              <div className="user-popup">
                <div className="user-logo">
                  <Image src={_.get(signature,'owner.imageUrl')} />
                </div>
                <div>
                  <Button disabled variant="pill">
                    {JSON.parse(signature.category).label}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="user-name third-header ml-2"
            onClick={() => {
              goToUserProfile(_.get(signature,'owner.userName'));
            }}
          >
            {signature.owner.userName}
          </div>
        </div>
        <div
          className="image-container"
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
        <div className={getClassNames()}>
          <div class="tag-n-location">
            <div className=" second-header timestamp">
              {moment(signature.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </div>
            <div className="tags second-grey">
              {signature.location || "Global"}
            </div>
          </div>
          <div class="purpose-badge">
            <i
              className={getPurposeIcon(
                _.get(signature, "purpose.purposeType") ||
                  _.get(signature, "purpose")
              )}
            ></i>
          </div>
        </div>
        {/* <div className="footer-area">testing bottom footer area</div> */}
      </div>
    </Col>
  );
};
export default CollectionCard;
