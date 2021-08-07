import React, { useState } from 'react';
import { Modal, Form } from "react-bootstrap"
import _ from 'lodash';
import NotificationInterface from '../../interface/NotificationInterface';
import CONSTANTS from '../../commons/Constants';
import './view-notification.scss';

const ViewNotification = ({ ...props}) => {
    const [viewNotificationState, setViewNotificationState] = useState({
        showReply: false,
        replyTxt: ''
    })

    const showReplyBlock = () => _.get(props, 'notification.action') === 'PERSONAL_MESSAGE' ;

    const replyMessage = () => {
        setViewNotificationState({...viewNotificationState, showReply: true})
    }
    const handleChange = (e) => {
        const {value} = e.target;
        setViewNotificationState({...viewNotificationState, replyTxt: value })

    }

    const sendMessage = () => {
        console.log('viewNotificationState.replyTxt ===',viewNotificationState.replyTxt);

        NotificationInterface.postNotification(_.get(props, 'notification.to'), _.get(props, 'notification.from'), _.get(props, 'notification.action'), CONSTANTS.ACTION_STATUS.PENDING, viewNotificationState.replyTxt)
        .then((success) => {
          props.onHide();
        })
        .catch((error) => {
          console.log("message could not be created");
        });
    }
    return(
        <Modal
      show={true}
      onHide={props.onHide}
      size="md"
      className="view-notification-modal"
      dialogClassName="view-notification-modal-dialog"
      centered
    >
      <Modal.Body className="view-notification-modal-body">
        <div className="modal-header-wrapper">
          <h4>View Message </h4>
          <hr></hr>
        </div>
        <div className="wrapper">
            <div className="notification-container">
                <p>From: {_.get(props, 'notification.from')} </p>
                {_.get(props, 'notification.message')}
            </div>
            {showReplyBlock() && 
              <div className="reply-block">
                  {
                      _.get(viewNotificationState, 'showReply') ?  
                      <>
                      <Form.Control
                      type="text"
                      name="replyTxt"
                      value={viewNotificationState.replyTxt}
                      onChange={(e) => handleChange(e)}
                      
                    /> 
                     <i class="fa fa-paper-plane" aria-hidden="true" onClick={() => sendMessage()}></i>
                    </>
                    :
                             <i class="fa fa-reply" aria-hidden="true" onClick={() => replyMessage()}></i>


                  }
              </div>
            }
          
        </div>
        </Modal.Body>
        </Modal>
    )

}

export default ViewNotification;