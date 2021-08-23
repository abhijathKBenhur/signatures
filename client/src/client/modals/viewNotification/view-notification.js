import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import _ from "lodash";
import NotificationInterface from "../../interface/NotificationInterface";
import CONSTANTS from "../../commons/Constants";
import "./view-notification.scss";
import { showToaster } from "../../commons/common.utils";
const ViewNotification = ({ ...props }) => {
  const [viewNotificationState, setViewNotificationState] = useState({
    showReply: false,
    replyTxt: "",
  });

  const showReplyBlock = () =>
    _.get(props, "notification.action") === "PERSONAL_MESSAGE";

  const replyMessage = () => {
    setViewNotificationState({ ...viewNotificationState, showReply: true });
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setViewNotificationState({ ...viewNotificationState, replyTxt: value });
  };

  const sendMessage = () => {
    console.log(
      "viewNotificationState.replyTxt ===",
      viewNotificationState.replyTxt
    );

    NotificationInterface.postNotification(
      _.get(props, "notification.to"),
      _.get(props, "notification._id"),
      _.get(props, "notification.action"),
      CONSTANTS.ACTION_STATUS.PENDING,
      viewNotificationState.replyTxt
    )
      .then((success) => {
        props.onHide();
        showToaster("Message sent!", {type: 'success'})
      })
      .catch((error) => {
        console.log("message could not be created");
      });
  };
  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="md"
      className="view-notification-modal"
      dialogClassName="view-notification-modal-dialog"
      centered
    >
      <Modal.Body className="view-notification-modal-body">
        <div className="modal-header-wrapper master-grey">
          <h4>{_.get(props, "notification.from")} </h4>
          <hr></hr>
        </div>
        <div className="wrapper">
        <div className="notification-container second-grey">
            {_.get(props, "notification.message")}
          </div>
          {showReplyBlock() && (
            <div className="reply-block mt-3">
              {_.get(viewNotificationState, "showReply") ? (
                <div class="d-flex flex-column w-100">
                  <Form.Control
                    as="textarea"
                    name="replyTxt"
                    value={viewNotificationState.replyTxt}
                    className="w-100"
                    onChange={(e) => handleChange(e)}
                  />
                  <Button variant="primary"
                    className=" mt-3 justify-self-end"
                    aria-hidden="true"
                    onClick={() => sendMessage()}
                  >Send</Button>
                </div>
              ) : (
                <Button variant="primary"
                  className="mt-3  justify-self-end"
                  aria-hidden="true"
                  onClick={() => replyMessage()}
                >Reply</Button>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ViewNotification;
