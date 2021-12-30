import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import _ from "lodash";
import { Row, Col, Form, InputGroup, Dropdown, Image } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";
import CONSTANTS from "../../commons/Constants";
import minions from "../../../assets/images/minions.png";
import loadingGif from "../../../assets/images/loader_blocks.gif";
import error from "../../../assets/images/error.png";
import purchased from "../../../assets/images/purchased.png";
import { getPurposeIcon } from "../../commons/common.utils";
import { showToaster } from "../../commons/common.utils";
import "./details-modal.scss";
import SignatureInterface from "../../interface/SignatureInterface";
import StorageInterface from "../../interface/StorageInterface";
import BlockchainInterface from "../../interface/BlockchainInterface";
import Web3 from "web3";
import TransactionsInterface from "../../interface/TransactionInterface";
import Dropzone from "react-dropzone";
import Select from "react-select";
import { MentionsInput, Mention } from 'react-mentions'



const DetailsModal = (props) => {
  let history = useHistory();
 
  const app_constants = CONSTANTS;
  const [engaging, setEngaging] = useState(CONSTANTS.ACTION_STATUS.INIT);
  const [statusMessage, setStatusMessage] = useState("");

  const [form, setFormData] = useState({})

  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    pdf: false,
    category: false,
    price: false,
    thumbnail: false,
    maxFileError: false,
    publish: "",
  });

  useEffect(() => {
    setFormData(
      {
        title: _.get(props, 'idea.title'),
        description: _.get(props, 'idea.description'),
        thumbnail: _.get(props, 'idea.thumbnail'),
        category: _.get(props, 'idea.category') ? JSON.parse(_.get(props, 'idea.category')) : undefined
      }
    )
  }, [props]);
  const check250Words = (value) => value.split(/[\s]+/).length > 250;

  const handleChange = (event) => {
    if (event.target.name === "description") {
      if (check250Words(event.target.value)) {
        return false;
      }
    }
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
  };
    const handleChanges = (event, newValue, newPlainTextValue, mentions) => {
      setFormData({...form, description: event.target.value})
    }

    const handleCategoryChange = (event) => {
      setFormData({...form, category: event})
    }
    const onImageDrop = (acceptedFiles) => {
      setFormData({
        ...form,
        thumbnail: Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
          updated: true
        }),
      });
    };

    const updateSignature = () => {
      SignatureInterface.updateSignature({
        update: {...form,
        category: JSON.stringify(form.category)
      },
        id: props.idea._id,
      }).then((success) => {
        window.location.reload();
      });
    }

    const updateFunction = () => {
      props.onHide()
      if(form.thumbnail != props.idea.thumbnail){
        StorageInterface.getFilePaths(form, _.get(form.thumbnail,'updated'))
        .then((success) => {
          form.PDFFile = _.get(_.find(success, { type: "PDFFile" }), "path");
          if(_.get(form.thumbnail,'updated')){
            form.thumbnail = _.get(
              _.find(_.map(success, "data"), { type: "thumbnail" }),
              "path"
            );
          }
          
          updateSignature();
        })
      } else {
        updateSignature();
      }
     
    }

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="lg"
      className="info-modal"
      dialogClassName="info-modal-dialog"
      centered
      close="true"
    >
      <Modal.Body className="info-modal-body">
      <Row>
        <Col>
        <Form.Group
                  as={Col}
                  className="formEntry"
                  md="12"
                  controlId="title"
                >
                {/* <div className="tags-label master-grey">
                    <Form.Label> Title </Form.Label>
                  </div> */}
                 <Form.Control
                    type="text"
                    name="title"
                    value={form.title}
                    placeholder="Title*"
                    maxLength={50}
                    onChange={handleChange}
                    className="color-primary master-header border-0"
                  />
                </Form.Group>
                </Col>
      </Row>
      <Form.Row className="image-placeholder">
      <div className="empty-image-row">
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
                <img
                  src={_.get(form, 'thumbnail.preview') || form.thumbnail}
                  className="placeholder-image"
                  alt=" placehoder"
                />
                <p className="dropfile-text">Edit thumbnail</p>
              </div>
            </section>
          )}
        </Dropzone>
        </div>
      </Form.Row>
      <Row>
        <Col>
        <Form.Group
                    as={Col}
                    className="formEntry desc-group"
                    md="12"
                    controlId="description"
                  >
                  {/* <div className="tags-label master-grey">
                    <Form.Label>Description </Form.Label>
                  </div> */}
                  <Form.Control
                    as="textarea"
                    name="title"
                    style={{border:"1px solid #ced4da"}}
                    value={form.description}
                    placeholder="Description*"
                    maxLength={250}
                    onChange={handleChanges}
                  />
                {/* </Form.Group> */}
                  {/* <MentionsInput
                      value={form.description}
                      onChange={handleChanges}
                      markup="#{{__type__||__id__||__display__}}"
                      placeholder="Description upto 250 words. Use hashtags for better reach."
                      className="mentions"
                      // onKeyUp={(e) => handleChange(e)}
                    >
                      <Mention
                        type="user"
                        trigger="#"
                        // data={hashList}
                        className="mentions__mention"
                      />
                    </MentionsInput> */}
                  </Form.Group>
        </Col>
      </Row>
      <Row>
              <Col md="12" lg="12" sm="12" xs="12">
                <Form.Group as={Col} className="formEntry" md="12">
                  <div className="tags-label master-grey">
                    <Form.Label>Category </Form.Label>
                  </div>
                  <Select
                    value={form.category}
                    options={CONSTANTS.CATEGORIES}
                    onChange={(e) => handleCategoryChange(e)}
                    placeholder=""
                  />
                </Form.Group>
              </Col>
              </Row>
              <Row>
              <Col xs="9"></Col>
              <Col xs="2" className="button-bar done-btn d-flex">
                {<Button className="submit-btn btn-ternary mr-3" onClick={props.onHide}>
                  Cancel
                </Button>}
                {<Button className="submit-btn btn-primary" onClick={updateFunction}>
                  Update
                </Button>}
              </Col>
              </Row>
      </Modal.Body>
    </Modal>
  );
};
export default DetailsModal;
