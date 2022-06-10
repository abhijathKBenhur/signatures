import React, { useEffect, useState } from "react";
import { ListGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import "./versions.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ReactDOM from 'react-dom';
import AlertBanner from "../alert/alert";

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

  const copyright = () =>{
    let shareURL = `https://cdn.filestackcontent.com/${props.idea.loc}`
    navigator.clipboard.writeText(shareURL);
    const alertProperty = {
      isDismissible: true,
      variant: "success",
      content: "The link to original content has been copied to the clipboard.",
    }
    ReactDOM.render(<AlertBanner {...alertProperty}></AlertBanner>, document.querySelector('.aleartHeader'))
  }

  return (
    <ListGroup className="comments-panel">
      <div className="scrolable-comments p-2">
        {_.map((versions), (version, index) => {
          return (
            <div className="comment-item d-flex flex-row cursor-pointer justify-content-between" onClick={() => {
              setViewingVersion(version)
              props.onLoad(version.PDFFile)
            }} key={index}>
              <div> 
              <div className="top master-grey  cursor-pointer">
                  Version {versions.length - index}
                </div>
                <div className="bottom second-grey">
                  {new Date(version.time).toUTCString()}
                </div>
              </div>
              {loggedInUserDetails.metamaskId == props.idea.creator.metamaskId  && <div className={viewingVersion.PDFFile == version.PDFFile ? "active content" : "content"}>
                <OverlayTrigger
                  placement="left"
                  overlay={<Tooltip>Copy link to original content</Tooltip>}
                >
                  <Button
                    variant="action"
                    onClick={() => {
                      copyright();
                    }}
                  >
                    <i
                      className="fa fa-copyright"
                      aria-hidden="true"
                    ></i>
                  </Button>
                </OverlayTrigger>
              </div> }
            </div>
          );
        })}
      </div>
    </ListGroup>
  );
};

export default Versions;