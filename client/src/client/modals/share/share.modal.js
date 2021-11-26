import React from "react";
import { Modal } from "react-bootstrap";
import * as reactShare from "react-share";
import "./share.modal.scss";
import { showToaster } from "../../commons/common.utils";

const ShareModal = (props) => {
  const copyClipBoard = () => {
    navigator.clipboard.writeText(getURL());
    showToaster("Copied to clipboard!", { type: "dark" });
  };

  const getURL = () => {
    switch (props.type) {
      case "idea":
        return window.location.href + "/signature/" + props.PDFHash;
        break;
      case "profile":
        return window.location.href + "/profile/" + props.userName;
        break;
      case "invite":
        return window.location.origin + "?inviteCode=" + props.referral;
        break;
    }
  };

  const getQuote = () => {
    switch (props.type) {
      case "idea":
        return "Hey! Checkout this Idea on IdeaTribe.io!";
        break;
      case "profile":
        return "Hey! Checkout this profile on IdeaTribe.io!";
        break;
      case "invite":
        return "Hey! I am inviting you to IdeaTribe.io!";
        break;
    }
  };

  return (
    <Modal
      show={true}
      onHide={props.onHide}
      size="md"
      className="share-modal"
      dialogClassName="share-modal-dialog"
      centered
      close
    >
      <Modal.Body className="share-modal-body">
        <div className="modal-header-wrapper">
          <div className="image-placeholder mt-1">
            <img
              src={props.thumbnail}
              alt="share idea"
              style={{ borderRadius: "100%" }}
            />
          </div>
        </div>
        <div className="wrapper">
          <div className="share-txt">
            <h3>Share this with your community</h3>
          </div>
          <div className="sharables d-flex">
            <reactShare.FacebookShareButton
              url={window.location.href}
              quote={getQuote()}
            >
              <div className="social-icon-wrapper fb">
                <i class="fa fa-facebook" aria-hidden="true"></i>
              </div>
              {/* <reactShare.FacebookIcon size={32} round /> */}
            </reactShare.FacebookShareButton>
            <reactShare.TwitterShareButton
              url={window.location.href}
              title={getQuote()}
            >
              <div className="social-icon-wrapper twitter">
                <i class="fa fa-twitter" aria-hidden="true"></i>
              </div>
              {/* <reactShare.TwitterIcon size={32} round /> */}
            </reactShare.TwitterShareButton>
            <reactShare.WhatsappShareButton
              url={window.location.href}
              title={getQuote()}
              separator=" "
            >
              <div className="social-icon-wrapper whatsapp">
                <i class="fa fa-whatsapp" aria-hidden="true"></i>
              </div>
              {/* <reactShare.WhatsappIcon size={32} round /> */}
            </reactShare.WhatsappShareButton>
            <reactShare.LinkedinShareButton url={getURL()}>
              <div className="social-icon-wrapper linkedin">
                <i class="fa fa-linkedin" aria-hidden="true"></i>
              </div>
              {/* <reactShare.LinkedinIcon size={32} round /> */}
            </reactShare.LinkedinShareButton>
          </div>
          <div className="share-copy-action">
            <p className="text-center"></p>
            <div className="url-wrapper">
              <span className="url">{getURL()}</span>
              <span
                className="copy-txt"
                onClick={() => {
                  copyClipBoard();
                }}
              >
                copy
              </span>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
