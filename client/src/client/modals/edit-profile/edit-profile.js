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
import _ from 'lodash';
  import './edit-profile.scss';
import UserInterface from '../../interface/UserInterface';
const EditProfile = ({ ...props }) => {

    const [editProfile, setEditProfile] = useState({
        id: props.userDetails._id || '',
        userName: props.userDetails.userName || '',
        firstName: props.userDetails.firstName ||  '',
        lastName: props.userDetails.lastName || '',
        email: props.userDetails.email || '',
        facebookUrl: props.userDetails.facebookUrl ||'',
        linkedInUrl: props.userDetails.linkedInUrl ||"",
        instaUrl: props.userDetails.linkedInUrl ||"",
        twitterUrl: props.userDetails.linkedInUrl ||"",
        bio: props.userDetails.bio ||'',
        imageUrl: props.userDetails.imageUrl ||'',
    });

    const SocialLoginList = [
      {name: 'facebookUrl', label: 'Facebook URL'},
      {name: 'linkedInUrl', label: 'Linkedin URL'},
      {name: 'instaUrl', label: 'Instagram URL'},
      {name: 'twitterUrl', label: 'Twitter URL'},

    ]

    const [selectedSocialLogin, setSelectedSocialLogin] = useState([null]);

    useEffect(() => {
        const profileData = {
            userName: props.userDetails.userName || '',
            firstName: props.userDetails.firstName ||  '',
            lastName: props.userDetails.LastName || '',
            email: props.userDetails.email || '',
            facebookUrl: props.userDetails.facebookUrl ||'',
            linkedInUrl: props.userDetails.linkedInUrl ||"",
            instaUrl: props.userDetails.instaUrl ||"",
            twitterUrl: props.userDetails.twitterUrl ||"",
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
        UserInterface.updateUser(editProfile).then(response => {
        console.log('edit profile success  = ', response)
        }).catch(err => {
          console.log('error  = ', err)
        })
    }

    const addSocialHandler = () => {
      const selectedSocialLoginClone = _.clone(selectedSocialLogin);
      selectedSocialLoginClone.push([]);
      setSelectedSocialLogin([...selectedSocialLoginClone])
    }

    const handleSocialProfileChange = (e, index) => {
      const selectedSocialLoginClone = _.clone(selectedSocialLogin);
      selectedSocialLoginClone[index] = _.get(e, 'item')
      setSelectedSocialLogin(selectedSocialLoginClone)
    }
    const removeSocialProfile = (socialLogin, index) => {
      const selectedSocialLoginClone = _.clone(selectedSocialLogin);
      selectedSocialLoginClone.splice(index,1);
      const editProfileClone = _.clone(editProfile);
      switch(_.get(socialLogin, 'name')) {
        case 'facebookUrl':
          editProfileClone.facebookUrl = '';
        break;
        case 'instaUrl':
          editProfileClone.instaUrl = '';

          break;
          case 'linkedInUrl':
          editProfileClone.linkedInUrl = '';

            break;
            case 'twitterUrl':
          editProfileClone.twitterUrl = '';

              break;
        default:break;
      }
      setEditProfile(editProfileClone)
      setSelectedSocialLogin(selectedSocialLoginClone);
    }

    const getSocialMediaItem = (selectedSocialLogin, index) => {
      switch(_.get(selectedSocialLogin, 'name')) {
        case 'facebookUrl':
          return(
        <Row className="facebook-url-row ">
                <Col md="12" className="">
                  {/* <div className="facebook-label second-grey">
                    <Form.Label>
                    Facebook URL
                    </Form.Label>
                  </div> */}
                  <Form.Control
                    type="text"
                    name="facebookUrl"
                    value={editProfile.facebookUrl}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>
          )
          case 'instaUrl':
          return(
            <Row className="facebook-url-row ">
                <Col md="12" className="">
                  {/* <div className="facebook-label second-grey">
                    <Form.Label>
                    Instagram URL
                    </Form.Label>
                  </div> */}
                  <Form.Control
                    type="text"
                    name="instaUrl"
                    value={editProfile.instaUrl}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>
          )
          case 'linkedInUrl':
          return(
            <Row className="linkedin-url-row ">
                <Col md="12" className="">
                  {/* <div className="linkedin-label second-grey">
                    <Form.Label>
                     LinkedIn URL
                    </Form.Label>
                  </div> */}
                  <Form.Control
                    type="text"
                    name="linkedInUrl"
                    value={editProfile.linkedInUrl}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>
          )
          case 'twitterUrl':
          return(
            <Row className="linkedin-url-row ">
                <Col md="12" className="">
                  {/* <div className="linkedin-label second-grey">
                    <Form.Label>
                     Twitter URL
                    </Form.Label>
                  </div> */}
                  <Form.Control
                    type="text"
                    name="twitterUrl"
                    value={editProfile.twitterUrl}
                    onChange={(e) => handleChange(e)}
                  />
                  </Col>
                </Row>
          )
          default: return (

            <Row className="facebook-url-row ">
                <Col md="12" className="">
                  <Form.Control
                    type="text"
                    value={''}
                  />
                  </Col>
                </Row>
          );
      }
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

                {selectedSocialLogin.map((socialLogin, index) => {
                return (
                  <div className="selected-socialLogin-item">
                    <Select
                      value={socialLogin}
                      options={SocialLoginList.map((item) => {
                        return {
                          item: item,
                          label: (
                            <div>
                              {item.label}{" "}
                            </div>
                          ),
                        };
                      })}
                      onChange={(e) => handleSocialProfileChange(e, index)}
                      placeholder="Select Social Profile"
                    />
                    <div className="action color-secondary readable-text">
                      {getSocialMediaItem(socialLogin,index)}
                      {/* <p onClick={(e) => visitClanMemberProfile(index)}>
                        Visit Profile
                      </p> */}
                      <i
                        className="fa fa-times master-grey ml-2"
                        onClick={(e) => removeSocialProfile(socialLogin,index)}
                      ></i>
                    </div>
                  </div>
                );
              })}
              <div className="add-member-btn mt-4">
                <div
                  className="add-btn-wrapper second-grey"
                  onClick={() => addSocialHandler()}
                >
                  <i className="fa fa-plus-circle"></i>
                  <span>Add </span>
                </div>
              </div>
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