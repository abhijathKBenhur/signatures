import React from 'react';
import {Modal} from 'react-bootstrap'
import * as reactShare from "react-share";
import './share.modal.scss';
import { showToaster } from "../../commons/common.utils";

const ShareModal = (props) => {
  const copyClipBoard = ()  => {
    navigator.clipboard.writeText(getURL());
    showToaster("Copied to clipboard!", { type: "dark" });
  }

  const getURL  = () => window.location.href + "/signature/" + props.PDFHash;
    return(
        <Modal
        show={true}
        onHide={props.onHide}
        size="md"
       className="share-modal"
       dialogClassName="share-modal-dialog"
       centered
      >
        
        <Modal.Body className="share-modal-body">
          <div className="modal-header-wrapper">
            <div className="image-placeholder">
              <img src={props.thumbnail} alt="share idea"/>
            </div>
          </div>
            <div className="wrapper">
            <div className="share-txt">
                  <h3>
                  Share this with your social Community
                  </h3>
                </div>
            <div className="sharables d-flex">
                  <reactShare.FacebookShareButton
                    url={window.location.href}
                    quote={"Hey! Check out this idea."}
                  >
                    <reactShare.FacebookIcon size={32} round />
                  </reactShare.FacebookShareButton>
                  <reactShare.TwitterShareButton
                    url={window.location.href}
                    title={"Hey! Check out this idea."}
                  >
                    <reactShare.TwitterIcon size={32} round />
                  </reactShare.TwitterShareButton>
                  <reactShare.WhatsappShareButton
                    url={window.location.href}
                    title={"Hey! Check out this idea."}
                    separator=":: "
                  >
                    <reactShare.WhatsappIcon size={32} round />
                  </reactShare.WhatsappShareButton>
                  <reactShare.LinkedinShareButton url={window.location.href}>
                    <reactShare.LinkedinIcon size={32} round />
                  </reactShare.LinkedinShareButton>
                </div>
                <div className="share-copy-action">
                  <p>
                  or copy link
                  </p>
                  <div className="url-wrapper">
                    <span className="url">
                    {getURL()}
                    </span>
                    <span className="copy-txt"  onClick={() => {
                      copyClipBoard();
                    }}>
                      copy
                    </span>
                  </div>
                </div>
                </div>
        </Modal.Body>
        
      </Modal>
    )
}

export default ShareModal