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
            <span className="master-header color-primary">{props.action} </span>
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
         
        </div>
        <div className="mt-2 mb-3">
          {props.list.map((userName) => (
            <div className="cursor-pointer mt-2">
              <Button variant="action">
              <i className="fa fa-user second-grey" aria-hidden="true"></i>
              </Button>
              
              <span className="second-grey p-1 ml-1">{userName}</span>
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
