import React, { useEffect, useState, useRef } from "react";
import { ListGroup, Form, Image } from "react-bootstrap";
import CONSTANTS from "../../commons/Constants";
import {getInitialSubString} from "../../commons/common.utils"
import _ from "lodash";
import { useHistory } from "react-router-dom";
import "./comments.scss";
import CommentsInterface from "../../interface/CommentsInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotificationInterface from "../../interface/NotificationInterface";

const CommentsPanel = (props) => {
  let history = useHistory();
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

  function getCommentDestination() {
    switch(props.entity){
      case CONSTANTS.ENTITIES.IDEA:
        return props.idea.ideaID
        break;
        case CONSTANTS.ENTITIES.PUBLIC:
          return CONSTANTS.ENTITIES.PUBLIC
          break;
    }
  }

  function loadComments() {
    console.log("props.idea" + props.idea);
    CommentsInterface.getComments({
      to: getCommentDestination(),
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
        loggedInUserDetails._id,
        getCommentDestination(),
        CONSTANTS.ACTIONS.COMMENT,
        value,
        props.entity,
      ).then((success) => {
        let commentsCOpy = _.clone(comments)
        commentsCOpy.push({
          from : loggedInUserDetails,
          to: getCommentDestination(),
          action: CONSTANTS.ACTIONS.COMMENT,
          comment: value,
          entity: props.entity,
        })
        setComments(commentsCOpy)
        if(_.get(props,'idea.owner.userName')){
          NotificationInterface.postNotification(
            loggedInUserDetails._id,
            props.idea.owner.userName,
            CONSTANTS.ACTIONS.COMMENT,
            CONSTANTS.ACTION_STATUS.PENDING,
            value,
            JSON.stringify({
              ideaID: _.get(props.idea,'PDFHash')
            })
          );
        }
        
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
        className="mb-2 comment-entry"
      />

      {_.map(comments, (comment) => {
        return (
          <div className="comment-item d-flex flex-row align-items-center pb-1">
            <div className="icon mr-2 p-1 cursor-pointer">
            <Image src={comment.from.imageUrl} color="F3F3F3" className="user-circle" onClick={() => {
              history.push({
                pathname: "/profile/" + comment.from.userName,
              });
            }}/>
            </div>
            <div className="content">
              <div className="top master-grey  cursor-pointer">{comment.from.userName}</div>
              <div className="bottom second-grey">{getInitialSubString(comment.comment,25)}</div>
            </div>
          </div>
        );
      })}
    </ListGroup>
  );
};

export default CommentsPanel;
