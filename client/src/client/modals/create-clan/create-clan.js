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
const CreateClan = ({ ...props }) => {
  const [createClanState, setCreateClanState] = useState({
    name: "",
    leader: props.userDetails.userName,
    description: "",
    thumbnail: undefined,
    members: [],
   selectedBillet: undefined
  });
  const [userList, setUserList] = useState([]);
  const [clanMemberList, setClanMemberList] = useState([]);


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
    
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCreateClanState({ ...createClanState, [name]: value });
  };

  const createClanHandler = () => {
    let membersWithoutLabel = _.map(createClanState.members, (member) => {
      return {
        imageUrl: member.imageUrl,
        userName: member.value,
      };
    });
    let payload = {
      ...createClanState,
      members: membersWithoutLabel,
    };
    ClanInterface.createClan(payload)
      .then((success) => {
        console.log("clan created");
        props.onHide();
      })
      .catch((error) => {
        console.log("clan could not be created");
      });
  };

  const handleMembersChange = (members, index) => {
    const createClanStateCopy = _.clone(createClanState);
    createClanStateCopy.members[index]= (members);
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
    
    setClanMemberList([...clanMemberListCopy])
    const createClanStateCopy = _.clone(createClanState);
    createClanStateCopy.members.push(undefined);
    setCreateClanState({
      ...createClanState,
     ...createClanStateCopy,
    });
  }

  
  const visitClanMemberProfile = (index) => {
    const createClanStateCopy = _.clone(createClanState);
    try {
      if(createClanStateCopy.members[index].userName) {
        window.open(window.location + `/${createClanStateCopy.members[index].userName}`)
      }
    } catch(err) {

    }
   
  }

  const removeClanMember = (index) => {
    const clanMemberListCopy = _.clone(clanMemberList);
    clanMemberListCopy.splice(index, 1);
    const createClanStateCopy = _.clone(createClanState);
    createClanStateCopy.members.splice(index, 1);
    setCreateClanState({...createClanState, createClanStateCopy})
    setClanMemberList([...clanMemberListCopy])

  }

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

              <Row className="clan-leader-row mb-4">
                <Col md="12" className="">
                  <div className="clan-leader-label second-grey">
                    <Form.Label>Clan Leader</Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="leader"
                    disabled
                    value={createClanState.leader}
                    onChange={(e) => handleChange(e)}
                  />
                </Col>
              </Row>
            </Col>
            <Col md="6">
              <div className="clan-leader-label second-grey">
                {
                  !_.isEmpty(createClanState.thumbnail) ? 
                    <div>
                      <img src={createClanState.thumbnail} ></img>
                      <span class="fa fa-undo"></span>

                    </div>
                  :
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
                          src={imagePlaceholder} width={100} height={100}
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
                }
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

          <Row className="billet-row mb-4">
            <Col md="12">
              <div className="billet-label second-grey">
                <Form.Label>My Billet  </Form.Label>
              </div>
             { _.get(props, 'billetList') &&  <Select
                value={createClanState.selectedBillet}
                options={_.get(props, 'billetList').map((item) => {
                  return {
                    value: item.title,
                    id: item.ideaID,
                    label: (
                      <div>
                        {item.title}{" "}
                      </div>
                    ),
                  };
                })}
                onChange={handleBilletChange}
                placeholder="My Billet"
              />}
            </Col>
          </Row>

          <Row className="clan-members-row mb-4">
            <Col md="12">
              <div className="clan-members-label second-grey">
                <Form.Label>Clan Members </Form.Label>
              </div>
              {
                clanMemberList.map((member, index) => {
                  return(
                    <div className="selected-clan-member-item">
                         <Select
                    value={createClanState.members[index]}
                    options={userList.map((item) => {
                      return {
                        value: item.userName,
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
                  <div className="action">
                  <p onClick={(e) =>  visitClanMemberProfile(index)}>Visit Profile 
                  </p>
                  <i className="fa fa-times" onClick={(e) =>  removeClanMember(index)} ></i>

                  </div>
                 
                    </div>
                   
                  )
                })
              }
              <Button className="cancel-btn mr-2" onClick={() => addMemberHandler()}>
                Add Member
              </Button>
            </Col>
          </Row>

          <Row className="button-section  d-flex mb-4">
            <Col xs="12" className="button-bar">
              <Button className="cancel-btn mr-2" onClick={props.onHide}>
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
