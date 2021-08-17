import React, { useEffect, useState, useRef } from "react";
import { ListGroup, Form } from "react-bootstrap";
import CONSTANTS from "../../commons/Constants";
import {getInitialSubString} from "../../commons/common.utils"
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
      entity: props.entity,
    }).then((success) => {
      let comments = success.data;
      setComments(comments.data);
    });
  }

  const handleChange = (event) => {
    const { value } = event.target;
    if (event.key == "Enter") {
      event.target.blur();
      event.target.value = "";
      CommentsInterface.postComment(
        loggedInUserDetails.userName,
        props.idea.ideaID,
        CONSTANTS.ACTIONS.COMMENT,
        value,
        CONSTANTS.ENTITIES.IDEA
      ).then((success) => {
        let commentsCOpy = _.clone(comments)
        commentsCOpy.push({
          from : loggedInUserDetails.userName,
          to: props.idea.ideaID,
          action: CONSTANTS.ACTIONS.COMMENT,
          comment: value,
          entity:  CONSTANTS.ENTITIES.IDEA
        })
        setComments(commentsCOpy)
        NotificationInterface.postNotification(
          loggedInUserDetails.userName,
          props.idea.owner.userName,
          CONSTANTS.ACTIONS.COMMENT,
          CONSTANTS.ACTION_STATUS.COMPLETED,
          loggedInUserDetails.userName + " addded a comment on your idea."
        );
      });
    } else {
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

      {_.map(comments, (comment) => {
        return (
          <div className="notification-item d-flex flex-row align-items-center pb-1">
            <div className="icon mr-2 p-1">
              <i className="fa fa-comment-o"></i>
            </div>
            <div className="content">
              <div className="top master-grey">{comment.from}</div>
              <div className="bottom second-grey">{getInitialSubString(comment.comment,25)}</div>
            </div>
          </div>
        );
      })}
    </ListGroup>
  );
};

export default CommentsPanel;
