import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
  Button,
  Col,
  Row,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import Select from "react-select";
import _ from "lodash";
import "./people-list.scss";
import UserInterface from "../../interface/UserInterface";
const PeopleList = ({ ...props }) => {
  const [editProfile, setEditProfile] = useState({
    imageUrl: props.userDetails.imageUrl || "",
  });

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="md"
      className="edit-profile-modal"
      dialogClassName="edit-profile-modal-dialog"
      centered
    >
      <Modal.Body className="edit-profile-modal-body">
        <div className="modal-header-wrapper row">
          <div className="col-11">
            <h4>{props.action} </h4>
          </div>
          <hr/>
          <div>
            {/* <img
              src={editProfile.imageUrl}
              height={30}
              width={30}
              style={{ borderRadius: "100px" }}
            ></img> */}
          </div>
          <hr></hr>
          <div className="image-placeholder d-flex align-items-center flex-column mb-3">
            <span>{editProfile.userName}</span>
          </div>
        </div>
        <div className="mt-2 mb-3">
          {props.list.map((userName) => (
            <div className="cursor-pointer mt-2">
              <i className="fa fa-user master-grey" aria-hidden="true"></i>
              <span className="master-grey p-1">{userName}</span>
              </div>
          ))}

        </div>
        <div className="wrapper">
          <Row className="button-section  d-flex mb-4">
            <Col xs="12" className="button-bar">
              {/* <Button className="cancel-btn mr-2" onClick={props.onHide}>
                Close
              </Button> */}
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PeopleList;
