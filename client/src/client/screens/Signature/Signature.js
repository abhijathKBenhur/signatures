import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import SignatureBean from "../../beans/Signature";
import { Badge, Button, Row, Col, Form, Container } from "react-bootstrap";
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
} from "react-feather";
import md5 from "md5";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";
import StorageInterface from "../../interface/StorageInterface";

const Signature = (props) => {
  let { hashId } = useParams();
  const location = useLocation();
  const [signature, setSignature] = useState({});
  const [PDFFile, setPDFFile] = useState(undefined);

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

  function getIPSPDFFile(hash) {
    StorageInterface.getFileFromIPFS(hash).then((pdfFileResponse) => {
      let pdfData = new Blob([pdfFileResponse.content.buffer]);
      setPDFFile(pdfData);
    });
  }

  function feedbackMessage() {
    toast.dark(
      "Your order has been placed. Please wait a while for it to be processed.",
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
  }

  function updateMongoBuySignature(updatePayload) {
    MongoDBInterface.buySignature(updatePayload)
      .then((updatedSignature) => {
        setSignature(new SignatureBean(_.get(updatedSignature, "data.data")));
      })
      .catch((err) => {
        console.log("error");
      });
  }

  function copyClipBoard() {
    let shareURL =
      window.location.href + "?referrer=" + localStorage.getItem("userInfo");
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
    BlockChainInterface.getAccountDetails()
      .then((metamaskID) => {
        let updatePayload = {
          buyer: metamaskID,
          seller: signature.owner,
          PDFHash: signature.PDFHash,
          price: signature.price,
          ideaID: signature.ideaID,
        };
        BlockChainInterface.buySignature(
          updatePayload,
          updateMongoBuySignature,
          feedbackMessage
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function openInEtherscan() {
    window.open("https://kovan.etherscan.io/tx/" + signature.transactionID);
  }

  function openInNewTab(){
    var fileURL = URL.createObjectURL(PDFFile);
    window.open(fileURL);
  }

  return (
    <Container>
      <Form
        noValidate
        encType="multipart/form-data"
        className="viewSignature d-flex align-items-center justify-content-center"
      >
        <Col md="10" sm="12" lg="10" xs="12" className="responsive-content">
          <Row className="signature-container ">
            <Col sm="12" lg="5" xs="12" md="5" className="left-side">
              <Form.Row className=" p15 ">
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
                  <h1>{signature.title}</h1>
                </Row>
                <Row className="form-row owner-row">
                  <span>
                    {signature.price && Web3Utils.fromWei(signature.price)}
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
                  <span> {signature.owner}</span>
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
            </Col>
            <Col md="1" lg="1" className="menu-bar">
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
              
            </Col>
          </Row>
        </Col>
      </Form>
    </Container>
  );
};
export default Signature;
