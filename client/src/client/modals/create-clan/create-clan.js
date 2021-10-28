import _ from "lodash";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
  Button,
  Col,
  Row,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import Select from "react-select";
import CONSTANTS from "../../commons/Constants";
import ClanInterface from "../../interface/ClanInterface";
import UserInterface from "../../interface/UserInterface";
import Dropzone, { useDropzone } from "react-dropzone";
import imagePlaceholder from "../../../assets/images/image-placeholder.png";
import "./create-clan.scss";
import SignatureInterface from "../../interface/SignatureInterface";
import StorageInterface from "../../interface/StorageInterface";
import NotificationInterface from "../../interface/NotificationInterface";

const CreateClan = ({ ...props }) => {
  const [createClanState, setCreateClanState] = useState({
    name: "",
    leader: props.userDetails._id,
    description: "",
    thumbnail: undefined,
    members: [],
    selectedBillet: undefined,
  });
  const [userList, setUserList] = useState([]);
  const [clanMemberList, setClanMemberList] = useState([null]);

  useEffect(() => {
    let users = UserInterface.getUsers().then((succes) => {
      setUserList(succes.data.data);
    });
    let payLoad = {};
    fetchSignatures();
  }, []);

  const fetchSignatures = () => {
    SignatureInterface.getSignatures().then((signatures) => {
      const response = _.get(signatures, "data.data");
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCreateClanState({ ...createClanState, [name]: value });
  };

  const createClanHandler = () => {
    console.log("create clan state = ", createClanState);
    let membersWithoutLabel = _.map(createClanState.members, (member) => {
      return {
        memberId: member.id,
        status: CONSTANTS.ACTION_STATUS.PENDING
      };
    });
    const payload = {
      ...createClanState,
      members: membersWithoutLabel,
    };
    StorageInterface.getImagePath(payload)
      .then((success) => {
        payload.thumbnail = _.get(success, "data.path");
        _.omit(payload.selectedBillet,'label')
        ClanInterface.createClan(payload)
          .then((success) => {
            console.log("clan created");
            let invitees = _.map(createClanState.members,"userName")
            _.forEach(invitees, (invitee) => {
              NotificationInterface.postNotification(createClanState.leader, invitee, CONSTANTS.ACTIONS.CREATE_CLAN, CONSTANTS.ACTION_STATUS.PENDING, "Sent you a clan invite?",
              JSON.stringify({
                clanID: _.get(success,'data.data,_id')
              }))
            })
            props.onHide();
          })
          .catch((error) => {
            console.log("clan could not be created", error);
          });
      })
      .catch((error) => {
        return {
          PDFFile: "error",
          thumbnail: "error",
        };
      });
  };

  const handleMembersChange = (members, index) => {
    const createClanStateCopy = _.clone(createClanState);
    createClanStateCopy.members[index] = members;
    setCreateClanState({
      ...createClanState,
      ...createClanStateCopy,
    });
  };

  const handleBilletChange = (billet) => {
    setCreateClanState({
      ...createClanState,
      selectedBillet: billet,
    });
  };

  const onImageDrop = (acceptedFiles) => {
    setCreateClanState({
      ...createClanState,
      thumbnail: Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      }),
    });
  };

  const addMemberHandler = () => {
    const clanMemberListCopy = _.clone(clanMemberList);
    clanMemberListCopy.push([]);

    setClanMemberList([...clanMemberListCopy]);
    const createClanStateCopy = _.clone(createClanState);
    createClanStateCopy.members.push(undefined);
    setCreateClanState({
      ...createClanState,
      ...createClanStateCopy,
    });
  };

  const visitClanMemberProfile = (index) => {
    const createClanStateCopy = _.clone(createClanState);
    try {
      if (createClanStateCopy.members[index].userName) {
        window.open(
          window.location.origin + `/profile/${createClanStateCopy.members[index].userName}`
        );
      }
    } catch (err) {}
  };

  const removeClanMember = (index) => {
    const clanMemberListCopy = _.clone(clanMemberList);
    clanMemberListCopy.splice(index, 1);
    const createClanStateCopy = _.clone(createClanState);
    createClanStateCopy.members.splice(index, 1);
    setCreateClanState({ ...createClanState, createClanStateCopy });
    setClanMemberList([...clanMemberListCopy]);
  };

  const clearImage = () => {
    setCreateClanState({
      ...createClanState,
      thumbnail: undefined,
    });
  };

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="md"
      className="create-clan-modal"
      dialogClassName="create-clan-modal-dialog"
      centered
    >
      <Modal.Body className="create-clan-modal-body">
        <div className="modal-header-wrapper">
          <h4>Create Clan </h4>
          <hr></hr>
        </div>
        <div className="wrapper">
          <Row>
            <Col md="6">
              <Row className="clan-name-row mb-4">
                <Col md="12" className="">
                  <div className="clan-name-label second-grey">
                    <Form.Label>Clan Name</Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="name"
                    value={createClanState.name}
                    onChange={(e) => handleChange(e)}
                  />
                </Col>
              </Row>

              {/* <Row className="clan-leader-row mb-4">
                <Col md="12" className="">
                  <div className="clan-leader-label second-grey">
                    <Form.Label>Clan Leader</Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="leader"
                    disabled
                    value={props.userDetails.userName}
                    onChange={(e) => handleChange(e)}
                  />
                </Col>
              </Row> */}
            </Col>
            <Col md="6">
              <div className="clan-leader-label second-grey">
                {!_.isEmpty(createClanState.thumbnail) ? (
                  <div className="clan-image-wrapper">
                    <img
                      src={createClanState.thumbnail.preview}
                      alt="clan"
                    ></img>
                    <span
                      class="fa fa-undo"
                      onClick={() => {
                        clearImage();
                      }}
                    ></span>
                  </div>
                ) : (
                  <Dropzone
                    onDrop={onImageDrop}
                    acceptedFiles={".jpeg"}
                    className="dropzoneContainer"
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section className="container h-100 f-flex align-items-center justofy-items-center">
                        <div
                          {...getRootProps()}
                          className="emptyImage dropZone h-100 d-flex flex-column align-items-center"
                        >
                          <input {...getInputProps()} />
                          <img
                            src={imagePlaceholder}
                            width={100}
                            height={100}
                            className="placeholder-image"
                            alt=" placehoder"
                          />
                          <span className="drospanfile-text">
                            Drop your thumbnail here
                          </span>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                )}
              </div>
            </Col>
          </Row>

          <Row className="clan-description-row mb-4">
            <Col md="12" className="">
              <div className="clan-description-label second-grey">
                <Form.Label>Clan Description</Form.Label>
              </div>
              <Form.Control
                as="textarea"
                rows={7}
                name="description"
                style={{ resize: "none" }}
                value={createClanState.description}
                onChange={(e) => handleChange(e)}
              />
            </Col>
          </Row>

          {/* <Row className="billet-row mb-4">
            <Col md="12">
              <div className="billet-label second-grey">
                <Form.Label>My Billet </Form.Label>
              </div>
              {_.get(props, "billetList") && (
                <Select
                  value={createClanState.selectedBillet}
                  options={_.get(props, "billetList").map((item) => {
                    return {
                      value: item.title,
                      id: item.ideaID,
                      label: (
                        <div>
                          <img
                            src={item.thumbnail}
                            style={{ borderRadius: "30px" }}
                            className="mr-1"
                            height="30px"
                            width="30px"
                            alt="user"
                          />
                          {item.title}{" "}
                        </div>
                      ),
                    };
                  })}
                  onChange={handleBilletChange}
                  placeholder="My Billet"
                />
              )}
            </Col>
          </Row> */}

          <Row className="clan-members-row mb-4">
            <Col md="12">
              <div className="clan-members-label second-grey">
                <Form.Label>Clan Members </Form.Label>
              </div>
              {clanMemberList.map((member, index) => {
                return (
                  <div className="selected-clan-member-item">
                    <Select
                      value={createClanState.members[index]}
                      options={userList.map((item) => {
                        return {
                          id: item._id,
                          imageUrl: item.imageUrl,
                          userName: item.userName,
                          label: (
                            <div>
                              <img
                                src={item.imageUrl}
                                style={{ borderRadius: "30px" }}
                                className="mr-1"
                                height="30px"
                                width="30px"
                                alt="user"
                              />
                              {item.userName}{" "}
                            </div>
                          ),
                        };
                      })}
                      onChange={(e) => handleMembersChange(e, index)}
                      placeholder="Select Member"
                    />
                    <div className="action color-primary readable-text">
                      <p onClick={(e) => visitClanMemberProfile(index)}>
                        Visit Profile
                      </p>
                      <i
                        className="fa fa-times master-grey"
                        onClick={(e) => removeClanMember(index)}
                      ></i>
                    </div>
                  </div>
                );
              })}
              <div className="add-member-btn">
                <div
                  className="add-btn-wrapper second-grey"
                  onClick={() => addMemberHandler()}
                >
                  <i className="fa fa-plus-circle"></i>
                  <span>Add Member</span>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="button-section  d-flex mb-4">
            <Col xs="12" className="button-bar justify-content-end d-flex">
              <Button className="btn-ternary mr-2" onClick={props.onHide}>
                Cancel
              </Button>
              <Button
                className="submit-btn"
                onClick={() => createClanHandler()}
              >
                Create
              </Button>
            </Col>
          </Row>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateClan;
