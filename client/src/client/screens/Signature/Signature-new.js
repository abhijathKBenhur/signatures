import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from "react-router-dom";

import { Container, Row, Col, Button, Spinner,OverlayTrigger,
    Tooltip,} from "react-bootstrap";
import StorageInterface from "../../interface/StorageInterface";
import {
    ChevronRight,
    ChevronLeft
  } from "react-feather";
  import { Document, Page, pdfjs } from "react-pdf";
  import SignatureBean from "../../beans/Signature";
  import MongoDBInterface from "../../interface/MongoDBInterface";

import userImg from '../../../assets/images/user.png';
import _ from 'lodash';
import audio from "../../../assets/images/audio.png";
import ShareModal from '../../modals/share/share.modal';
import { shallowEqual, useSelector } from "react-redux";

import './Signature-new.scss';
import InfoModal from '../../modals/info-modal/info.modal';
const SignatureNew = (props) => {
    const { hashId } = useParams();
    const reduxState = useSelector((state) => state, shallowEqual);
    const location = useLocation();
    const audioRef = useRef(null);
    const [signature, setSignature] = useState({});
    const [PDFFile, setPDFFile] = useState(undefined);
    const [pdfPages, setPdfPages] = useState({
        currentPage: 1,
        totalPages: 1
      });
    const [modalShow, setModalShow] = useState({
        shareModal: false,
        infoModal: false
    });

    const [audioState, setAudioState] = useState({
        isAudioPlaying: false
    })

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
        // setSignature({...signature, ...dummmySignature});
        getIPSPDFFile(hashId);
    }, [])


    const  getIPSPDFFile = (hash) => {
        StorageInterface.getFileFromIPFS(hash).then((pdfFileResponse) => {
          let pdfData = new Blob([pdfFileResponse.content.buffer]);
          // if(signature.fileType === 'pdf') {
          //   setPDFFile(pdfData);
          // } else {
          loadFile(pdfData);
          // }
        });
      }
      useEffect(() => {
          if(audioRef.current) {
            audioRef.current.addEventListener('ended', () =>  setAudioState({...audioState, isAudioPlaying: false}));
            audioRef.current.addEventListener('pause', () =>  setAudioState({...audioState, isAudioPlaying: false}));
            audioRef.current.addEventListener('play', () =>  setAudioState({...audioState, isAudioPlaying: true}));
          }
        
      }, [audioRef.current])
    
      const loadFile = (pdfData) => {
        var reader = new FileReader();
        reader.readAsDataURL(pdfData);
        reader.onloadend = function() {
          var base64data = reader.result;
          setPDFFile(base64data);
        };
      };

      const onDocumentLoadSuccess = ({ numPages })  => {
        setPdfPages({...pdfPages, totalPages: numPages});
      }

      const playAudio = () => {
        audioRef.current.play();
        setAudioState({...audioState, isAudioPlaying: true})
      }

      const pauseAudio = () => {
        audioRef.current.pause();
        setAudioState({...audioState, isAudioPlaying: false})
    }
      const getDocumnetViewer = () => {
        const { fileType } = signature;
        switch (fileType) {
          case "pdf":
            return (
              <>
              <Document file={PDFFile} className="pdf-document" 
              onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pdfPages.currentPage} />
              </Document>
               <p className="page-container">
               <ChevronLeft className={pdfPages.currentPage === 1? 'disable': ''} onClick={() => setPdfPages({...pdfPages, currentPage: pdfPages.currentPage - 1})} />
               Page {pdfPages.currentPage} of {pdfPages.totalPages}
               <ChevronRight className={pdfPages.currentPage === pdfPages.totalPages ? 'disable': ''} onClick={() => setPdfPages({...pdfPages, currentPage: pdfPages.currentPage +1})}  />
               </p>
               </>
            );
          case "mp3":
            const file = PDFFile.split(",")[1];
            return (
              <div className="audio-wrapper">
                   <div className="circle">
                        <span className="circle__btn">
                            {
                                audioState.isAudioPlaying ?
                                    <i className="fa fa-pause" aria-hidden="true" onClick={() => pauseAudio()}></i>
                                :
                                    <i className="fa fa-play" aria-hidden="true" onClick={() => playAudio()}></i>

                            }
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
          switch(type) {
              case 'share': 
                setModalShow({...showModal, shareModal: true})
              break;
              case 'info': 
              setModalShow({...showModal, infoModal: true})
              break;
              default: break;
          }
          
      }

      const hideModal = (type) => {
          if(type === 'share') {
            setModalShow({...showModal, shareModal:  false})
          } else {
            setModalShow({...showModal, infoModal:  false})
          }
      }
    
    
    return(
        <Container fluid className="signature-new">
            <div className="wrapper">
                <div className="wrapper-margin">
                <Row className="user-row">
                <Col md={10}>
                    <div className="user-details">
                    <img src={userImg} alt="profile" />
                    <div className="user-metadata">
                    <p>{_.get(signature, 'title')}</p>
                        <p>
                        {_.get(signature, 'userID')}
                        </p>
                    </div>
                       
                    </div>
                </Col>
                <Col md={2}>
                <Button  className="like-btn">
                <i className="fa fa-heart" aria-hidden="true"></i>
                    Like</Button>
               </Col>
            </Row>
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
            <div className="description-section">
                    <p>
                        {_.get(signature, 'description')}
                    </p>
                </div>
                </div>
         
            </div>
           <div className="sidebar">
               <div className="avatar">
               <img src={userImg} alt="profile" />
               </div>
               <div className="action-btns">
               
                    
               <OverlayTrigger
                placement="left"
                overlay={
                    <Tooltip >
                    Feedback
                    </Tooltip>
                }
                >
                <Button  variant="outline-secondary"><i className="fa fa-comment" aria-hidden="true"></i>
                            </Button>
                </OverlayTrigger>

            <OverlayTrigger
            placement="left"
            overlay={
                <Tooltip>
                Share
                </Tooltip>
            }
            >
                    <Button  variant="outline-secondary" onClick={() => showModal('share')}><i className="fa fa-share" aria-hidden="true"></i>
                        </Button>
            </OverlayTrigger>
        <OverlayTrigger
        placement="left"
        overlay={
            <Tooltip>
            Shot Details
            </Tooltip>
        }
        >
               <Button  variant="outline-secondary"  onClick={() => showModal('info')}><i className="fa fa-info-circle" aria-hidden="true"></i>
                </Button>
    </OverlayTrigger>
               
               </div>
           </div>
         {modalShow.shareModal &&  <ShareModal  show={modalShow.shareModal} thumbnail={signature.thumbnail} PDFHash= {signature.PDFHash}
        onHide={() => hideModal('share')} />}
      {modalShow.infoModal&&  <InfoModal {...signature}  show={modalShow.infoModal} 
        onHide={() => hideModal('info')} />}
        </Container>
    )
}

export default SignatureNew