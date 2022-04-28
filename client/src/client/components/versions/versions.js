import React, { useEffect, useState, useRef } from "react";
import { ListGroup, Form, Image } from "react-bootstrap";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import "./versions.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const Versions = (props) => {
  let history = useHistory();
  const reduxState = useSelector((state) => state, shallowEqual);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const [viewingVersion, setViewingVersion] = useState({});
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    loadVersions();
  }, []);

  function loadVersions() {
    try{
      let versionList = JSON.parse(props.idea.PDFFile)
      setVersions(_.reverse(versionList))
    }catch(err){
      setVersions([{
        PDFFile:props.idea.PDFFile,
        time: props.idea.createdAt
      }])
    }
  }

  return (
    <ListGroup className="comments-panel">
      <div className="scrolable-comments">
        {_.map((versions), (version, index) => {
          return (
            <div className="comment-item d-flex flex-row cursor-pointer" onClick={() => {
              setViewingVersion(version)
              props.onLoad(version.PDFFile)
            }} key={index}>
              <div className={viewingVersion.PDFFile == version.PDFFile ? "active content" : "content"}>
                <div className="top master-grey  cursor-pointer">
                  Version {versions.length - index}
                </div>
                <div className="bottom second-grey">
                  {new Date(version.time).toUTCString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ListGroup>
  );
};

export default Versions;