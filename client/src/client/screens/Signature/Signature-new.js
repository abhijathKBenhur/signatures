import React, { useEffect, useState, useRef } from "react";
import CommentsPanel from "../../components/comments/CommentsPanel";
import { useParams, useLocation } from "react-router-dom";
import moment from "moment";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
import NotificationInterface from "../../interface/NotificationInterface";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import StorageInterface from "../../interface/StorageInterface";
import { ChevronRight, ChevronLeft } from "react-feather";
import { Document, Page, pdfjs } from "react-pdf";
import SignatureInterface from "../../interface/SignatureInterface";
import CommentsInterface from "../../interface/CommentsInterface";
import { useHistory } from "react-router-dom";

import userImg from "../../../assets/images/user.png";
import _ from "lodash";
import ShareModal from "../../modals/share/share.modal";
import EngageModal from "../../modals/engage-modal/engage-modal";

import { shallowEqual, useDispatch, useSelector } from "react-redux";

import "./Signature-new.scss";
import InfoModal from "../../modals/info-modal/info.modal";
import RelationsInterface from "../../interface/RelationsInterface";
import EmitInterface from "../../interface/emitInterface";
const SignatureNew = (props) => {
  const { hashId } = useParams();
  const [upvotes, setUpvotes] = useState([]);
  const reduxState = useSelector((state) => state, shallowEqual);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
  const location = useLocation();
  const audioRef = useRef(null);
  const [signature, setSignature] = useState({});
  const [PDFFile, setPDFFile] = useState(undefined);
  const [showComment, setShowComment] = useState(false);
  const [pdfPages, setPdfPages] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const history = useHistory();
  const [modalShow, setModalShow] = useState({
    shareModal: false,
    infoModal: false,
    engageModal: false,
  });

  const [audioState, setAudioState] = useState({
    isAudioPlaying: false,
  });

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    let signatureFromParent = location.state;
    if (signatureFromParent) {
      setSignature({ ...signature, ...signatureFromParent });
      loadUpvotes(signatureFromParent.ideaID);
    } else {
      SignatureInterface.getSignatureByHash(hashId).then((response) => {
        let signatureObject = _.get(response, "data.data");
        setSignature({ ...signature, ...signatureObject });
        loadUpvotes(signatureObject.ideaID);
      });
    }

    // setSignature({...signature, ...dummmySignature});
    getIPSPDFFile(hashId);
  }, []);

  const getIPSPDFFile = (hash) => {
    StorageInterface.getFileFromIPFS(hash).then((pdfFileResponse) => {
      let pdfData = new Blob([pdfFileResponse.content.buffer]);
      // if(signature.fileType === 'pdf') {
      //   setPDFFile(pdfData);
      // } else {
      loadFile(pdfData);
      // }
    });
  };

  useEffect(() => {
    const { userDetails = {} } = reduxState;
    setLoggedInUserDetails(userDetails);
    console.log("userDetails = ", userDetails);
  }, [reduxState.userDetails]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () =>
        setAudioState({ ...audioState, isAudioPlaying: false })
      );
      audioRef.current.addEventListener("pause", () =>
        setAudioState({ ...audioState, isAudioPlaying: false })
      );
      audioRef.current.addEventListener("play", () =>
        setAudioState({ ...audioState, isAudioPlaying: true })
      );
    }
  }, [audioRef.current]);

  useEffect(() => {
    let subscription = EmitInterface.getMessage().subscribe((event) => {
      switch (event.id) {
        case "SHOW_COMMENTS":
          setShowComment(true);
          break;
        default:
          break;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadFile = (pdfData) => {
    var reader = new FileReader();
    reader.readAsDataURL(pdfData);
    reader.onloadend = function() {
      var base64data = reader.result;
      setPDFFile(base64data);
    };
  };

  const loadUpvotes = (id) => {
    RelationsInterface.getRelations({
      to: id,
    })
      .then((success) => {
        setUpvotes(_.map(success.data.data, "from"));
      })
      .catch((err) => {});
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfPages({ ...pdfPages, totalPages: numPages });
  };

  const playAudio = () => {
    audioRef.current.play();
    setAudioState({ ...audioState, isAudioPlaying: true });
  };

  const pauseAudio = () => {
    audioRef.current.pause();
    setAudioState({ ...audioState, isAudioPlaying: false });
  };
  const getDocumnetViewer = () => {
    const { fileType } = signature;
    switch (fileType) {
      case "pdf":
        return (
          <>
            <Document
              file={PDFFile}
              className="pdf-document"
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={pdfPages.currentPage} />
            </Document>
            <p className="page-container">
              <ChevronLeft
                className={pdfPages.currentPage === 1 ? "disable" : ""}
                onClick={() =>
                  setPdfPages({
                    ...pdfPages,
                    currentPage: pdfPages.currentPage - 1,
                  })
                }
              />
              Page {pdfPages.currentPage} of {pdfPages.totalPages}
              <ChevronRight
                className={
                  pdfPages.currentPage === pdfPages.totalPages ? "disable" : ""
                }
                onClick={() =>
                  setPdfPages({
                    ...pdfPages,
                    currentPage: pdfPages.currentPage + 1,
                  })
                }
              />
            </p>
          </>
        );
      case "mp3":
        const file = PDFFile.split(",")[1];
        return (
          <div className="audio-wrapper">
            <div className="circle">
              <span className="circle__btn">
                {audioState.isAudioPlaying ? (
                  <i
                    className="fa fa-pause"
                    aria-hidden="true"
                    onClick={() => pauseAudio()}
                  ></i>
                ) : (
                  <i
                    className="fa fa-play"
                    aria-hidden="true"
                    onClick={() => playAudio()}
                  ></i>
                )}
              </span>
              <span className="circle__back-1"></span>
              <span className="circle__back-2"></span>
            </div>

            {/* <img src={audio} alt="" /> */}
            <audio controls ref={audioRef}>
              <source src={`data:audio/mpeg;base64,` + file}></source>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
        return <img src={`${PDFFile}`} />;

      default:
        return null;
    }
  };

  const showModal = (type) => {
    switch (type) {
      case "share":
        setModalShow({ ...showModal, shareModal: true });
        break;
      case "info":
        setModalShow({ ...showModal, infoModal: true });
        break;
      case "engage":
        setModalShow({ ...showModal, engageModal: true });
        break;
      default:
        break;
    }
  };

  const hideModal = (type) => {
    if (type === "share") {
      setModalShow({ ...showModal, shareModal: false });
    } else if (type === "info") {
      setModalShow({ ...showModal, infoModal: false });
    } else {
      setModalShow({ ...showModal, engageModal: false });
    }
  };

  const setVoting = () => {
    if (upvotes.indexOf(loggedInUserDetails.userName) === -1) {
      RelationsInterface.postRelation(
        loggedInUserDetails.userName,
        signature.ideaID,
        CONSTANTS.ACTIONS.UPVOTE,
        CONSTANTS.ACTION_STATUS.COMPLETED,
        "Upvoting."
      ).then((success) => {
        const upVotesClone = _.cloneDeep(upvotes);
        upVotesClone.push(loggedInUserDetails.userName);
        setUpvotes(upVotesClone);
        NotificationInterface.postNotification(
          loggedInUserDetails._id,
          signature.ideaID,
          CONSTANTS.ACTIONS.UPVOTE,
          CONSTANTS.ACTION_STATUS.COMPLETED,
          loggedInUserDetails.userName + " just upvoted your idea.",
          JSON.stringify({
            ideaID: _.get(signature, "PDFHash"),
          })
        );
      });
    } else {
      RelationsInterface.removeRelation(
        loggedInUserDetails.userName,
        signature.ideaID,
        CONSTANTS.ACTIONS.UPVOTE
      ).then((success) => {
        let voteIndex = upvotes.indexOf(loggedInUserDetails.userName);
        let upvotesCopy = _.clone(upvotes) || [];
        upvotesCopy.splice(voteIndex, 1);
        setUpvotes(upvotesCopy);
      });
    }
  };

  const getIdeaStatus = (purpose) => {
    switch (purpose.purposeType) {
      case CONSTANTS.PURPOSES.SELL:
      case CONSTANTS.PURPOSES.LICENSE:
        return "Buy";

      case CONSTANTS.PURPOSES.AUCTION:
        return "Bid";

      case CONSTANTS.PURPOSES.COLLAB:
        return "Collaborate";

      case CONSTANTS.PURPOSES.KEEP:
        return "View info";
      default:
        return null;
    }
  };

  return (
    <div className="signature-new">
      <div className="wrapper">
        <div className="wrapper-margin">
          <Row className="user-row  ">
            <Col
              md="9"
              className={`document-container pt-2 ${
                showComment ? "desktop-view" : ""
              }`}
            >
              <Row className="justify-content-between align-items-center mb-1 signature-mobile-view">
                <Col
                  md="12"
                  className="d-flex flex-row justify-content-between align-items-center"
                >
                  <div className="user-details">
                    <div className="user-metadata">
                      <span className="master-header justify-content-left">
                        {signature.title}
                      </span>
                    </div>
                  </div>
                  <div className="action-section">
                    <div className="justify-content-center">
                      <div className="sidebar">
                        <div className="action-btns align-items-center">
                          {/* <span className="second-grey">{upvotes.length} upvotes</span> */}

                          <OverlayTrigger
                            placement="left"
                            overlay={<Tooltip>View on chain</Tooltip>}
                          >
                            <Button variant="action" onClick={() => {
                              window.open(
                                "https://mumbai.polygonscan.com/address/" +
                                  _.get(signature, "PDFHash")
                              );
                            }}>
                              <i className="fa fa-link" aria-hidden="true"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            placement="left"
                            overlay={<Tooltip>Share</Tooltip>}
                          >
                            <Button
                              variant="action"
                              onClick={() => showModal("share")}
                            >
                              <i
                                className="fa fa-bullhorn"
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </OverlayTrigger>

                          {loggedInUserDetails.userName && (
                            <OverlayTrigger
                              placement="left"
                              overlay={
                                <Tooltip>
                                  {" "}
                                  {upvotes.indexOf(
                                    loggedInUserDetails.userName
                                  ) > -1
                                    ? "unvote"
                                    : "upvote"}
                                </Tooltip>
                              }
                            >
                              <Button
                                variant="action"
                                onClick={() => setVoting()}
                                className={
                                  upvotes.indexOf(
                                    loggedInUserDetails.userName
                                  ) > -1
                                    ? "upvoted small"
                                    : "small"
                                }
                              >
                                <i
                                  aria-hidden="true"
                                  className={
                                    upvotes.indexOf(
                                      loggedInUserDetails.userName
                                    ) > -1
                                      ? "fa fa-thumbs-o-up upvoted"
                                      : "fa fa-thumbs-o-up"
                                  }
                                ></i>
                              </Button>
                            </OverlayTrigger>
                          )}

                          {signature.owner &&
                            loggedInUserDetails.userName ==
                              _.get(signature, "owner.userName") && (
                              <div>
                                <Button
                                  variant="action"
                                  className="small ml-1"
                                  onClick={() => showModal("info")}
                                >
                                  {" "}
                                  <i className="fa fa-cog"></i>
                                </Button>
                              </div>
                            )}
                          {loggedInUserDetails.userName &&
                            loggedInUserDetails.userName !=
                              _.get(signature, "owner.userName") && (
                              <div>
                                <Button
                                  variant="primary"
                                  onClick={() => showModal("engage")}
                                >
                                  {_.get(signature, "purpose") &&
                                    getIdeaStatus(_.get(signature, "purpose"))}
                                </Button>

                                <div className="avatar cursor-pointer">
                                  {signature.owner && (
                                    <img
                                      src={_.get(signature, "owner.imageUrl")}
                                      alt={_.get(signature, "owner.userName")}
                                      onClick={() =>
                                        history.push(
                                          `/profile/${_.get(
                                            signature,
                                            "owner.userName"
                                          )}`
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col
                  md="12"
                  className="meta mb-2 justify-content-between d-flex flex-row"
                >
                  <div className="tags second-grey">
                    <Button disabled variant="pill">
                      {signature.category &&
                        JSON.parse(signature.category) &&
                        JSON.parse(signature.category).label}
                    </Button>
                  </div>
                  <div className="time second-grey">
                    {moment(signature.createdAt).format("YYYY-MM-DD HH:mm:ss")},{" "}
                    {signature.location || "Global"}
                  </div>
                </Col>
                <Col md="12">
                  <div className="description-section">
                    <p>{_.get(signature, "description")}</p>
                  </div>
                  <div>
                    <section className="doc-section">
                      {PDFFile ? (
                        <div className="pdfUploaded h-100 overflow-auto align-items-center justify-content-center d-flex">
                          {/* <Document file={PDFFile} className="pdf-document">
                      <Page pageNumber={1} width={window.innerWidth / 3} />
                    </Document> */}
                          {getDocumnetViewer()}
                        </div>
                      ) : (
                        <Spinner animation="border" />
                      )}
                    </section>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              md="3"
              className={`conversation-container pt-2 ${
                showComment ? "mobile-view" : "desktop-view"
              }`}
            >
              <div>
                <span className="conversation-title second-header">
                  Conversation
                </span>
                <hr></hr>

                {!_.isEmpty(signature) && (
                  <CommentsPanel
                    idea={signature}
                    entity={CONSTANTS.ENTITIES.IDEA}
                  ></CommentsPanel>
                )}
              </div>
            </Col>
            <Col md="1" className="options-container  pt-2">
              <Row className="justify-content-center">
                <div className="sidebar d-flex flex-column">
                  <div className="action-btns d-flex flex-column align-items-center"></div>
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
      {modalShow.shareModal && (
        <ShareModal
          show={modalShow.shareModal}
          thumbnail={signature.thumbnail}
          PDFHash={signature.PDFHash}
          onHide={() => hideModal("share")}
        />
      )}
      {modalShow.infoModal && (
        <InfoModal
          {...signature}
          show={modalShow.infoModal}
          idea={signature}
          onHide={() => hideModal("info")}
        />
      )}
      {modalShow.engageModal && (
        <EngageModal
          {...signature}
          show={modalShow.engageModal}
          idea={signature}
          currentUser={loggedInUserDetails}
          onHide={() => hideModal("engage")}
        />
      )}
    </div>
  );
};

export default SignatureNew;
