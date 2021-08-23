import _ from "lodash";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";
import Select from "react-select";
import CONSTANTS from "../../commons/Constants";
import NotificationInterface from "../../interface/NotificationInterface";
import "./send-message.scss";
import { shallowEqual, useSelector } from "react-redux";

const SendMessage = ({ ...props }) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const {
    metamaskID = undefined,
    userDetails = {},
    collectionList = [],
  } = reduxState;


  const [sendMessage, setSendMessage] = useState({
    to: props.userDetails.userName,
    from: userDetails._id,
    message: "",
    status: CONSTANTS.ACTION_STATUS.PENDING
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSendMessage({ ...sendMessage, [name]: value });
  };

  const sendMessageAction = () => {
   
    let payload = {
      ...sendMessage,
    };
    NotificationInterface.postNotification(sendMessage.from, sendMessage.to, CONSTANTS.ACTIONPERSONAL_MESSAGE, sendMessage.status, sendMessage.message)
      .then((success) => {
        console.log("message created");
        props.onHide();
      })
      .catch((error) => {
        console.log("message could not be created");
      });
  };



  const handleBilletChange = (billet) => {
    setSendMessage({
      ...sendMessage,
      selectedBillet: billet,
    });
  };

 

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="md"
      className="send-message-modal"
      dialogClassName="send-message-modal-dialog"
      centered
    >
      <Modal.Body className="send-message-modal-body">
        <div className="modal-header-wrapper">
          <h4>Send Message </h4>
          <hr></hr>
        </div>
        <div className="wrapper">
          <Row>
            <Col md="12">

              <Row className="clan-leader-row mb-4">
                <Col md="12" className="">
                  <div className="clan-leader-label second-grey">
                    <Form.Label>Sending to</Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="to"
                    disabled
                    value={props.userDetails.userName}
                    onChange={(e) => handleChange(e)}
                  />
                </Col>
              </Row>
            </Col>
         </Row>

          <Row className="clan-description-row mb-4">
            <Col md="12" className="">
              <div className="clan-description-label second-grey">
                <Form.Label>Message</Form.Label>
              </div>
              <Form.Control
                as="textarea"
                rows={7}
                name="message"
                style={{ resize: "none" }}
                value={sendMessage.message}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>

          {/* <Row className="billet-row mb-4">
            <Col md="12">
              <div className="billet-label second-grey">
                <Form.Label>My Billet  </Form.Label>
              </div>
             { _.get(props, 'billetList') &&  <Select
                value={sendMessage.selectedBillet}
                options={_.get(props, 'billetList').map((item) => {
                  return {
                    value: item.title,
                    id: item.ideaID,
                    label: (
                      <div>
                        {item.title}{" "}
                      </div>
                    ),
                  };
                })}
                onChange={handleBilletChange}
                placeholder="My Billet"
              />}
            </Col>
          </Row> */}

         <Row className="button-section  d-flex mb-4">
            <Col xs="12" className="button-bar">
              <Button className="cancel-btn mr-2" onClick={props.onHide}>
                Cancel
              </Button>
              <Button
                className="submit-btn"
                onClick={() => sendMessageAction()}
              >
                Send
              </Button>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SendMessage;
