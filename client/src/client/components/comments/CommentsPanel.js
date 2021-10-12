import React, { useEffect, useState, useRef } from "react";
import { MentionsInput, Mention } from 'react-mentions'
import { ListGroup, Form, Image } from "react-bootstrap";
import CONSTANTS from "../../commons/Constants";
import { getInitialSubString } from "../../commons/common.utils";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import "./comments.scss";
import CommentsInterface from "../../interface/CommentsInterface";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import NotificationInterface from "../../interface/NotificationInterface";
import UserInterface from "../../interface/UserInterface";

const CommentsPanel = (props) => {
  let history = useHistory();
  const reduxState = useSelector((state) => state, shallowEqual);
  const [comments, setComments] = useState("");
  const [newComment, setNewComment] = useState("");
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [users, setUsers] = useState([
      
    ]);

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
    console.log("userDetails = ", userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    loadComments();
    UserInterface.getUsers().then((succes) => {
      let res = [];
      _.forEach(succes.data.data, item=>{
        res.push({
          id: item.userName,
          display: item.firstName
        })
      });
      setUsers(res)
    });
  }, []);

  function getCommentDestination() {
    switch (props.entity) {
      case CONSTANTS.ENTITIES.IDEA:
        return props.idea.ideaID;
        break;
      case CONSTANTS.ENTITIES.PUBLIC:
        return CONSTANTS.ENTITIES.PUBLIC;
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
      if(_.isUndefined(loggedInUserDetails.userName)){
        history.push("/profile");
      }else{
        event.target.value = "";
        CommentsInterface.postComment(
          loggedInUserDetails._id,
          getCommentDestination(),
          CONSTANTS.ACTIONS.COMMENT,
          value,
          props.entity
        ).then((success) => {
          let commentsCOpy = _.clone(comments);
          commentsCOpy.unshift({
            from: loggedInUserDetails,
            to: getCommentDestination(),
            action: CONSTANTS.ACTIONS.COMMENT,
            comment: value,
            entity: props.entity,
          });
          setComments(commentsCOpy);
          if (_.get(props, "idea.owner.userName")) {
            NotificationInterface.postNotification(
              loggedInUserDetails._id,
              _.get(props,"idea.owner.userName"),
              CONSTANTS.ACTIONS.COMMENT,
              CONSTANTS.ACTION_STATUS.PENDING,
              value,
              JSON.stringify({
                ideaID: _.get(props.idea, "PDFHash"),
              })
            );
          }
        });
      }
      
    } else {
      setNewComment(value);
    }
  };
  const onAdd = () => (...args) => console.log("added a new mention", ...args);

  return (
    <ListGroup className="">
      <MentionsInput className="mentions-area" value={newComment} onChange={(e) => handleChange(e)}  placeholder="Your comment">
        <Mention
          trigger="@"
          data={users}
          displayTransform={display=> `@${display}`}
        />
        <Mention
          trigger="#"
          data={users}
          onAdd={onAdd}
        />
      </MentionsInput>
      {(!comments || comments.length == 0) && <div className="second-grey mb-2 ">Be the first to add a comment.</div>}

      <div className="scrolable-comments">
        {_.map(comments, (comment,index) => {
          return (
            <div className="comment-item d-flex flex-row pb-1" key={index}>
              <div className="icon mr-2 p-1 cursor-pointer">
                <Image
                  src={_.get(comment, "from.imageUrl")}
                  color="F3F3F3"
                  className="user-circle"
                  onClick={() => {
                    history.push({
                      pathname: "/profile/" + comment.from.userName,
                    });
                  }}
                />
              </div>
              <div className="content">
                <div className="top master-grey  cursor-pointer">
                  {_.get(comment.from,'userName')}
                </div>
                <div className="bottom second-grey">{comment.comment}</div>
              </div>
            </div>
          );
        })}
      </div>
    </ListGroup>
  );
};

export default CommentsPanel;
