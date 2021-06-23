import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import StorageInterface from "../../interface/StorageInterface";
import Dropzone, { useDropzone } from "react-dropzone";
import CONSTANTS from "../../commons/Constants";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./Create.scss";
import { FilePlus, X, Image as ImageFile, Plus } from "react-feather";
import Hash from "ipfs-only-hash";
import Image from "react-image-resizer";
import { Container, Spinner } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { shallowEqual, useSelector } from "react-redux";

function Create(props) {
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined , userDetails = {}} = reduxState;
  const imageRef = useRef()
  const [form, setFormData] = useState({
    owner: metamaskID,
    title: "",
    category: [],
    description: "",
    price: 0,
    thumbnail: undefined,
    PDFFile: undefined,
    PDFHash: undefined,
    ideaID: undefined,
    transactionID: undefined,
  });
  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    pdf: false,
    category: false,
    price: false,
    thumbnail: false
  })
  const [slideCount, setSlideCount] = useState(0);
  const [billet, setBillet] = useState({});
  let history = useHistory();
  const finalSlideCount = 1;
  const [fileData, setFileData] = useState({
    fileType: '',
    fileData: undefined
  });
  const [isPublishing, setIsPublishing] = useState(false);
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setFormData({
        ...form,
        owner: metamaskID,
      });
    }
    if(!_.isEmpty(form.owner)) {
        if(!_.isEmpty(form.category) ) {
          setFormErrors({...formErrors, category: false})
        } else {
          setFormErrors({...formErrors, category: true})
        }
    }
  },[ form.category]);

  useEffect(() => {
    const {metamaskID = undefined}  = reduxState;
    if(metamaskID) {
    setFormData({
      ...form,
      owner: metamaskID,
    });
    }
  }, [reduxState]);

  function onImageDrop(acceptedFiles) {
    setFormData({
      ...form,
      thumbnail: Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      }),
    });
  }

  function clearPDF() {
    setFormData({
      ...form,
      PDFFile: undefined,
    });
  }

  function clearImage() {
    setFormData({
      ...form,
      thumbnail: undefined,
    });
  }

  function onPDFDrop(acceptedFiles) {
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(acceptedFiles[0]);
    reader.onloadend = () => {
      Hash.of(Buffer(reader.result)).then((PDFHashValue) => {
        // Check for already existing PDF Hashes
        setFormData({
          ...form,
          PDFFile: acceptedFiles[0],
          PDFHash: PDFHashValue,
        });
      });
    };
  }

  function PDFLoadError(error) {}
  function onDocumentLoadSuccess(success) {}

  function handleTagsChange(tags) {
    setFormData({
      ...form,
      category: tags,
    });
  }

  function handleChange(event) {
    let returnObj = {};
    returnObj[event.target.name] = _.get(event, 'target.name') === 'price' ? Number(event.target.value):  event.target.value;
    setFormErrors({...formErrors, [event.target.name]: _.get(event, 'target.name') === 'price'? event.target.value <= 0 :  _.isEmpty(event.target.value)})
    setFormData({ ...form, ...returnObj });
  }

  function handleSubmit(event) {
    onSubmit();
  }

  function updateIdeaIDToMongo(payload) {
    MongoDBInterface.updateIdeaID(payload)
      .then((success) => {
        toast.dark("Your thoughts are live on blockchain.", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setBillet({
          transactionID: success.transactionID,
          account: success.account,
          PDFHash: success.PDFHash,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function saveToMongo(form) {
    MongoDBInterface.addSignature(form)
      .then((success) => {
        setIsPublishing(false)
        toast.dark("Your thoughts have been submitted!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        gotoProfile();
        // setSlideCount(finalSlideCount + 1)
      })
      .catch((err) => {
        setIsPublishing(false)
        console.log(err);
      });
  }

  function saveToBlockChain(form) {

    BlockChainInterface.publishIdea(form, saveToMongo, updateIdeaIDToMongo);
  }

  function onSubmit() {
    const params = _.clone({...form})
    params.category = JSON.stringify(params.category)
    params.IPFS = true;
    params.fileType = fileData.fileType;
    params.price =  typeof params.price === 'number' ? JSON.stringify(params.price) : params.price;
    params.fileType = fileData.fileType
    params.userID = reduxState.userDetails.userID
    setIsPublishing(true)
    StorageInterface.getFilePaths(params)
      .then((success) => {
        params.PDFFile = _.get(_.find(success, { type: "PDFFile" }), "path");
        params.thumbnail = _.get(
          _.find(_.map(success, "data"), { type: "thumbnail" }),
          "path"
        );
        saveToBlockChain(params);
      })
      .catch((error) => {
        return {
          PDFFile: "error",
          thumbnail: "error",
        };
      });
  }


  const checkValidationOnButtonClick = (page) => {
      const {
        title,
        description,
        PDFFile,
        category,
        price,
        thumbnail
      } = form;
          switch (page) {
            case 0: 
            if(_.isEmpty(title) || _.isEmpty(description) || _.isEmpty(PDFFile)) {
              
              setFormErrors({...formErrors, title: _.isEmpty(title) ,description: _.isEmpty(description), pdf:  _.isEmpty(PDFFile)})
            } else {
              setSlideCount(slideCount + 1);
              setFormErrors({...formErrors, title: false, description: false, pdf: false});
            }
            
            break;
            case 1: 
            if(price <= 0 || _.isEmpty(category) || _.isEmpty(thumbnail)) {
              setFormErrors({...formErrors, price: price <= 0, category:  _.isEmpty(category), thumbnail: _.isEmpty(thumbnail)})
            } else {
              handleSubmit();
              setFormErrors({...formErrors, price: false, category: false, thumbnail: false})
            }
            break
            default : break;
          }
  }

  const onDrop = useCallback((acceptedFiles) => {
    loadFile(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps} = useDropzone({onDrop, maxFiles: 1, accept: ['image/png', 'image/jpg', 'image/jpeg','.pdf', '.mp3']})

  const loadFile = (file) => {
    const fr = new window.FileReader();
      fr.onloadend = (e) => {
          setFileData({
            ...fileData,
            fileType: _.get(file, '[0].name').split('.')[1], 
            fileData: e.target.result
          })
          onPDFDrop(file);
     };
     fr.readAsDataURL(file[0]);
  }


  const getFileViewer =  () => {
      switch(fileData.fileType) {
        case 'pdf':
         return (
          <Document
          fillWidth
          file={form.PDFFile}
          onLoadError={PDFLoadError}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            fillWidth
            pageNumber={1}
            width={window.innerWidth / 4}
          />
        </Document>
         )
         case 'mp3':
           return (
            <audio
            controls
            >
              <source src={fileData.fileData}>
              </source>
                Your browser does not support the
                <code>audio</code> element.
        </audio>
           )
           case 'jpg':
           case 'jpeg':
            case 'png':
              return  (
                <img src={`${fileData.fileData}`} />
               )
  
        default: return null;
      }
   
  }

  return (
    <Container fluid>
      <Row className="createform  d-flex">
        <Col md="12" sm="12" lg="12" xs="12" className="responsive-content">
          <Form
            noValidate
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="create-form"
          >
            <Col md="12" className="overflow-auto h-100">
              {/* <Row>
                <Col
                  md="12"
                  className="create-wizard-bar justify-content-center align-items-center d-flex"
                ></Col>
              </Row> */}
              <Row className="content-container">
                {slideCount == 0 ? (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="pdf-container p-0"
                  >
                    {form.PDFFile && (
                          <div className="pdfUploaded w-100 h-100">
                            <X
                              className="removePDF cursor-pointer"
                              onClick={() => {
                                clearPDF();
                              }}
                            ></X>
                            {fileData.fileData && getFileViewer()}
                            
                          </div>
                        
                       
                    )}
                    {!form.PDFFile && (
                      <Form.Row className="empty-pdf-row">
                        <div className="file-drop-contatiner"  {...getRootProps()}>
                              <input {...getInputProps()} />
                              <p>Drag 'n' drop some files here, or click to select files</p>
                             <div>
                             <Plus />
                               </div> 
                            </div>
                            {
                                formErrors.pdf && <p className="invalid-paragraph"> PDF is required </p>
                                }
                        {/* <Dropzone
                          onDrop={onPDFDrop}
                          acceptedFiles={".pdf"}
                          className="dropzoneContainer"
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="container h-100 ">
                              <div
                                {...getRootProps()}
                                className="emptypdf dropZone h-100 d-flex flex-column align-items-center"
                              >
                                <input {...getInputProps()} />
                                <p className="m-0 dropfile-text">
                                  Drop your PDF File here
                                </p>
                                <FilePlus
                                  size={30}
                                  className="dropfile-icon"
                                  color="#79589F"
                                ></FilePlus>
                                {
                                formErrors.pdf && <p className="invalid-paragraph"> PDF is required </p>
                                }
                              </div>
                            </section>
                          )}
                        </Dropzone> */}
                      </Form.Row>
                    )}
                  </Col>
                )   : 
                (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="image-container p-0"
                  >
                    {form.thumbnail &&(
                          <div className="imageUploaded w-100 h-100">
                            <X
                              className="removeImage cursor-pointer"
                              onClick={() => {
                                clearImage();
                              }}
                            ></X>
                            <img
                              src={form.thumbnail.preview}
                              
                            />
                          </div>
                    )}
                    {!form.thumbnail && (
                      <Form.Row className="empty-image-row">
                        <Dropzone
                          onDrop={onImageDrop}
                          acceptedFiles={".jpeg"}
                          className="dropzoneContainer"
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="container h-100 ">
                              <div
                                {...getRootProps()}
                                className="emptyImage dropZone h-100 d-flex flex-column align-items-center"
                              >
                                <input {...getInputProps()} />
                                <p className="m-0 dropfile-text">
                                  Drop your thumbnail here
                                </p>
                                <ImageFile
                                  size={30}
                                  className="dropfile-icon"
                                  color="#79589F"
                                ></ImageFile>
                                {
                                formErrors.thumbnail && <p className="invalid-paragraph"> Thumbnail is required </p>
                                }
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </Form.Row>
                    )}
                  </Col>
                )
                }
                {slideCount == 0 ? (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="title-n-desc "
                  >
                    <Row className="">
                      <Form.Group
                        as={Col}
                        className="formEntry"
                        md="12"
                        controlId="title"
                      >
                        <Form.Control
                          type="text"
                          name="title"
                          value={form.title}
                          className={formErrors.title ? 'input-err titleArea' : "titleArea"}
                          placeholder="Title*"
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="form-row">
                      <Form.Group
                        as={Col}
                        className="formEntry"
                        md="12"
                        controlId="description"
                      >
                        <InputGroup>
                          <Form.Control
                           value={form.description}
                            className={formErrors.description ? 'input-err descriptionArea': "descriptionArea"}
                            as="textarea"
                            rows={17}
                            aria-describedby="inputGroupAppend"
                            name="description"
                            placeholder="Description*"
                            style={{ resize: "none" }}
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                  </Col>
                ): (
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="price-n-category p-2"
                  >
                    <Row className="">
                      <Form.Group as={Col} className="formEntry" md="12">
                        <Select
                          value={form.category}
                          closeMenuOnSelect={true}
                          isMulti
                          className={formErrors.category ? "input-err tag-selector" : "tag-selector"}
                          options={CONSTANTS.CATEGORIES}
                          onChange={handleTagsChange}
                          placeholder="Tags*"
                        />
                      </Form.Group>
                    </Row>
                    <Row className="">
                      <Form.Group as={Col} className="formEntry" md="12">
                        <InputGroup className="">
                          <Form.Control
                            type="number"
                            placeholder="how much do you think your idea is worth ?*"
                            min={1}
                            value={form.price ? form.price : undefined}
                            className={formErrors.price ? "input-err price-selector" : "price-selector"}
                            aria-label="Amount (ether)"
                            name="price"
                            onChange={handleChange}
                          />
                        </InputGroup>
                      </Form.Group>
                    </Row>
                  </Col>
                )}
              </Row>
              <Row className="footer-class p-1">
                <Col
                  md="12"
                  className="d-flex justify-content-between align-items-center "
                >
                  {slideCount == finalSlideCount + 1 ? (
                    <div></div>
                  ) : (
                    <Button
                      variant="secondary"
                      className="button"
                      bsstyle="primary"
                      onClick={() => {
                        onBack();
                      }}
                    >
                      {getBackButtonText()}
                    </Button>
                  )}

                  <Button
                    variant="primary"
                    className="button"
                    bsstyle="primary"
                    style={{ gap: '2px'}}
                    onClick={() => {
                      onNext();
                    }}
                    disabled={slideCount === finalSlideCount && isPublishing}
                  >
                    {getNextButtonText()} {"  "}
                    {slideCount === finalSlideCount && isPublishing && <Spinner style={{width:'15px', height:'15px'}} animation="border" />}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );

  function getNextButtonText() {
    if (slideCount == finalSlideCount) {
      return "Publish";
    } else if (slideCount == finalSlideCount + 1) {
      return "Done";
    } else if (slideCount < finalSlideCount) {
      return "Next";
    }
  }

  function getBackButtonText() {
    if (slideCount == 0) {
      return "Cancel";
    } else if (slideCount == finalSlideCount + 1) {
      return "";
    } else if (slideCount <= finalSlideCount) {
      return "Back";
    }
  }

  function onNext() {
    if (slideCount == finalSlideCount) {
      checkValidationOnButtonClick(slideCount)
      // handleSubmit();
    } else if (slideCount == finalSlideCount + 1) {
      gotoGallery();
    } else if (slideCount < finalSlideCount) {
      checkValidationOnButtonClick(slideCount)
    }
  }

  function onBack() {
    if (slideCount == 0) {
      gotoGallery();
    } else {
      setSlideCount(slideCount - 1);
    }
  }

  function gotoGallery() {
    history.push("/home");
  }
  function gotoProfile() {
    history.push("/profile");
  }
}

export default Create;
