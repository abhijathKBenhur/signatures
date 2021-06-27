import React, { useCallback, useEffect,  useRef,  useState } from "react";
import {  Button, Row, Col, Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import StorageInterface from "../../interface/StorageInterface";
import Dropzone, { useDropzone } from "react-dropzone";
import CONSTANTS from "../../commons/Constants";
import { useHistory } from "react-router-dom";
import "./Create.scss";
import {  X, Image as ImageFile, Info, UploadCloud, Check } from "react-feather";
import Hash from "ipfs-only-hash";
import { Container, Spinner } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
import _ from "lodash";
import { toast } from "react-toastify";
import Select from "react-select";
import "react-step-progress-bar/styles.css";
import { shallowEqual, useSelector } from "react-redux";
import user from "../../../assets/images/user1.png";
import audio from "../../../assets/images/audio.png";
import loadingGif from "../../../assets/Hourglass.gif";

function Create(props) {
 
  
  const reduxState = useSelector((state) => state, shallowEqual);
  const { metamaskID = undefined, userDetails = {} } = reduxState;
  const [form, setFormData] = useState({
    owner: metamaskID,
    creator: metamaskID,
    title: "",
    category: [],
    description: "",
    price: 0,
    thumbnail: undefined,
    PDFFile: undefined,
    PDFHash: undefined,
    ideaID: undefined,
    transactionID: undefined,
    purpose: CONSTANTS.PURPOSES.SELL,
    storage: CONSTANTS.STORAGE_TYPE.PUBLIC,
  });
  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    pdf: false,
    category: false,
    price: false,
    thumbnail: false,
    maxFileError: false
  });
  const [slideCount, setSlideCount] = useState(0);
  const [billet, setBillet] = useState({});
  const priceRef = useRef(null);
  let history = useHistory();
  const finalSlideCount = 2;
  const [fileData, setFileData] = useState({
    fileType: "",
    fileData: undefined,
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
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
    if (!_.isEmpty(form.owner)) {
      if (!_.isEmpty(form.category)) {
        setFormErrors({ ...formErrors, category: false });
      } else {
        setFormErrors({ ...formErrors, category: true });
      }
    }
  }, [form.category]);

  useEffect(() => {
    const { metamaskID = undefined } = reduxState;
    if (metamaskID) {
      setFormData({
        ...form,
        owner: metamaskID,
      });
    }
  }, [reduxState]);

  useEffect(() => {
    if(priceRef.current)  {
      if(checkDisablePrice()) {
        priceRef.current.disabled = true;
        priceRef.current.style.backgroundColor = '#565656'
      } else {
        priceRef.current.disabled = false;
        priceRef.current.style.backgroundColor = ''
  
      }
    }
   
  }, [form.purpose])
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
    returnObj[event.target.name] =
      _.get(event, "target.name") === "price"
        ? Number(event.target.value)
        : event.target.value;
    setFormErrors({
      ...formErrors,
      [event.target.name]:
        _.get(event, "target.name") === "price"
          ? event.target.value <= 0
          : _.isEmpty(event.target.value),
    });
    setFormData({ ...form, ...returnObj });
  }

  function updateIdeaIDToMongo(payload) {
    MongoDBInterface.updateIdeaID(payload)
      .then((success) => {
        setIsPublishing(false);
        setIsPublished(true);
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
        setIsPublishing(false);
        console.log(err);
      });
  }

  function saveToMongo(form) {
    MongoDBInterface.addSignature(form)
      .then((success) => {
        toast.dark("Your thoughts have been submitted!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
       
        // setSlideCount(finalSlideCount + 1)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function saveToBlockChain(form) {
    BlockChainInterface.publishIdea(form, saveToMongo, updateIdeaIDToMongo);
  }

  function handleSubmit() {
    const params = _.clone({ ...form });
    params.category = JSON.stringify(params.category);
    params.creator = metamaskID
    params.IPFS = true;
    params.fileType = fileData.fileType;
    params.price =
      typeof params.price === "number"
        ? JSON.stringify(params.price)
        : params.price;
    params.fileType = fileData.fileType;
    params.userID = reduxState.userDetails.userID;
    setIsPublishing(true);
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
    const { title, description, PDFFile, category, price, thumbnail } = form;
    switch (page) {
      case 0:
        if (_.isEmpty(title) || _.isEmpty(description) || _.isEmpty(PDFFile)) {
          setFormErrors({
            ...formErrors,
            title: _.isEmpty(title),
            description: _.isEmpty(description),
            pdf: _.isEmpty(PDFFile),
          });
        } else {
          setSlideCount(slideCount + 1);
          setFormErrors({
            ...formErrors,
            title: false,
            description: false,
            pdf: false,
          });
        }

        break;
      case 1:
        if ( _.isEmpty(category) || _.isEmpty(thumbnail)) {
          if(!checkDisablePrice()) {
            setFormErrors({
              ...formErrors,
              price: price <= 0,
              category: _.isEmpty(category),
              thumbnail: _.isEmpty(thumbnail),
            });
          }  else {
            setFormErrors({
              ...formErrors,
              price: false,
              category: _.isEmpty(category),
              thumbnail: _.isEmpty(thumbnail),
            });
          }
        } else {
          setSlideCount(slideCount + 1);
        }
        break;
        case 2:
            handleSubmit();
            setFormErrors({
              ...formErrors,
              price: false,
              category: false,
              thumbnail: false,
            });
        break;
      default:
        break;
    }
  };

  const onDrop = (acceptedFiles) => {
    if(checkMaxFileSize(_.get(acceptedFiles, '[0]'))) {
        setFormErrors({...formErrors, maxFileError: true})
    } else {
      loadFile(acceptedFiles);
    }
  }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: ["image/png", "image/jpg", "image/jpeg", ".pdf", ".mp3"],
  });
  const getFileName = (filename) =>  filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;


  const loadFile = (file) => {
    const fr = new window.FileReader();
    fr.onloadend = (e) => {
      setFileData({
        ...fileData,
        fileType: String(getFileName(_.get(file, "[0].name"))).toLowerCase(),
        fileData: e.target.result,
      });
      setFormErrors({...formErrors, maxFileError: false})
      onPDFDrop(file);
    };
    fr.readAsDataURL(file[0]);
  };

  const getFileViewer = () => {
    switch (fileData.fileType) {
      case "pdf":
        return (
          <Document
            fillWidth
            file={form.PDFFile}
            onLoadError={PDFLoadError}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page fillWidth pageNumber={1} width={window.innerWidth / 4} />
          </Document>
        );
      case "mp3":
        return (
          <div className="audio-wrapper">
          <img src={audio} alt="" className="mb-1"/>
          <audio controls>
            <source src={fileData.fileData}></source>
            Your browser does not support the
            <code>audio</code> element.
          </audio>
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
        return <img src={`${fileData.fileData}`} alt=""/>;

      default:
        return null;
    }
  };

  function setPurpose(purpose) {
    setFormData({ ...form, purpose });
  }
  
  const isSelectedPurpose = (purpose) => form.purpose === purpose
  const checkMaxFileSize = (file) => {
      try {
        const size = Math.floor(file.size /1000000)
          return size > 5 ? true : false
      } catch (err) {
        console.log('err = ', err)
        return false
      }
    
    
  } 

  const checkDisablePrice = () => {
    if((CONSTANTS.PURPOSES.COLLAB === form.purpose || CONSTANTS.PURPOSES.KEEP === form.purpose)) {
      setFormData({...form, price: 0})
      return true;
    }
    return false
  }

  const getViewBasedOnSteps = () => {
    switch (slideCount) {
      case 0 :
        return (
            <>
            <Col md="6" sm="12" lg="6" xs="12" className="title-n-desc pb-0">
              <Row className="">
                
                <Form.Group
                  as={Col}
                  className="formEntry"
                  md="12"
                  controlId="title"
                >
                   <div className="title-label">
                  <Form.Label>Title </Form.Label>
                     </div>
                  <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    className={
                      formErrors.title
                        ? "input-err titleArea"
                        : "titleArea"
                    }
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
                  <div className="description-label">
                  <Form.Label>Description </Form.Label>
                     </div>
                  <InputGroup>
                    <Form.Control
                      value={form.description}
                      className={
                        formErrors.description
                          ? "input-err descriptionArea"
                          : "descriptionArea"
                      }
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
              <Row  className="form-row">
              <Form.Group
                  as={Col}
                  className="file-storage-group"
                  md="12"
                  controlId="fileStorage"
                >
                  <div className="file-storage-label">
                  <Form.Label>File Storage </Form.Label>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-top`}>
                        Choose file storage type
                      </Tooltip>
                    }
                  >
                  <Info />
                  </OverlayTrigger>
                  </div>
                   <Select
                    className="basic-single"
                    classNamePrefix="select"
                    name="color"
                    defaultValue={{value: form.storage, label: form.storage}}
                    options={CONSTANTS.FileStorageDropdownOptions}
                  />
            </Form.Group>
              </Row>
            </Col>
            
              <Col
                md="6"
                sm="12"
                lg="6"
                xs="12"
                className="pdf-container"
              >
                {form.PDFFile && !formErrors.maxFileError &&  (
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
                    <div
                      className="file-drop-contatiner"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud/>
                      <p>
                        Drag 'n' drop some files here, or click to select
                        files
                        
                      </p>
                      <p>
                      (Upload pdf / mp3 / image)
                      </p>
                      <div>
                        {/* <Plus /> */}
                      </div>
                      {formErrors.pdf && (
                      <p className="invalid-paragraph"> File  is required </p>
                    )}
                    {
                       formErrors.maxFileError && <p className="invalid-paragraph"> Max file size is 5MB </p>
                    }
                    </div>
                   
                  </Form.Row>
                )}
              </Col>
              </>
        )
      case 1:
     return (
      <>
            <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="price-n-category"
                  >
                    <Row className="">
                      <Form.Group as={Col} className="formEntry" md="12">
                      <div className="tags-label">
                        <Form.Label>Tags </Form.Label>
                           </div>
                        <Select
                          value={form.category}
                          closeMenuOnSelect={true}
                          isMulti
                          className={
                            formErrors.category
                              ? "input-err tag-selector"
                              : "tag-selector"
                          }
                          options={CONSTANTS.CATEGORIES}
                          onChange={handleTagsChange}
                          placeholder="Tags*"
                        />
                      </Form.Group>
                    </Row>
                    <Row className="purpose-selector-row">
                      <Col md="12" className="p-0">
                        <div className="purpose-label">
                        <Form.Label>What would you like to do with the idea ? </Form.Label>
                           </div>
                        <Row>
                          <Col md="6">
                            <Button
                              variant="outline-primary"
                              className="purpose-button"
                              onClick={() => {
                                setPurpose(CONSTANTS.PURPOSES.AUCTION);
                              }}
                            >
                              {
                               isSelectedPurpose(CONSTANTS.PURPOSES.AUCTION) && <Check />
                              }
                               
                              Auction
                            </Button>
                          </Col>
                          <Col md="6">
                            <Button
                              variant="outline-primary"
                              className="purpose-button"
                              onClick={() => {
                                setPurpose(CONSTANTS.PURPOSES.SELL);
                              }}
                            >
                              {
                               isSelectedPurpose(CONSTANTS.PURPOSES.SELL) && <Check />
                              }
                              Sell
                            </Button>
                          </Col>
                          <Col md="6">
                            <Button
                              variant="outline-primary"
                              className="purpose-button"
                              onClick={() => {
                                setPurpose(CONSTANTS.PURPOSES.COLLAB);
                              }}
                            >
                              {
                               isSelectedPurpose(CONSTANTS.PURPOSES.COLLAB) && <Check />
                              }
                              Collab
                            </Button>
                          </Col>
                          <Col md="6">
                            <Button
                              variant="outline-primary"
                              className="purpose-button"
                              onClick={() => {
                                setPurpose(CONSTANTS.PURPOSES.KEEP);
                              }}
                            >
                             {
                               isSelectedPurpose(CONSTANTS.PURPOSES.KEEP) && <Check />
                              }
                              Keep
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                 
                    <Row className="">
                      <Form.Group as={Col} className="formEntry" md="12">
                      <div className="price-label">
                        <Form.Label>
                          {CONSTANTS.PURPOSES.AUCTION === form.purpose ? 'Base price' : 'Price'}
                           </Form.Label>
                           </div>
                        <InputGroup className="price-input-group">
                          <Form.Control
                            type="number"
                            placeholder="how much do you think your idea is worth ?*"
                            min={1}
                            value={form.price ? form.price : undefined}
                            className={
                              formErrors.price
                                ? `input-err price-selector `
                                : `price-selector `
                            }
                            aria-label="Amount (ether)"
                            name="price"
                            onChange={handleChange}
                            ref={priceRef}
                          />
                          <InputGroup.Text>BNB</InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Row>
                  </Col>
                  <Col
                    md="6"
                    sm="12"
                    lg="6"
                    xs="12"
                    className="image-container p-0"
                  >
                    {form.thumbnail && (
                      <div className="imageUploaded w-100 h-100">
                        <X
                          className="removeImage cursor-pointer"
                          onClick={() => {
                            clearImage();
                          }}
                        ></X>
                        <img src={form.thumbnail.preview} alt="" />
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
                                <ImageFile
                                  size={30}
                                  className="dropfile-icon"
                                  color="#fff"
                                ></ImageFile>
                                <p className="m-0 dropfile-text">
                                  Drop your thumbnail here
                                </p>
                               
                                {formErrors.thumbnail && (
                                  <p className="invalid-paragraph">
                                    {" "}
                                    Thumbnail is required{" "}
                                  </p>
                                )}
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </Form.Row>
                    )}
                  </Col>
      </>
     )
      
      default: 
           return (
             <>
            <Col md="6" sm="12" lg="6" xs="12" className="preview-doc ">
            <Row className="form-row">
            <Col
                md="6"
                sm="12"
                lg="6"
                xs="12"
                className="pdf-container"
              >
                {form.PDFFile && (
                  <div className="pdfUploaded w-100 h-100">
                    
                    {fileData.fileData && getFileViewer()}
                  </div>
                )}
                
                </Col>
                <Col 
                  md="6"
                  sm="12"
                  lg="6"
                  xs="12"
                  className="description-container"
                >
                <p>
                  {form.description}
                </p>
                </Col>
            </Row>
            </Col>
            <Col md="6" sm="12" lg="6" xs="12" className="preview-details ">
            <div className="content-profile">
                          <img src={userDetails.imageUrl ? userDetails.imageUrl : user} alt="" />
                          <p>
                            {userDetails.userID}
                          </p>
                        </div>
                        <div className="description">
                          <p>
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                           Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
                            printer took a galley of type and scrambled it to make a type specimen book.
                          </p>
                        </div>
                        <div className="price">
                         <p>
                        Price: {form.price} <span>ETH</span>
                           </p> 
                        </div>
            </Col>
             </>
           )
      
    }
  }

  const getPublishedView = () => {
    return (
      <Col md="12" sm="12" lg="12" xs="12" className="published-wrapper ">
        <div className="success-block">
        <p>Your Idea is posted in blockchain</p>
          <Check />
        </div>
          
          <div className="transaction-data">
            <div className="transaction-ids">
              <p>Transaction ID- <span>{billet.transactionID}</span></p>
              <p>File Hash ID- <span>{billet.PDFHash}</span></p>
              <p>* Please save both of these for future reference.</p>
            </div>
            <div className="btn-block">
            <Button
                    variant="primary"
                    className="button"
                    bsstyle="primary"
                    onClick={() => gotoProfile()}
                  > Done
                    </Button>
            </div>
          </div>
      </Col>
    )
  }

  const getPublishingView = () => {
    return (
      <Col md="12" sm="12" lg="12" xs="12" className="publishing-wrapper ">
        <div className="publishing-block">
        <p>Your Idea is processing. Please wait</p>
        </div>
          
          <div className="gif-wrapper">
          <img src={loadingGif} alt="" />
          </div>
      </Col>
    )
  }


  return (
    <Container >
      <Row className="createform  d-flex">
        <Col md="12" sm="12" lg="12" xs="12" className="responsive-content">
          <Form
            noValidate
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="create-form"
          >
            <Col md="12" className="overflow-auto h-100 p-0">
              {/* <Row>
                <Col
                  md="12"
                  className="create-wizard-bar justify-content-center align-items-center d-flex"
                ></Col>
              </Row> */}
              <Row className="content-container">
                
                {slideCount === finalSlideCount && isPublished ? getPublishedView() : slideCount === finalSlideCount && isPublishing ? getPublishingView() : getViewBasedOnSteps()}
               
           
              </Row>
              {!isPublished && !isPublishing && 
                <Row className="footer-class ">
                <Col
                  md="6"
                  className="d-flex justify-content-between align-items-center "
                >
                  {slideCount === finalSlideCount + 1 ? (
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

                 
                </Col>
                <Col
                  md="6"
                  className="d-flex justify-content-end align-items-center right-btn-container"
                 
                > 
                 <Button
                    variant="primary"
                    className="button"
                    bsstyle="primary"
                    style={{ gap: "2px" }}
                    onClick={() => {
                      onNext();
                    }}
                  >
                    {getNextButtonText()} {"  "}
                    
                  </Button>
                </Col>
              </Row>
            
              }
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );

  function getNextButtonText() {
    if (slideCount === finalSlideCount) {
      return "Publish";
    } else if (slideCount  === 0) {
      return "Next";
    } else if (slideCount === 1) {
      return "Preview";
    } 
  }

  function getBackButtonText() {
    if (slideCount === 0) {
      return "Cancel";
    } else if (slideCount === finalSlideCount + 1) {
      return "";
    } else if (slideCount <= finalSlideCount) {
      return "Back";
    }
  }

  function onNext() {
    if (slideCount === finalSlideCount) {
      checkValidationOnButtonClick(slideCount);
      // handleSubmit();
    } else if (slideCount === finalSlideCount + 1) {
      gotoGallery();
    } else if (slideCount < finalSlideCount) {
      checkValidationOnButtonClick(slideCount);
    }
  }

  function onBack() {
    if (slideCount === 0) {
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
