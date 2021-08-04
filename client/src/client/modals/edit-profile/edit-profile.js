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

  import './edit-profile.scss';
const EditProfile = ({ ...props }) => {

    const [editProfile, setEditProfile] = useState({
        userName: props.userDetails.userName || '',
        firstName: props.userDetails.firstName ||  '',
        lastName: props.userDetails.lastName || '',
        email: props.userDetails.email || '',
        facebookUrl: props.userDetails.facebookUrl ||'',
        linkedInUrl: props.userDetails.linkedInUrl ||"",
        instaUrl: props.userDetails.linkedInUrl ||"",
        bio: props.userDetails.bio ||'',
        imageUrl: props.userDetails.imageUrl ||'',
    });

    useEffect(() => {
        const profileData = {
            userName: props.userDetails.userName || '',
            firstName: props.userDetails.firstName ||  '',
            lastName: props.userDetails.LastName || '',
            email: props.userDetails.email || '',
            facebookUrl: props.userDetails.facebookUrl ||'',
            linkedInUrl: props.userDetails.linkedInUrl ||"",
            instaUrl: props.userDetails.linkedInUrl ||"",
            bio: props.userDetails.bio ||'',
            imageUrl: props.userDetails.imageUrl ||'',
        }

        setEditProfile({...editProfile, profileData})
    },[])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditProfile({...editProfile, [name]: value});
    }

    const editProfileHandler = () => {
        console.log('editProfile = ', editProfile)
    }
    
    return (
        <Modal
          show={true}
          onHide={props.onHide}
          size="md"
          className="edit-profile-modal"
          dialogClassName="edit-profile-modal-dialog"
          centered
        >
          <Modal.Body className="edit-profile-modal-body">
            <div className="modal-header-wrapper">
            <h4>Edit Profile </h4>
            <hr></hr>
              <div className="image-placeholder d-flex align-items-center flex-column mb-3">
                <img src={editProfile.imageUrl} height={100} width={100} style={{borderRadius:"100px"}}></img>
                <span>{editProfile.userName}</span>
              </div>
            </div>
            <div className="wrapper">
           

                 <Row className="name-row mb-4">
                <Col md="6" xs= "12" className="">
                  <div className="name-label second-grey">
                    <Form.Label>
                     First Name
                    </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={editProfile.firstName}
                    onChange={(e) => handleChange(e)}
                    
                  />
                  </Col>
                  <Col md="6" xs= "12" className="">
                  <div className="name-label second-grey">
                    <Form.Label>
                     Last Name
                    </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={editProfile.lastName}
                    onChange={(e) => handleChange(e)}
                    
                  />
                  </Col>
                </Row>
                
                <Row className="email-row mb-4">
                <Col md="12" className="">
                  <div className="email-label second-grey">
                    <Form.Label>
                     Email
                    </Form.Label>
                  </div>
                  <Form.Control
                    disabled
                    type="text"
                    name="email"
                    value={editProfile.email}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>

                <Row className="facebook-url-row mb-4">
                <Col md="12" className="">
                  <div className="facebook-label second-grey">
                    <Form.Label>
                    Facebook URL
                    </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="facebookUrl"
                    value={editProfile.facebookUrl}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>

                <Row className="facebook-url-row mb-4">
                <Col md="12" className="">
                  <div className="facebook-label second-grey">
                    <Form.Label>
                    Instagram URL
                    </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="instaUrl"
                    value={editProfile.instaUrl}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>

                <Row className="linkedin-url-row mb-4">
                <Col md="12" className="">
                  <div className="linkedin-label second-grey">
                    <Form.Label>
                     LinkedIn URL
                    </Form.Label>
                  </div>
                  <Form.Control
                    type="text"
                    name="linkedInUrl"
                    value={editProfile.linkedInUrl}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>


                <Row className="bio-row mb-4">
                <Col md="12" className="">
                  <div className="bio-label second-grey">
                    <Form.Label>
                     Bio
                    </Form.Label>
                  </div>
                  <Form.Control
                    as="textarea"
                    rows={7}
                    name="bio"
                    style={{ resize: "none" }}
                    value={editProfile.bio}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>

                <Row className="button-section  d-flex mb-4">
              <Col xs="12" className="button-bar">
                <Button className="cancel-btn mr-2" onClick={props.onHide}>Cancel</Button>
                <Button
                  className="submit-btn"
                  onClick={() => editProfileHandler()}
                >
                  Submit
                </Button>
              </Col>
            </Row>
            </div>
          </Modal.Body>
        </Modal>
      );
}

export default EditProfile;