import React, { useEffect, useState, useRef } from "react";
import { MentionsInput, Mention } from "react-mentions";
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
  const [notifiedUsersList, setNotifiedUsersList] = useState([]);
  const [state, setState] = useState({
    name: "Comment",
    value: "",
    singleLineValue: "",
    mentionData: null,
    users: [],
  });
  let value;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    loadComments();
    UserInterface.getUsers().then((succes) => {
      let res = [];
      _.forEach(succes.data.data, (item) => {
        console.log(item);
        res.push({
          id: item.userName,
          display: item.userName,
        });
      });

      setUsers(res);
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

  const handleChanges = (event, newValue, newPlainTextValue, mentions) => {
    setState({
      value: newValue,
      mentionData: { newValue, newPlainTextValue, mentions },
    });
  };

  const handleChangeSingle = (e, newValue, newPLainTextValue, mentions) => {
    setState({
      singleLineValue: newValue,
    });
  };

  const handleChange = (event) => {
    const { value } = event.target;
    if (event.key == "Enter" || event.keyCode == 13) {
      event.target.blur();
      if (_.isUndefined(loggedInUserDetails.userName)) {
        history.push("/profile");
      } else {
        event.target.value = "";
        CommentsInterface.postComment(
          loggedInUserDetails._id,
          getCommentDestination(),
          CONSTANTS.ACTIONS.COMMENT,
          value,
          props.entity
        ).then((success) => {
          setState({ ...state, value: "" });
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
              _.get(props, "idea.owner.userName"),
              CONSTANTS.ACTIONS.COMMENT,
              CONSTANTS.ACTION_STATUS.PENDING,
              value,
              JSON.stringify({
                ideaID: _.get(props.idea, "PDFHash"),
              })
            );
          }
          _.forEach(_.get(state, "mentionData.mentions"), (mention) => {
            NotificationInterface.postNotification(
              loggedInUserDetails._id,
              mention.id,
              CONSTANTS.ACTIONS.COMMENT,
              CONSTANTS.ACTION_STATUS.PENDING,
              mention.display + " mentioned you in a comment",
              JSON.stringify({
                ideaID: _.get(props.idea, "PDFHash"),
              })
            );
          });
        });
      }
    } else {
      setNewComment(value);
    }
  };
  const onAdd = (id, display) => {
    notifiedUsersList.push(display);
    setNotifiedUsersList(notifiedUsersList);
    console.log(notifiedUsersList);
  };

  const gotoProfile = (userName) =>{
    history.push({
      pathname: "/profile/" + userName,
    })
  }

  const destructureComment = (comment) => {
    return (
      <div>
        {_.map(comment.split(" "), (word) => {
          return (
            _.startsWith(word, "@") ? 
             <span className="person-mention"
             onClick={() => {
               gotoProfile(word.replace("@",""))
             }}
             >{word}  {" "}</span>:
             <span className="">{word} {" "}</span>
          )
        })}
      </div>
    );
  };

  return (
    <ListGroup className="comments-panel">
      {!_.isEmpty(loggedInUserDetails.userName) && (
        <MentionsInput
          value={state.value}
          onChange={handleChanges}
          markup="@{{__type__||__id__||__display__}}"
          placeholder="Type your thoughts"
          className="mentions"
          onKeyUp={(e) => handleChange(e)}
        >
          <Mention
            type="user"
            trigger="@"
            data={users}
            className="mentions__mention"
            displayTransform={(id, display) => {
              return "@" + display;
            }}
          />
        </MentionsInput>
      )}
      {(!comments || comments.length == 0) && (
        <div>
          {!_.isEmpty(loggedInUserDetails.userName) ? (
            <div className="second-grey mb-2 color-secondary">
              Be the first to comment.
            </div>
          ) : (
            <div className="second-grey mb-2  color-secondary">
              Please sign in to post your comment.
            </div>
          )}
        </div>
      )}

      <div className="scrolable-comments">
        {_.map(comments, (comment, index) => {
          return (
            <div className="comment-item d-flex flex-row" key={index}>
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
                  {_.get(comment.from, "userName")}
                </div>
                <div className="bottom second-grey">
                  {destructureComment(comment.comment)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ListGroup>
  );
};

export default CommentsPanel;
