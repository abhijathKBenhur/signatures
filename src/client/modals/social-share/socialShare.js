import React, { Component, useState } from "react";
import { Modal} from "react-bootstrap";
import "./socialShare.scss";
import * as reactShare from "react-share";
import {  toast } from 'react-toastify';

import exampleImage from '../../../assets/logo/Fingerprints.png'
import {  Copy } from 'react-feather';
class SocialShare extends Component {
  constructor(props) {
    super(props);
    this.copyClipBoard = this.copyClipBoard.bind(this);
    this.state = {
      shareUrl : window.location.href + "?referrer="+ localStorage.getItem("userInfo"),
      title : 'Hey! Checkout this token'
    }
  }

  copyClipBoard(){
    let shareURL = window.location.href + "?referrer="+ localStorage.getItem("userInfo")
    navigator.clipboard.writeText(shareURL)
    
    toast.dark('Copied to clipboard!', {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  render() {
    return (
      <Modal
        {...this.props}
        dialogClassName="shareModal"
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title >
            Share 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="holder">
            <reactShare.FacebookShareButton
              url={this.state.shareUrl}
              quote={this.state.title}
            >
              <reactShare.FacebookIcon size={32} round />
            </reactShare.FacebookShareButton>

            <div>
            </div>
          </div>

          <div className="holder">
            <reactShare.FacebookMessengerShareButton
              url={this.state.shareUrl}
              appId="521270401588372"
            >
              <reactShare.FacebookMessengerIcon size={32} round />
            </reactShare.FacebookMessengerShareButton>
          </div>

          <div className="holder">
            <reactShare.TwitterShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.TwitterIcon size={32} round />
            </reactShare.TwitterShareButton>

          </div>

          <div className="holder">
            <reactShare.TelegramShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.TelegramIcon size={32} round />
            </reactShare.TelegramShareButton>

          </div>

          <div className="holder">
            <reactShare.WhatsappShareButton
              url={this.state.shareUrl}
              title={this.state.title}
              separator=":: "
            >
              <reactShare.WhatsappIcon size={32} round />
            </reactShare.WhatsappShareButton>

          </div>

          <div className="holder">
            <reactShare.LinkedinShareButton url={this.state.shareUrl}>
              <reactShare.LinkedinIcon size={32} round />
            </reactShare.LinkedinShareButton>
          </div>

          <div className="holder customcopy" onClick={this.copyClipBoard}>
            <Copy size={20} color="grey" ></Copy>
          </div>

          {/* <div className="holder">
            <reactShare.PinterestShareButton
              url={String(window.location)}
              media={`${String(window.location)}/${exampleImage}`}
            >
              <reactShare.PinterestIcon size={32} round />
            </reactShare.PinterestShareButton>
          </div>
          <div className="holder">
            <reactShare.VKShareButton
              url={this.state.shareUrl}
              image={`${String(window.location)}/${exampleImage}`}
            >
              <reactShare.VKIcon size={32} round />
            </reactShare.VKShareButton>

            <div>
            </div>
          </div>

          <div className="holder">
            <reactShare.OKShareButton
              url={this.state.shareUrl}
              image={`${String(window.location)}/${exampleImage}`}
            >
              <reactShare.OKIcon size={32} round />
            </reactShare.OKShareButton>

            <div>
            </div>
          </div>

          <div className="holder">
            <reactShare.RedditShareButton
              url={this.state.shareUrl}
              title={this.state.title}
              windowWidth={660}
              windowHeight={460}
            >
              <reactShare.RedditIcon size={32} round />
            </reactShare.RedditShareButton>

            <div>
            </div>
          </div>

          <div className="holder">
            <reactShare.TumblrShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.TumblrIcon size={32} round />
            </reactShare.TumblrShareButton>

            <div>
            </div>
          </div>

          <div className="holder">
            <reactShare.LivejournalShareButton
              url={this.state.shareUrl}
              title={this.state.title}
              description={this.state.shareUrl}
            >
              <reactShare.LivejournalIcon size={32} round />
            </reactShare.LivejournalShareButton>
          </div>

          <div className="holder">
            <reactShare.MailruShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.MailruIcon size={32} round />
            </reactShare.MailruShareButton>
          </div>

          <div className="holder">
            <reactShare.EmailShareButton
              url={this.state.shareUrl}
              subject={this.state.title}
              body="body"
            >
              <reactShare.EmailIcon size={32} round />
            </reactShare.EmailShareButton>
          </div>
          <div className="holder">
            <reactShare.ViberShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.ViberIcon size={32} round />
            </reactShare.ViberShareButton>
          </div>

          <div className="holder">
            <reactShare.WorkplaceShareButton
              url={this.state.shareUrl}
              quote={this.state.title}
            >
              <reactShare.WorkplaceIcon size={32} round />
            </reactShare.WorkplaceShareButton>
          </div>

          <div className="holder">
            <reactShare.LineShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.LineIcon size={32} round />
            </reactShare.LineShareButton>
          </div>

          <div className="holder">
            <reactShare.WeiboShareButton
              url={this.state.shareUrl}
              title={this.state.title}
              image={`${String(window.location)}/${exampleImage}`}
            >
              <reactShare.WeiboIcon size={32} round />
            </reactShare.WeiboShareButton>
          </div>

          <div className="holder">
            <reactShare.PocketShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.PocketIcon size={32} round />
            </reactShare.PocketShareButton>
          </div>

          <div className="holder">
            <reactShare.InstapaperShareButton
              url={this.state.shareUrl}
              title={this.state.title}
            >
              <reactShare.InstapaperIcon size={32} round />
            </reactShare.InstapaperShareButton>
          </div>

          <div className="holder">
            <reactShare.HatenaShareButton
              url={this.state.shareUrl}
              title={this.state.title}
              windowWidth={660}
              windowHeight={460}
            >
              <reactShare.HatenaIcon size={32} round />
            </reactShare.HatenaShareButton>
          </div> */}
          </Modal.Body>
      </Modal>
    );
  }
}

export default SocialShare;
