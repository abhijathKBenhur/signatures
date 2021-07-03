import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { confirm } from "../../modals/confirmation/confirmation";
import moment from "moment";
import SignatureBean from "../../beans/Signature";
import {
  Button,
  Row,
  Col,
  Form,
  Container,
  Dropdown,
  Spinner,
  Tabs,
  Tab,
  DropdownButton,
} from "react-bootstrap";
import BlockChainInterface from "../../interface/BlockchainInterface";
import MongoDBInterface from "../../interface/MongoDBInterface";
import ActionsInterface from "../../interface/ActionsInterface";
import Web3Utils from "web3-utils";
import Dropzone from "react-dropzone";
import "./Signature.scss";
import user from "../../../assets/images/user.png";
import {
  ExternalLink,
  ThumbsDown,
  ThumbsUp,
  ShoppingCart,
  Share,
  Crosshair,
  Edit3,
  Check,
} from "react-feather";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import md5 from "md5";
import { toast } from "react-toastify";
import Select from "react-select";
import StorageInterface from "../../interface/StorageInterface";
import { shallowEqual, useSelector } from "react-redux";
import audio from "../../../assets/images/audio.png";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
import * as reactShare from "react-share";

const Signature = (props) => {
  let { hashId } = useParams();
  const reduxState = useSelector((state) => state, shallowEqual);
  const location = useLocation();
  const [signature, setSignature] = useState({});
  const [PDFFile, setPDFFile] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(reduxState.userDetails);
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(true);
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(
    undefined
  );

  const [signatureEdits, setSignatureEdits] = useState({
    purpose: false,
    price: false,
  });
  const [key, setKey] = useState("Details");
  let history = useHistory();
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    let signatureFromParent = location.state;
    if (signatureFromParent) {
      setSignature({ ...signature, ...new SignatureBean(signatureFromParent) });
    } else {
      MongoDBInterface.getSignatureByHash(hashId).then((response) => {
        let signatureObject = new SignatureBean(_.get(response, "data.data"));
        setSignature(...signature, ...signatureObject);
      });
    }

    getIPSPDFFile(hashId);
  }, []);

  useEffect(() => {
    setIsCurrentUserOwner(signature.owner == currentUser.metamaskId);
  }, [signature, currentUser]);

  useEffect(() => {
    const { metamaskID = undefined, userDetails = {} } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID);
    }
    if (userDetails) {
      setCurrentUser(userDetails);
    }
  }, [reduxState]);

  function getIPSPDFFile(hash) {
    StorageInterface.getFileFromIPFS(hash).then((pdfFileResponse) => {
      let pdfData = new Blob([pdfFileResponse.content.buffer]);
      // if(signature.fileType === 'pdf') {
      //   setPDFFile(pdfData);
      // } else {
      loadFile(pdfData);
      // }
    });
  }

  const loadFile = (pdfData) => {
    var reader = new FileReader();
    reader.readAsDataURL(pdfData);
    reader.onloadend = function() {
      var base64data = reader.result;
      setPDFFile(base64data);
    };
  };

  function feedbackMessage(signature) {
    showToaster(
      "Please wait a while we complete the transaction. Please note the transaction ID : " +
        signature && signature.transactionID,
      { type: "dark" }
    );
  }

  function errorMessage() {
    showToaster(
      "There was an error in processing your request in blockchain ",
      { type: "error" }
    );
  }

  function updateMongoBuySignature(updatePayload) {
    MongoDBInterface.buySignature(updatePayload)
      .then((updatedSignature) => {
        showToaster("Purchase updated on blockchain", { type: "info" });
        setSignature(new SignatureBean(_.get(updatedSignature, "data.data")));
        gotoGallery();
      })
      .catch((err) => {
        console.log("error");
      });
  }
  const generateDate = (date) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth();
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };
  function copyClipBoard() {
    let shareURL = window.location.href + "/signature/" + signature.PDFHash;
    navigator.clipboard.writeText(shareURL);
    showToaster("Copied to clipboard!", { type: "dark" });
  }

  function updatePriceInMongo() {
    MongoDBInterface.updatePrice(signature).then((updatedSignature) => {
      setSignature(_.get(updatedSignature, "data.data"));
    });
  }

  function procureSignature() {
    if (signature.purpose == CONSTANTS.PURPOSES.SELL) {
      buySignature();
    } else if (signature.purpose == CONSTANTS.PURPOSES.COLLAB) {
      showInterest();
    }
  }

  function buySignature() {
    let updatePayload = {
      buyer: currentMetamaskAccount,
      seller: signature.owner,
      buyerUserID: currentUser.userID,
      PDFHash: signature.PDFHash,
      price: signature.price,
      ideaID: signature.ideaID,
    };
    BlockChainInterface.buySignature(
      updatePayload,
      updateMongoBuySignature,
      feedbackMessage,
      errorMessage
    );
  }

  function showInterest() {
    confirm(
      "Set your price.",
      "Would you like to express your interest?",
      "Ok",
      "Cancel",
      false,
      "Message"
    ).then((success) => {
      if (success.proceed) {
        let updatePayload = {
          from: currentMetamaskAccount,
          fromUserName: currentUser.userID,
          toUserName: signature.userID,
          to: signature.owner,
          action: CONSTANTS.ACTIONS.COLLAB_INTEREST,
          status: CONSTANTS.ACTION_STATUS.PENDING,
          ideaID: signature.ideaID,
          message: success.text,
        };
        ActionsInterface.postAction(updatePayload).then((success) => {});
      } else {
      }
    });
  }

  function openInEtherscan() {
    window.open("https://kovan.etherscan.io/tx/" + signature.transactionID);
  }

  function openInNewTab() {
    var fileURL = URL.createObjectURL(PDFFile);
    window.open(fileURL);
  }

  function gotoGallery() {
    history.push("/home");
  }

  const goToUserProfile = (id) => {
    history.push({
      pathname: "/profile/" + id,
      state: {
        userID: id,
      },
    });
  };

  // const getMenuActions = () => {
  //   return (
  //     <DropdownButton id="dropdown-actions" title="Actions">
  //       {/* <Dropdown.Toggle variant="success" id="dropdown-basic">
  //         <MoreHorizontal />
  //       </Dropdown.Toggle> */}
  //       {isCurrentUserOwner ? (
  //         <div></div>
  //       ) : (
  //         <div>
  //           {signature.purpose == CONSTANTS.PURPOSES.SELL && (
  //             <Dropdown.Item

  //             >

  //               <span className="txt">Buy</span>
  //             </Dropdown.Item>
  //           )}
  //           {signature.purpose == CONSTANTS.PURPOSES.COLLAB && (
  //             <Dropdown.Item
  //               onClick={() => {
  //                 showInterest();
  //               }}
  //             >
  //               <ShoppingCart
  //                 className="cursor-pointer signature-icons ShoppingCart"
  //                 color="#F39422"
  //               ></ShoppingCart>
  //               <span className="txt">Collaborate</span>
  //             </Dropdown.Item>
  //           )}
  //           <Dropdown.Item>
  //             <ThumbsUp
  //               className="cursor-pointer signature-icons ThumbsUp"
  //               color="#F39422"
  //             ></ThumbsUp>
  //             <span className="txt">Like </span>
  //           </Dropdown.Item>
  //         </div>
  //       )}

  //       <Dropdown.Item>

  //         <span className="txt">Copy link</span>
  //       </Dropdown.Item>
  //       <Dropdown.Item>

  //         <span className="txt">View</span>
  //       </Dropdown.Item>

  //       {/* <Dropdown.Item>
  //         <ExternalLink
  //           className="cursor-pointer signature-icons ExternalLink"
  //           onClick={() => {
  //             openInNewTab();
  //           }}
  //           color="#F39422"
  //         ></ExternalLink>
  //         <span className="txt">Open</span>
  //       </Dropdown.Item> */}
  //     </DropdownButton>
  //   );
  // };

  const getDocumnetViewer = () => {
    const { fileType } = signature;
    switch (fileType) {
      case "pdf":
        return (
          <Document file={PDFFile} className="pdf-document">
            <Page pageNumber={1} />
          </Document>
        );
      case "mp3":
        const file = PDFFile.split(",")[1];
        return (
          <div className="audio-wrapper">
            <img src={audio} alt="" />
            <audio controls>
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

  function getIdeaStatus() {
    switch (signature.purpose) {
      case CONSTANTS.PURPOSES.SELL:
        return "On Sale";
        break;
      case CONSTANTS.PURPOSES.AUCTION:
        return "On Auction";
        break;
      case CONSTANTS.PURPOSES.COLLAB:
        return "Inviting Collaborators";
        break;
      case CONSTANTS.PURPOSES.KEEP:
        return "Personal Record";
        break;
    }
  }

  return (
    <Container fluid>
      <Form
        noValidate
        encType="multipart/form-data"
        className="viewSignature d-flex "
      >
        <Col md="12" sm="12" lg="12" xs="12" className="responsive-content">
          <Row className="signature-container ">
            <Col sm="12" lg="7" xs="12" md="6" className="left-side h-100">
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
            </Col>
            <Col sm="12" lg="5" xs="12" md="6" className="right-side p-0">
              <div className="buttons text-right d-flex justify-content-between">
                <div className="actions d-flex">
                  {!isCurrentUserOwner && (
                    <ShoppingCart
                      onClick={() => {
                        procureSignature();
                      }}
                      className="cursor-pointer signature-icons ShoppingCart"
                      color="#F39422"
                    ></ShoppingCart>
                  )}
                  {!isCurrentUserOwner && (
                    <ThumbsUp
                      className="cursor-pointer signature-icons ThumbsUp"
                      color="#F39422"
                    ></ThumbsUp>
                  )}
                  <ExternalLink
                    className="cursor-pointer signature-icons"
                    color="#F39422"
                    onClick={() => {
                      copyClipBoard();
                    }}
                  ></ExternalLink>
                  <Crosshair
                    className="cursor-pointer signature-icons"
                    color="#F39422"
                    onClick={() => {
                      openInEtherscan();
                    }}
                  ></Crosshair>
                </div>
                <div className="sharables d-flex">
                  <reactShare.FacebookShareButton
                    url={window.location.href}
                    quote={"Hey, checkout this idea on ideaTribe."}
                  >
                    <reactShare.FacebookIcon size={32} round />
                  </reactShare.FacebookShareButton>
                  <reactShare.TwitterShareButton
                    url={window.location.href}
                    title={"Hey, checkout this idea on ideaTribe."}
                  >
                    <reactShare.TwitterIcon size={32} round />
                  </reactShare.TwitterShareButton>
                  <reactShare.WhatsappShareButton
                    url={window.location.href}
                    title={"Hey, checkout this idea on ideaTribe."}
                    separator=":: "
                  >
                    <reactShare.WhatsappIcon size={32} round />
                  </reactShare.WhatsappShareButton>
                  <reactShare.LinkedinShareButton url={window.location.href}>
                    <reactShare.LinkedinIcon size={32} round />
                  </reactShare.LinkedinShareButton>
                </div>
              </div>
              <div className="top-section d-flex flex-column">
                <Row className="form-row title-row">
                  <Col md="6" className="pl-0">
                    <span>{signature.title}</span>
                  </Col>
                  <Col md="6 created-at p-0">
                    {moment(signature.createdAt).format(
                      "MMMM Do YYYY, h:mm:ss A"
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md="6" className="form-row  tags-row">
                    {signature.category &&
                      JSON.parse(signature.category).map((tag, key) => {
                        return (
                          <Button disabled variant="pill">
                            {tag.label}
                          </Button>
                        );
                      })}
                  </Col>
                  <Col md="6" className="city_name p-0">
                    Bangalore
                  </Col>
                </Row>
                <Row className="form-row owner-row">
                  <Col md="12" className="owner text-right">
                    <Row className="d-flex flex-column ">
                      <Col md="12">
                        <div className="owned_by justify-content-end">
                          Currently owned by {signature.userID}
                        </div>
                      </Col>
                    </Row>

                    <br></br>
                  </Col>
                </Row>
                <Row className="form-row">
                  <span> {signature.description}</span>
                </Row>
              </div>
              <div className="">
                <Col md="12" className="created-by justify-content-end">
                  <div className="text-right">
                    Created by {signature.userID}
                  </div>
                </Col>
              </div>
              <div className="tabs-wrapper">
                <Tabs
                  id="idea-tab-categories"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                >
                  <Tab eventKey="Details" title="Details">
                    <div className="collection-wrapper">
                      <div className="middle-block">
                        <Row>
                          <Col md={12}>
                            <span>{getIdeaStatus()}</span>
                          </Col>
                          <Col md={12}>
                            <span>
                              {" "}
                              {signature.price &&
                                Web3Utils.fromWei(signature.price)}{" "}
                              BNB
                            </span>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="History" title="History">
                    <div className="transactions-wrapper">
                      No transactions yet
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </Col>
          </Row>
        </Col>
      </Form>
    </Container>
  );
};
export default Signature;
