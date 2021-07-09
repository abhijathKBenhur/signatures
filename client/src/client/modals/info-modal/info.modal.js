import React from 'react';
import {Modal} from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import CONSTANTS from "../../commons/Constants";
import Web3Utils from "web3-utils";
import './info.modal.scss';
const InfoModal = (props) => {
const getTagsElement = () => {
    try {
        if(!_.isEmpty(_.get(props, 'category'))) {
            const category = JSON.parse(_.get(props, 'category'))
           return  !_.isEmpty(category) && category.map(tag => <span className="tag-item" key={tag.label}>{tag.label}</span>)
        }
    } catch(err) {
        return null;
    }
   

}

const getIdeaStatus = () => {
    switch (props.purpose) {
      case CONSTANTS.PURPOSES.SELL:
        return "On Sale";
        
      case CONSTANTS.PURPOSES.AUCTION:
        return "On Auction";
        
      case CONSTANTS.PURPOSES.COLLAB:
        return "Inviting Collaborators";
        
      case CONSTANTS.PURPOSES.KEEP:
        return "Personal Record";
        default: return null;
    }
  }
    return(
        <Modal
        show={true}
        onHide={props.onHide}
        size="md"
       className="info-modal"
       dialogClassName="info-modal-dialog"
       centered
      >
        
        <Modal.Body className="info-modal-body">
          <div className="modal-header-wrapper">
             <h4>Shot Details</h4>
             <i className="fa fa-close" onClick={props.onHide}></i>
          </div>
          <div className="created-at">
              <p> 
                  <span>Posted
                      </span>
                      <span>
                      {moment(_.get(props, 'createdAt')).format('MMM DD, YYYY')}
                          </span></p>
          </div>
            <div className="wrapper">
                <div className="purpose-section">
                    <span>{getIdeaStatus()}</span>
                <span>
                              {" "}
                              {props.price &&
                                Web3Utils.fromWei(props.price)}{" "}
                              BNB
                            </span>
                </div>
                <p>Tags</p>
                <div className="tags-wrapper">
                    {getTagsElement()}
                </div>
            </div>
        </Modal.Body>
        
      </Modal>
    )

}

export default InfoModal;