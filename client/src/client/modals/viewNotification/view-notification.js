import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Image } from "react-bootstrap";
import _ from "lodash";
import NotificationInterface from "../../interface/NotificationInterface";
import CONSTANTS from "../../commons/Constants";
import "./view-notification.scss";
import { showToaster } from "../../commons/common.utils";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
const ViewNotification = ({ ...props }) => {
  let history = useHistory();
  const [viewNotificationState, setViewNotificationState] = useState({
    showReply: false,
    replyTxt: "",
  });
  const reduxState = useSelector((state) => state, shallowEqual);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const showReplyBlock = () =>
    _.get(props, "notification.action") === "PERSONAL_MESSAGE";

  const replyMessage = () => {
    setViewNotificationState({ ...viewNotificationState, showReply: true });
  };
  const handleChange = (e) => {
    const { value } = e.target;
    setViewNotificationState({ ...viewNotificationState, replyTxt: value });
  };

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
  }, [reduxState.userDetails]);

  const sendMessage = () => {
    console.log(
      "viewNotificationState.replyTxt ===",
      viewNotificationState.replyTxt
    );

    NotificationInterface.postNotification(
      _.get(loggedInUserDetails, "_id"),
      _.get(props, "notification.from.userName"),
      _.get(props, "notification.action"),
      CONSTANTS.ACTION_STATUS.PENDING,
      viewNotificationState.replyTxt,
      _.get(props, "notification.payload")
    )
      .then((success) => {
        props.onHide();
        showToaster("Message sent!", { type: "success" });
      })
      .catch((error) => {
        console.log("message could not be created");
      });
  };

  const getNotificationActionText = (notification) => {
    switch (notification.action) {
      case CONSTANTS.ACTIONS.CREATE_CLAN:
        return "View clan"
        break;
      case CONSTANTS.ACTIONS.COMMENT:
      case CONSTANTS.ACTIONS.UPVOTE:
        return "View idea"
        break;
      case CONSTANTS.ACTIONS.PERSONAL_MESSAGE:
        case CONSTANTS.ACTIONS.FOLLOW:
        return "View profile"
        break;
    }
  };

  const makeCustomAction = (notification) => {
    switch (notification.action) {
      case CONSTANTS.ACTIONS.CREATE_CLAN:
        history.push({
          pathname:
            "/clan/" + _.get(props, "notification.payload.clanID"),
        });
        break;
      case CONSTANTS.ACTIONS.COMMENT:
      case CONSTANTS.ACTIONS.UPVOTE:
        let PDFHash = JSON.parse(_.get(props, "notification.payload")).PDFHash
        history.push({
          pathname:
            "/signature/" + PDFHash,
        });
        break;
      case CONSTANTS.ACTIONS.PERSONAL_MESSAGE:
        history.push({
          pathname:
            "/profile/" + _.get(props, "notification.from.userName"),
        });
        break;
    }
  };

  

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      close
      size="md"
      className="view-notification-modal"
      dialogClassName="view-notification-modal-dialog"
      centered
    >
      <Modal.Body className="view-notification-modal-body">
        <div className="modal-header-wrapper master-grey">
          <Image
            src={_.get(props, "notification.from.imageUrl")}
            color="F3F3F3"
            className="user-circle mr-1"
            onClick={() => {
              history.push({
                pathname:
                  "/profile/" + _.get(props, "notification.from.userName"),
              });
            }}
          />
          <span className="master-grey">
            {_.get(props, "notification.from.userName")}{" "}
          </span>
          <hr></hr>
        </div>
        <div className="wrapper">
          <div className="notification-container second-grey">
            {_.get(props, "notification.message")}
          </div>
          {viewNotificationState.showReply && (
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
                  <Button
                    variant="secondary"
                    className=" mt-3 justify-self-end"
                    aria-hidden="true"
                    onClick={() => sendMessage()}
                  >
                    Send
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  className="mt-3  justify-self-end"
                  aria-hidden="true"
                  onClick={() => replyMessage()}
                >
                  Reply
                </Button>
              )}
            </div>
          )}
          <hr></hr>
        </div>
        { !viewNotificationState.showReply &&  <div className="footer">
          <Button
            variant="secondary"
            className="button"
            bsstyle="primary"
            onClick={() => {
              makeCustomAction(_.get(props, "notification"))
            }}
          >
            {" "}
            {getNotificationActionText(_.get(props, "notification"))}
          </Button>
          <Button
            variant="secondary"
            className="button ml-2"
            bsstyle="primary"
            onClick={() => {
              replyMessage();
            }}
          >
            {" "}
            Send a message
          </Button>
        </div>}
      </Modal.Body>
    </Modal>
  );
};

export default ViewNotification;
