import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import SignatureBean from '../../beans/Signature'
import { Badge, Button, Row, Col, Form, Container } from "react-bootstrap";
import BlockChainInterface from "../../interface/BlockchainInterface";
import MongoDBInterface from "../../interface/MongoDBInterface";
import Web3Utils from 'web3-utils';
import Dropzone from "react-dropzone";
import "./Signature.scss";
import {
  ChevronsDown,
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
      setSignature({...signature,...new SignatureBean(signatureFromParent)});
    } else {
      MongoDBInterface.getSignatureByHash(hashId).then((response) => {
        let signatureObject = new SignatureBean(_.get(response, "data.data"))
        setSignature(...signature, ...signatureObject);
      });
    }
    getIPSPDFFile(hashId)

  }, []);

  function getIPSPDFFile(hash){
    
    StorageInterface.getFileFromIPFS(hash).then(pdfFileResponse => {
      let pdfData = new Blob([pdfFileResponse.content.buffer])
      setPDFFile(pdfData)
    })
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

  return (
    <Container> 
    <Form noValidate encType="multipart/form-data" className="viewSignature">
      <Row className="signature-container">
        <Col md="5" className="left-side">
            <Form.Row className="w-100 p15 ">
              {PDFFile && (
                <div className="pdfUploaded h-100">
                  <Document file={PDFFile}>
                    <Page pageNumber={1} width={window.innerWidth / 3} />
                  </Document>
                </div>
              )}
            </Form.Row>
        </Col>
        <Col md="6 right-side">
          <div className="top-section">
            <Row className="form-row title-row">
              <h1>{signature.title}</h1>
            </Row>
            <Row className="form-row owner-row">
              <span>{signature.price && Web3Utils.fromWei(signature.price)}</span>
            </Row>
            <Row className="form-row  tags-row">
              {signature.category &&
                JSON.parse(signature.category).map((tag, key) => {
                  return (
                    <Badge key={key} className="tagpill" variant="secondary">
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
        <Col md="1" className="menu-bar">
          <div className="top-menu">
            <Col md="12">
              <ShoppingCart
                className="cursor-pointer ShoppingCart"
                color="#D96C5D"
                onClick={() => {
                  buySignature();
                }}
              ></ShoppingCart>
            </Col>

            <Col md="12">
              <Share
                className="cursor-pointer"
                color="#2E495A"
                onClick={() => {
                  copyClipBoard();
                }}
              ></Share>
            </Col>
            <Col md="12">
              <Crosshair
                className="cursor-pointer"
                color="#2E495A"
                onClick={() => {
                  openInEtherscan();
                }}
              ></Crosshair>
            </Col>
            <Col md="12">
              <ThumbsUp
                className="cursor-pointer ThumbsUp"
                color="#60B6A8"
              ></ThumbsUp>
            </Col>
          </div>
          <div className="bottom-menu">
            <Col md="12">
              <ThumbsDown
                className="cursor-pointer ThumbsDown"
                color="#F3C972"
              ></ThumbsDown>
            </Col>
          </div>
        </Col>
      </Row>
    </Form>
    </Container>
  );
};
export default Signature;
