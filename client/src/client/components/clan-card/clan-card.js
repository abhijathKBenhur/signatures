import React, { useState } from "react";
import { Button, Card, CardDeck, Image } from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";

import "./clan-card.scss";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
import { getPurposeIcon } from "../../commons/common.utils";


const ClanCard = (props) => {
  let history = useHistory();
  function openCardView() {
    history.push({
      pathname: "/clan/" + clan.PDFHash,
      state: clan,
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

  const [clan, setclan] = useState(props.clan);
  let excessCount = clan.members.length - 3;
  return (
    <Col
      key={clan._id}
      className="clan-container col-lg-2-4"
      md="4"
      lg="3"
      sm="6"
      xs="12"
    >
      <div className="card-container">
        <div className="image-container"
          onClick={() => {
            openCardView();
          }}
        >
          <span>{clan.title}</span>
          <div className="masking third-header h-100">
            <div className="description">
              {clan.description
                .split("")
                .slice(0, 40)
                .join("") + " ..."}
            </div>
          </div>
          <Image
            src={clan.thumbnail}
            className="img-fluid"
            style={{
              background: "#f1f1f1",
            }}
          />
           
        </div>
        <div className="bottom-content d-flex align-items-center ">
          {
            
            clan.members && clan.members.slice(0,3).map(member => {
              return (
                <div class="purpose-badge"> 
                  <img src={member.imageUrl} width="40px" height="40px" style={{borderRadius:"40px"}}></img>
                </div> 
              )
            })
          }
          {
            excessCount > 0 ? 
            <div class="purpose-badge excess"> 
            <span>+{excessCount}</span>
          </div> :
          <div> </div>
          }
        </div>
        {/* <div className="footer-area">testing bottom footer area</div> */}
      </div>
    </Col>
  );
};
export default ClanCard;
