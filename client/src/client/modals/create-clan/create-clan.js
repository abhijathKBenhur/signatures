import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    OverlayTrigger,
    Tooltip,
    Button,
    Col,
    Row,
    InputGroup,
    Dropdown
  } from "react-bootstrap";
  import Select from "react-select";
import CONSTANTS from '../../commons/Constants';

  import './create-clan.scss';
const CreateClan = ({ ...props }) => {

    const [createClanState, setCreateClanState] = useState({
        clanName: '',
        clanLeader: '',
        clanDescription: '',
        clanMembers: []
    });

    useEffect(() => {
        
    },[])

    const handleChange = (event) => {
        const { name, value } = event.target;

        setCreateClanState({...createClanState, [name]: value});
    }

    const createClanHandler = () => {
        console.log('createClanState = ', createClanState)
    }
    
    
    const handleMembersChange = (members) => {
        setCreateClanState({
          ...createClanState,
          clanMembers: members,
        });
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
             
            </div>
            <div className="wrapper">
            <Row className="clan-name-row mb-4">
                <Col md="12" className="">
                  <div className="clan-name-label second-grey">
                    <Form.Label>
                    Clan Name
                    </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="clanName"
                    value={createClanState.clanName}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>

                <Row className="clan-leader-row mb-4">
                <Col md="12" className="">
                  <div className="clan-leader-label second-grey">
                    <Form.Label>
                    Clan Leader
                    </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="clanLeader"
                    value={createClanState.clanLeader}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>


                <Row className="clan-description-row mb-4">
                <Col md="12" className="">
                  <div className="clan-description-label second-grey">
                    <Form.Label>
                     Clan Description
                    </Form.Label>
                  </div>
                  <Form.Control
                     as="textarea"
                     rows={7}
                     name="clanDescription"
                     style={{ resize: "none" }}
                    value={createClanState.clanDescription}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>

                <Row className="clan-members-row mb-4">
                <Col md="12" >
                  <div className="clan-members-label second-grey">
                    <Form.Label>Clan Members </Form.Label>
                  </div>
                  <Select
                    value={createClanState.clanMembers}
                    closeMenuOnSelect={false}
                    isMulti
                    options={CONSTANTS.CATEGORIES}
                    onChange={handleMembersChange}
                    placeholder=""
                  />
              </Col>
                </Row>

                <Row className="button-section  d-flex mb-4">
              <Col xs="12" className="button-bar">
                <Button className="cancel-btn mr-2" onClick={props.onHide}>Cancel</Button>
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
}

export default CreateClan;