import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import SignatureBean from "../../beans/Signature";
import { Badge, Button, Row, Col, Form, Container, Dropdown } from "react-bootstrap";
import BlockChainInterface from "../../interface/BlockchainInterface";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Web3Utils from "web3-utils";
import Dropzone from "react-dropzone";
import "./Signature.scss";
import {
  ExternalLink,
  ThumbsDown,
  ThumbsUp,
  ShoppingCart,
  Share,
  Crosshair,
  MoreHorizontal,
} from "react-feather";
import md5 from "md5";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";
import StorageInterface from "../../interface/StorageInterface";
import { shallowEqual, useSelector } from "react-redux";

const Signature = (props) => {
  let { hashId } = useParams();
  const location = useLocation();
  const [signature, setSignature] = useState({});
  const [PDFFile, setPDFFile] = useState(undefined);
  const [currentMetamaskAccount, setCurrentMetamaskAccount] = useState(undefined);
  const reduxState = useSelector((state) => state, shallowEqual);
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
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setCurrentMetamaskAccount(metamaskID)
    }
  }, [reduxState]);

  function getIPSPDFFile(hash) {
    StorageInterface.getFileFromIPFS(hash).then((pdfFileResponse) => {
      let pdfData = new Blob([pdfFileResponse.content.buffer]);
      setPDFFile(pdfData);
    });
  }

  function feedbackMessage(signature) {
    toast.dark(
      "Please wait a while we complete the transaction. Please note the transaction ID : " + signature && signature.transactionID,
      {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  }

  function errorMessage() {
    toast.error(
      "There was an error in processing your request in blockchain " ,
      {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  }

  function updateMongoBuySignature(updatePayload) {
    MongoDBInterface.buySignature(updatePayload)
      .then((updatedSignature) => {
        toast.info(
          "Purchase updated on blockchain",
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setSignature(new SignatureBean(_.get(updatedSignature, "data.data")));
        gotoGallery()
      })
      .catch((err) => {
        console.log("error");
      });
  }

  function copyClipBoard() {
    let shareURL =
      window.location.href + "/signature/" + signature.PDFHash;
    navigator.clipboard.writeText(shareURL);

    toast.dark("Copied to clipboard!", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function updatePriceInMongo() {
    MongoDBInterface.updatePrice(signature).then((updatedSignature) => {
      setSignature(_.get(updatedSignature, "data.data"));
    });
  }

  function buySignature() {
        let updatePayload = {
          buyer: currentMetamaskAccount,
          seller: signature.owner,
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

  function openInEtherscan() {
    window.open("https://kovan.etherscan.io/tx/" + signature.transactionID);
  }

  function openInNewTab(){
    var fileURL = URL.createObjectURL(PDFFile);
    window.open(fileURL);
  }

  function gotoGallery() {
    history.push("/home");
  }

  const getMenuActions = () => {
    return (
      <Dropdown className="action-dropdwn">
      <Dropdown.Toggle variant="success" id="dropdown-basic">
       <MoreHorizontal />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item >
        <ShoppingCart
                    className="cursor-pointer signature-icons ShoppingCart"
                    color="#79589F"
                    onClick={() => {
                      buySignature();
                    }}
                  ></ShoppingCart>
                  <span className="txt">
                     Buy
                  </span>
        </Dropdown.Item>
        <Dropdown.Item>
        <Share
                    className="cursor-pointer signature-icons"
                    color="#79589F"
                    onClick={() => {
                      copyClipBoard();
                    }}
                  ></Share>
                  <span className="txt">
                  Copy
                  </span>
        </Dropdown.Item>
        <Dropdown.Item >
        <Crosshair
                    className="cursor-pointer signature-icons"
                    color="#79589F"
                    onClick={() => {
                      openInEtherscan();
                    }}
                  ></Crosshair>
                 <span className="txt">View</span>  
        </Dropdown.Item>

        <Dropdown.Item >
        <ThumbsUp
                    className="cursor-pointer signature-icons ThumbsUp"
                    color="#79589F"
                  ></ThumbsUp>
                   <span className="txt">Like</span>
        </Dropdown.Item>


        <Dropdown.Item >
        <ExternalLink
                    className="cursor-pointer signature-icons ExternalLink"
                    onClick={() => {
                      openInNewTab();
                    }}
                    color="#79589F"
                  ></ExternalLink>
                  <span className="txt">Open</span>  
        </Dropdown.Item>

        <Dropdown.Item >
        <ThumbsDown
                    className="cursor-pointer signature-icons ThumbsDown"
                    color="#79589F"
                  ></ThumbsDown>
                 <span className="txt">Dislike</span>  
        </Dropdown.Item>

      </Dropdown.Menu>
    </Dropdown>
    )
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
            <Col sm="12" lg="6" xs="12" md="6" className="left-side h-100">
              <Form.Row className="h-100 ">
                {PDFFile && (
                  <div className="pdfUploaded h-100 overflow-auto align-items-center justify-content-center d-flex">
                    <Document file={PDFFile} className="pdf-document">
                      <Page pageNumber={1} width={window.innerWidth / 3} />
                    </Document>
                  </div>
                )}
              </Form.Row>
            </Col>
            <Col sm="12" lg="6" xs="12" md="6"  className="right-side">
              <div className="top-section">
                <Row className="form-row title-row">
                  <span>{signature.title}</span>
                </Row>
                <Row className="form-row owner-row">
                  <span> {signature.owner}</span>
                </Row>
                <Row className="form-row price-row">
                  <span>
                    {signature.price && Web3Utils.fromWei(signature.price)} ETH
                  </span>
                </Row>
                <Row className="form-row  tags-row">
                  {signature.category &&
                    JSON.parse(signature.category).map((tag, key) => {
                      return (
                        <Badge
                          key={key}
                          className="tagpill"
                          variant="secondary"
                        >
                          {tag.label}
                        </Badge>
                      );
                    })}
                </Row>
                <Row className="form-row">
                  <span> {signature.description}</span>
                 
                </Row>
              </div>
              <div className="bottom-section">
                <Row className="form-row signature-footer">
                  <div className="left-end"></div>
                  <div className="right-end">
                    <div></div>
                  </div>
                </Row>
              </div>
              {getMenuActions()}
            </Col>
             {/* <Col md="1" lg="1" className="menu-bar">
              <div className="top-menu">
                <Col md="12">
                  <ShoppingCart
                    className="cursor-pointer signature-icons ShoppingCart"
                    color="#79589F"
                    onClick={() => {
                      buySignature();
                    }}
                  ></ShoppingCart>
                </Col>

                <Col md="12">
                  <Share
                    className="cursor-pointer signature-icons"
                    color="#79589F"
                    onClick={() => {
                      copyClipBoard();
                    }}
                  ></Share>
                </Col>
                <Col md="12">
                  <Crosshair
                    className="cursor-pointer signature-icons"
                    color="#79589F"
                    onClick={() => {
                      openInEtherscan();
                    }}
                  ></Crosshair>
                </Col>
                <Col md="12">
                  <ThumbsUp
                    className="cursor-pointer signature-icons ThumbsUp"
                    color="#79589F"
                  ></ThumbsUp>
                </Col>
                <Col md="12">
                  <ExternalLink
                    className="cursor-pointer signature-icons ExternalLink"
                    onClick={() => {
                      openInNewTab();
                    }}
                    color="#79589F"
                  ></ExternalLink>
                </Col>
              </div>
              <div className="bottom-menu">
                <Col md="12">
                  <ThumbsDown
                    className="cursor-pointer signature-icons ThumbsDown"
                    color="#79589F"
                  ></ThumbsDown>
                </Col>
              </div>
              
            </Col>  */}
          </Row> 
        </Col>
      </Form>
    </Container>
  );
};
export default Signature;
