// import {
//   Modal,
//   Form,
//   OverlayTrigger,
//   Tooltip,
//   Button,
//   Col,
//   Row,
//   InputGroup,
//   Dropdown,
// } from "react-bootstrap";
// import React, { useState, useEffect,useRef } from "react";
// import Dropzone from "react-dropzone";
// import imagePlaceholder from "../../../assets/images/image-placeholder.png";
// import CONSTANTS from "../../commons/Constants";
// import Select from "react-select";
// import "./edit-idea-modal.scss";
// import _ from "lodash";
// import { getPurposeIcon } from "../../commons/common.utils";
// import { shallowEqual, useSelector } from "react-redux";
// import ClanInterface from "../../interface/ClanInterface";
// const EditIdeaModal = ({
//   ...props
// }) => {
//   const reduxState = useSelector((state) => state, shallowEqual);
//   useEffect(() => {
//     const { userDetails = {} } = reduxState;
//   }, [reduxState.userDetails]);

//   const [form, setFormData] = useState(props.idea);

//   const handleTagsChange = (tags) => {
//     setFormData({
//       ...form,
//       category: tags,
//     });
//   };

//   const checkDisablePrice = () => {
//     if (
//       CONSTANTS.PURPOSES.COLLAB === form.purpose ||
//       CONSTANTS.PURPOSES.KEEP === form.purpose
//     ) {
//       setFormData({ ...form, price: 0 });
//       return true;
//     }
//     return false;
//   };

//   function handleSubmit() {
//     const params = _.clone({ ...form });
//     params.category = JSON.stringify(params.category);
//     params.creator = metamaskID;
//     params.IPFS = true;
//     params.fileType = fileData.fileType;
//     params.price =
//       typeof params.price === "number"
//         ? JSON.stringify(params.price)
//         : params.price;
//     params.fileType = fileData.fileType;
//     params.userName = reduxState.userDetails.userName;
 
//     setPublishState(PROGRESS);
//     // setSlideCount(LOADING_SLIDE);
//     StorageInterface.getFilePaths(params)
//       .then((success) => {
//         params.PDFFile = _.get(_.find(success, { type: "PDFFile" }), "path");
//         params.thumbnail = _.get(
//           _.find(_.map(success, "data"), { type: "thumbnail" }),
//           "path"
//         );
//         saveToBlockChain(params);
//       })
//       .catch((error) => {
//         return {
//           PDFFile: "error",
//           thumbnail: "error",
//         };
//       });
//   }

//   const checkValidationBeforeSubmit = () => {
//     const { category, price, thumbnail } = form;
//     if (_.isEmpty(category) || _.isEmpty(thumbnail)) {
//       if (!checkDisablePrice()) {
//         setFormErrors({
//           ...formErrors,
//           price: price <= 0,
//           category: _.isEmpty(category),
//           thumbnail: _.isEmpty(thumbnail),
//         });
//       } else {
//         setFormErrors({
//           ...formErrors,
//           price: false,
//           category: _.isEmpty(category),
//           thumbnail: _.isEmpty(thumbnail),
//         });
//       }
//     } else {
//       handleSubmit();
//     }
//   };

//   const onImageDrop = (acceptedFiles) => {
//     setFormData({
//       ...form,
//       thumbnail: Object.assign(acceptedFiles[0], {
//         preview: URL.createObjectURL(acceptedFiles[0]),
//       }),
//     });
//   };


//   const setPurpose = (purpose) => {
//     setFormData({ ...form, purpose });
//   };

//   const priceRef = useRef(null);

//   const [formErrors, setFormErrors] = useState({
//     title: false,
//     description: false,
//     pdf: false,
//     category: false,
//     price: false,
//     thumbnail: false,
//     maxFileError: false,
//     publish: ""
//   });

//   const check250Words = (value) => value.split(/[\s]+/).length > 250;

//   const handleChange = (event) => {
//     if (event.target.name === "description") {
//       if (check250Words(event.target.value)) {
//         return false;
//       }
//     }
//     let returnObj = {};
//     returnObj[event.target.name] =
//       _.get(event, "target.name") === "price"
//         ? Number(event.target.value)
//         : event.target.value;
//     setFormErrors({
//       ...formErrors,
//       [event.target.name]:
//         _.get(event, "target.name") === "price"
//           ? event.target.value <= 0
//           : _.isEmpty(event.target.value),
//     });
//     setFormData({ ...form, ...returnObj });
//   };


//   const clearImage = () => {
//     setFormData({
//       ...form,
//       thumbnail: undefined,
//     });
//   };

//   const getThumbnailImage = () => {
//     return form.thumbnail ? (
//       <div className="imageUploaded w-100 h-100">
//         <OverlayTrigger placement="left" overlay={<Tooltip>Remove</Tooltip>}>
//           <Button
//             className="remove-thumbnail-btn"
//             variant="outline-secondary"
//             onClick={() => {
//               clearImage();
//             }}
//           >
//             <i className="fa fa-trash" aria-hidden="true"></i>
//           </Button>
//         </OverlayTrigger>

//         <img
//           src={form.thumbnail.preview}
//           className="uploadedImage"
//           alt="thumbnail"
//         ></img>
//       </div>
//     ) : (
//       <Form.Row className="empty-image-row">
//         <Dropzone
//           onDrop={onImageDrop}
//           acceptedFiles={".jpeg"}
//           className="dropzoneContainer"
//         >
//           {({ getRootProps, getInputProps }) => (
//             <section className="container h-100 ">
//               <div
//                 {...getRootProps()}
//                 className="emptyImage dropZone h-100 d-flex flex-column align-items-center"
//               >
//                 <input {...getInputProps()} />
//                 <img
//                   src={imagePlaceholder}
//                   className="placeholder-image"
//                   alt=" placehoder"
//                 />
//                 <p className="dropfile-text">Drop your thumbnail here</p>

//                 {formErrors.thumbnail && (
//                   <p className="invalid-paragraph"> Thumbnail is required </p>
//                 )}
//               </div>
//             </section>
//           )}
//         </Dropzone>
//       </Form.Row>
//     );
//   };

//   const isSelectedPurpose = (purpose) => form.purpose === purpose;

//   function getConditionalCompnent() {
//     switch (form.purpose) {
//       case CONSTANTS.PURPOSES.AUCTION:
//         return (
//           <Col md="12">
//             <span className="purpose-message second-grey">
//               We know your idea is worth the traction. We will get you there
//               sooon.
//             </span>
//           </Col>
//         );

//       case CONSTANTS.PURPOSES.SELL:
//         return (
//           <Col md="12">
//             <span className="purpose-message second-grey">
//               Set a price to the idea and it will be sold immediately when there
//               is a buyer.
//             </span>
//             <div className="price-section">
//               <div className="price-label second-grey">
//                 <Form.Label>
//                   {CONSTANTS.PURPOSES.AUCTION === form.purpose
//                     ? "Base price"
//                     : "Price"}
//                 </Form.Label>
//               </div>
//               <InputGroup className="price-input-group">
//                 <Form.Control
//                   type="number"
//                   placeholder="how much do you think your idea is worth ?"
//                   min={1}
//                   value={form.price ? form.price : undefined}
//                   className={
//                     formErrors.price
//                       ? `input-err price-selector `
//                       : `price-selector `
//                   }
//                   aria-label="Amount (ether)"
//                   name="price"
//                   onChange={handleChange}
//                   ref={priceRef}
//                 />
//                 <InputGroup.Text>Tribe Coin</InputGroup.Text>
//               </InputGroup>
//             </div>
//           </Col>
//         );
//         break;
//       case CONSTANTS.PURPOSES.COLLAB:
//         return (
//           <Col md="12">
//             <span className="purpose-message second-grey">
//               You may chose to licence it to multiple people. Only your idea
//               will be available in the market.
//             </span>
//             <div className="collab-section">
//               <Dropdown className="w-100">
//                 <Dropdown.Toggle
//                   variant="light"
//                   id="dropdown-basic"
//                   className="w-100 justify-content-start "
//                 >
//                   {form.collab}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   {CONSTANTS.COLLAB_TYPE.map((item) => (
//                     <Dropdown.Item
//                       name="storageGroup"
//                       onClick={() =>
//                         setFormData({ ...form, collab: item.value })
//                       }
//                     >
//                       {item.label}
//                     </Dropdown.Item>
//                   ))}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//           </Col>
//         );
//         break;
//       case CONSTANTS.PURPOSES.LICENCE:
//         return (
//           <Col md="12" sm="12" lg="12" cs="12">
//             <Row>
//               <Col md="12">
//                 <span className="purpose-message second-grey">
//                   You may chose to licence it to multiple people. Only your idea
//                   will be available in the market.
//                 </span>
//               </Col>
//             </Row>
//             <Row>
//               <Col md="6" sm="12" xs="12" lg="6">
//                 {/* <span className="purpose-message second-grey">Amount per unit</span> */}
//                 <InputGroup className="price-input-group">
//                   <Form.Control
//                     type="number"
//                     placeholder="Price per unit"
//                     min={1}
//                     value={form.price ? form.price : undefined}
//                     className={
//                       formErrors.price
//                         ? `input-err price-selector `
//                         : `price-selector `
//                     }
//                     aria-label="Amount (BNB)"
//                     name="price"
//                     onChange={handleChange}
//                     ref={priceRef}
//                   />
//                   <InputGroup.Text>BNB</InputGroup.Text>
//                 </InputGroup>
//               </Col>
//               <Col md="6" sm="12" xs="12" lg="6">
//                 {/* <span className="purpose-message second-grey">Number of units</span> */}
//                 <InputGroup className="price-input-group">
//                   <Form.Control
//                     type="number"
//                     placeholder="Number of units"
//                     min={1}
//                     value={form.umits ? form.umits : undefined}
//                     className={
//                       formErrors.umits
//                         ? `input-err umits-selector `
//                         : `umits-selector `
//                     }
//                     aria-label="umits"
//                     name="umits"
//                     onChange={handleChange}
//                     ref={priceRef}
//                   />
//                   <InputGroup.Text>UNITS</InputGroup.Text>
//                 </InputGroup>
//               </Col>
//             </Row>
//           </Col>
//         );
//       case CONSTANTS.PURPOSES.KEEP:
//         return (
//           <Col md="12">
//             <span className="purpose-message second-grey">
//               The record will not be open for any interaction. It will be still
//               be visible for everyone.
//             </span>
//           </Col>
//         );
//     }
//   }

//   const getElement = () => {
//     let pusposeList = [
//       CONSTANTS.PURPOSES.SELL,
//       CONSTANTS.PURPOSES.AUCTION,
//       CONSTANTS.PURPOSES.LICENCE,
//       CONSTANTS.PURPOSES.COLLAB,
//       CONSTANTS.PURPOSES.KEEP,
//     ];
//     return (
//       <>
//         <Row>
//           <Col md="12" lg="12" sm="12" xs="12">
//             <Form.Group as={Col} className="formEntry" md="12">
//               <div className="tags-label master-grey">
//                 <Form.Label>Category </Form.Label>
//               </div>
//               <Select
//                 value={form.category}
//                 closeMenuOnSelect={false}
//                 className={
//                   formErrors.category
//                     ? "input-err tag-selector"
//                     : "tag-selector"
//                 }
//                 options={CONSTANTS.CATEGORIES}
//                 onChange={handleTagsChange}
//                 placeholder=""
//               />
//             </Form.Group>
//           </Col>
//           {/* <Col md="6" lg="6" sm="6" xs="6">
//                 <Form.Group as={Col} className="formEntry" md="12">
//                   <div className="tags-label master-grey">
//                     <Form.Label>Clan </Form.Label>
//                     <OverlayTrigger
//                       placement="top"
//                       overlay={
//                         <Tooltip id={`tooltip-top`}>
//                           The clan will be the owner of the idea
//                         </Tooltip>
//                       }
//                     >
//                       <i className="fa fa-info" aria-hidden="true"></i>
//                     </OverlayTrigger>
//                   </div>
//                   <Select
//                     value={form.category}
//                     closeMenuOnSelect={false}
//                     className={
//                       formErrors.category
//                         ? "input-err tag-selector"
//                         : "tag-selector"
//                     }
//                     options={userClans}
//                     onChange={handleTagsChange}
//                     placeholder=""
//                   />
//                 </Form.Group>
//               </Col> */}
//           <Col md="12" lg="12" sm="12" xs="12">
//             <Form.Group
//               as={Col}
//               className="file-storage-group"
//               md="12"
//               controlId="fileStorage"
//             >
//               <div className="file-storage-label master-grey">
//                 <Form.Label>File Storage </Form.Label>
//                 <OverlayTrigger
//                   placement="top"
//                   overlay={
//                     <Tooltip id={`tooltip-top`}>
//                       Choose file storage type
//                     </Tooltip>
//                   }
//                 >
//                   <i className="fa fa-info" aria-hidden="true"></i>
//                 </OverlayTrigger>
//               </div>
//               <Dropdown className="w-100">
//                 <Dropdown.Toggle
//                   variant="light"
//                   id="dropdown-basic"
//                   className="w-100 justify-content-start selected-storage"
//                 >
//                   {form.storage}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   {CONSTANTS.STORAGE_TYPE.map((item) => (
//                     <Dropdown.Item
//                       name="storageGroup"
//                       onClick={() =>
//                         setFormData({ ...form, storage: item.value })
//                       }
//                     >
//                       {item.label}
//                     </Dropdown.Item>
//                   ))}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </Form.Group>
//           </Col>
//         </Row>

//         <div className="purpose-selection">
//           <Row className="purpose-selector-row">
//             <Col md="12" className="">
//               <div className="purpose-label master-grey">
//                 <Form.Label>
//                   What would you like to do with the idea ?{" "}
//                 </Form.Label>
//               </div>
//               <div className="purpose-tabs">
//                 {pusposeList.map((entry) => {
//                   return (
//                     <div
//                       className={
//                         isSelectedPurpose(entry)
//                           ? "purpose-entry selected"
//                           : "purpose-entry"
//                       }
//                       onClick={() => {
//                         setPurpose(entry);
//                       }}
//                     >
//                       <i className={getPurposeIcon(entry)}></i>
//                       <span className="second-grey purpose-text">{entry}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </Col>
//           </Row>
//         </div>
//         <div className="selective-component">
//           <div>{getConditionalCompnent()}</div>
//         </div>
//         <Row className="button-section  d-flex">
//           <Col xs="12" className="button-bar">
//             <Button className="cancel-btn">Cancel</Button>
//             <Button
//               className="submit-btn"
//               onClick={checkValidationBeforeSubmit}
//             >
//               Submit
//             </Button>
//           </Col>
//         </Row>
//       </>
//     );
//   };
//   return (
//     <Modal
//       show={true}
//       onHide={props.onHide}
//       size="lg"
//       className="edit-idea-modal"
//       dialogClassName="edit-idea-modal-dialog"
//       centered
//       backdrop="static"
//     >
//       <Modal.Body className="edit-idea-modal-body">
//         <div className="modal-header-wrapper">
//           <div className="image-placeholder">{getThumbnailImage()}</div>
//         </div>
//         <div className="wrapper">{getElement()}</div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default EditIdeaModal;
