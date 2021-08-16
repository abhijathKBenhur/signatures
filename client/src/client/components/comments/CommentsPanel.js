import React, { useEffect, useState, useRef } from "react";
import { ListGroup, Form } from "react-bootstrap";
import CONSTANTS from "../../commons/Constants";
import ViewNotification from "../../modals/viewNotification/view-notification";
import _ from "lodash";
import "./comments.scss";
import CommentsInterface from "../../interface/CommentsInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotificationInterface from "../../interface/NotificationInterface";

const CommentsPanel = (props) => {
  const reduxState = useSelector((state) => state, shallowEqual);
  const [comments, setComments] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
    console.log("userDetails = ", userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    loadComments();
  }, []);

  function loadComments() {
    console.log("props.idea" + props.idea);
    CommentsInterface.getComments({
      to: props.idea.ideaID,
    }).then((success) => {
      let newComment = success.data;
      setComments(newComment,comments)
    });
  }


  const handleChange = (event) => {
    const {  value } = event.target;
    if (event.key == "Enter") {
      event.preventDefault();
      CommentsInterface.postComment(loggedInUserDetails.userName,props.idea.ideaId,CONSTANTS.COMMENT,newComment,{}).then(success => {
        NotificationInterface.postNotification(loggedInUserDetails.userName,props.idea.owner.userName,CONSTANTS.ACTIONS.COMMENT,CONSTANTS.ACTION_STATUS.COMPLETED,loggedInUserDetails.userName + " addded a comment on your idea.")
      })
    } else{
      setNewComment(value);
    }
  };

  return (
    <ListGroup className="">
      <Form.Control
        as="textarea"
        name="description"
        placeholder="Add a comment"
        onKeyUp={(e) => handleChange(e)}
        style={{ borderRadius: 5 }}
        className="mb-2"
      />
      <div
        className={
          true
            ? "notification-item d-flex flex-row align-items-center pb-1"
            : "notification-item d-flex flex-row align-items-center pb-1 unread"
        }
      >
        <div className="icon mr-2 p-1">
          <i className="fa fa-comment-o"></i>
        </div>
        <div className="content">
          <div className="top master-grey">John doe</div>
          <div className="bottom second-grey">Innovative idea</div>
        </div>
      </div>
      <div
        className={
          true
            ? "notification-item d-flex flex-row align-items-center pb-1"
            : "notification-item d-flex flex-row align-items-center pb-1 unread"
        }
      >
        <div className="icon mr-2 p-1">
          <i className="fa fa-comment-o"></i>
        </div>
        <div className="content">
          <div className="top master-grey">Michael </div>
          <div className="bottom second-grey">Awesome</div>
        </div>
      </div>
      <div
        className={
          true
            ? "notification-item d-flex flex-row align-items-center pb-1"
            : "notification-item d-flex flex-row align-items-center pb-1 unread"
        }
      >
        <div className="icon mr-2 p-1">
          <i className="fa fa-comment-o"></i>
        </div>
        <div className="content">
          <div className="top master-grey">Tessy</div>
          <div className="bottom second-grey">Great!</div>
        </div>
      </div>
      <div
        className={
          true
            ? "notification-item d-flex flex-row align-items-center pb-1"
            : "notification-item d-flex flex-row align-items-center pb-1 unread"
        }
      >
        <div className="icon mr-2 p-1">
          <i className="fa fa-comment-o"></i>
        </div>
        <div className="content">
          <div className="top master-grey">John doe</div>
          <div className="bottom second-grey">Innovative idea</div>
        </div>
      </div>
      <div
        className={
          true
            ? "notification-item d-flex flex-row align-items-center pb-1"
            : "notification-item d-flex flex-row align-items-center pb-1 unread"
        }
      >
        <div className="icon mr-2 p-1">
          <i className="fa fa-comment-o"></i>
        </div>
        <div className="content">
          <div className="top master-grey">John doe</div>
          <div className="bottom second-grey">Innovative idea</div>
        </div>
      </div>
      {/* {_.get(notificationState, 'viewNotification')  &&  <ViewNotification notification={_.get(notificationState, 'selectedNotification')}
         onHide={() => setNotificationState({ ...notificationState, viewNotification: false, selectedNotification: {} })} />} */}
    </ListGroup>
  );
};

export default CommentsPanel;
