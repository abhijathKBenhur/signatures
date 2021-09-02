import React, { useState, useEffect } from "react";
import { Button, Card, CardDeck, Image } from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import "./clan-card.scss";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
import { getPurposeIcon } from "../../commons/common.utils";
import ClanInterface from "../../interface/ClanInterface";

const ClanCard = (props) => {
  const [clanMembers, setClanMembers] = useState([]);
  const [clan, setclan] = useState(props.clan);
  let history = useHistory();
  function openCardView() {
    history.push({
      pathname: "/clan/" + clan.name,
      state: clan,
    });
  }

  useEffect(() => {
    ClanInterface.getClanMembers({
      clanId: clan._id,
    })
      .then((success) => {
        let clanMembersProfiles = _.get(success, "data.data");
        setClanMembers(clanMembersProfiles);
      })
      .catch((err) => {});
  }, []);

  const goToUserProfile = (id) => {
    let history = useHistory();
    history.push({
      pathname: "/profile/" + id,
      state: {
        userName: id,
      },
    });
  };

  let excessCount = clanMembers.length - 3;
  return (
      <Col
        key={clan._id}
        className="clan-container "
        md="3"
        lg="4"
        sm="6"
        xs="12"
      >
        <div className="card-container">
          <div
            className="image-container"
            onClick={() => {
              openCardView();
            }}
          >
            <span className="p-2 color-primary">{clan.name}</span>
            <div className="masking third-header h-100">
              <div className="description">
                {clan.description
                  .split("")
                  .slice(0, 40)
                  .join("") + " ..."}
              </div>
            </div>
          </div>
          <div className="bottom-content d-flex align-items-center ">
            {clanMembers &&
              clanMembers.slice(0, 3).map((member) => {
                return (
                  <div class="purpose-badge">
                    <img
                      src={member.imageUrl}
                      width="40px"
                      height="40px"
                      style={{ borderRadius: "40px" }}
                    ></img>
                  </div>
                );
              })}
            {excessCount > 0 ? (
              <div class="purpose-badge excess">
                <span>+{excessCount}</span>
              </div>
            ) : (
              <div> </div>
            )}
          </div>
          {/* <div className="footer-area">testing bottom footer area</div> */}
        </div>
      </Col>
  );
};
export default ClanCard;
