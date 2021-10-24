import React, { useEffect, useState } from "react";
import { Button, Card, CardDeck, Image } from "react-bootstrap";
import { Row, Col, Container } from "react-bootstrap";
import moment from "moment";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import "./collection-card.scss";
import CONSTANTS from "../../commons/Constants";
import { showToaster } from "../../commons/common.utils";
import { getPurposeIcon } from "../../commons/common.utils";
import Web3Utils from "web3-utils";
const CollectionCard = (props) => {
  let history = useHistory();
  function openCardView() {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }

  const goToUserProfile = (id) => {
    history.push({
      pathname: "/profile/" + id,
      state: {
        userName: id,
      },
    });
  };

   
 const hoverFunction = () => {
  document.querySelectorAll('.card').forEach((elem) => {
  
    const head = elem.querySelector('.card__head')
    const image = elem.querySelector('.card__image')
    const author = elem.querySelector('.card__author')
    const body = elem.querySelector('.card__body')
    const foot = elem.querySelector('.card__foot')
  
    elem.onmouseenter = () => {
  
      elem.classList.add('hover')
  
      const imageScale = 1 + factor(head, body, 'height')
      image.style.transform = `scale(${ imageScale })`
  
      const bodyDistance = height(foot) * -1
      body.style.transform = `translateY(${ bodyDistance - 30 }px)`
  
      const authorDistance = distance(head, author, 'height')
      // author.style.transform = `translateY(${ authorDistance }px)`
  
    }
  
    elem.onmouseleave = () => {
  
      elem.classList.remove('hover')
  
      image.style.transform = `none`
      body.style.transform = `none`
      author.style.transform = `none`
  
    }
  
  })
 }
  useEffect(() => {
    setSignature(props.collection);
    hoverFunction();
  }, [props]);

  const [signature, setSignature] = useState(props.collection);

  const getClassNames = () => {
    return "bottom-content justify-content-between align-items-center " +
      _.get(JSON.parse(signature.category), "value")
    ;
  };


  const height = (elem) => {

    return elem.getBoundingClientRect().height
  
  }
  
  const distance = (elemA, elemB, prop) => {
  
    const sizeA = elemA.getBoundingClientRect()[prop]
    const sizeB = elemB.getBoundingClientRect()[prop]
  
    return sizeB - sizeA
  
  }
  
  const factor = (elemA, elemB, prop) => {
  
    const sizeA = elemA.getBoundingClientRect()[prop]
    const sizeB = elemB.getBoundingClientRect()[prop]
  
    return sizeB / sizeA
  
  }

  const getEngageText = (signature) => {
    switch (signature.purpose.purposeType) {
      case CONSTANTS.PURPOSES.SELL:
        return "Buy" + " (" + Web3Utils.fromWei(signature.price, "ether") + " MATIC)";
        break;

      case CONSTANTS.PURPOSES.LICENSE:
        return "Buy"+ " (" + Web3Utils.fromWei(signature.price, "ether") + " MATIC)";
        break;

      case CONSTANTS.PURPOSES.AUCTION:
        return "Bid";
        break;

      case CONSTANTS.PURPOSES.COLLAB:
        return "Collaborate";
        break;

      case CONSTANTS.PURPOSES.KEEP:
        return "View";
        break;

      default:
        return null;
    }
  };

  return (
    <Col
    key={signature._id}
    className="main-container col-lg-2-4 mb-5"
    md="4"
    lg="3"
    sm="6"
    xs="12"
  >
    <div className="card-container">
      <div className="card-float-header">
        <div className="user-logo">
          <Image src={_.get(signature,'owner.imageUrl')} color="F3F3F3" onClick={() => {
            goToUserProfile(_.get(signature,'owner.userName'));
          }}/>
          <div className="user-popup-outer">
            <div className="user-popup">
              <div className="user-logo">
                <Image src={_.get(signature,'owner.imageUrl')} onClick={() => {
            goToUserProfile(_.get(signature,'owner.userName'));
            }}/>
              </div>
              <div>
                <Button disabled variant="pill">
                  {JSON.parse(signature.category).label}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="user-name third-header ml-2"
          onClick={() => {
            goToUserProfile(_.get(signature,'owner.userName'));
          }}
        >
          {_.get(signature, 'owner.userName') || signature.userName}
        </div>
      </div>
      <div
        className="image-container"
        onClick={() => {
          openCardView();
        }}
      >
          <a href="#" className={`card ${(_.get(JSON.parse(signature.category), 'value'))}`}>
            <div className="card__head" >
              <div className="card__image" style={{ backgroundImage: `url(${signature.thumbnail}` }}></div>
              <div className="author card__title">
                  <div className="author__content">
                    <p className="author__header">{signature.title}</p>
                  </div>
              </div>
            </div>
            <div className="card__body">
              <div className={getClassNames()}>
                <div className="card__author">
                <div className="tag-n-location">
                  <div className=" timestamp second-header">
                    {moment(signature.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                  </div>
                </div>
                  <div className="like-bar align-items-sm-baseline third-header row justify-content-between color-primary">
                    <div>
                      <i className="fa fa-globe mr-1"></i>
                      {signature.location || "Global"}
                    </div>
                    <div>
                      {/* <i className="fa fa-commenting-o "></i>
                      <span className=""> 90 </span>
                      <i className="fa fa-heart-o "></i>
                      <span className=""> 54 </span> */}
                    </div>
                  </div>
                  
                </div>
                <div className="author third-header">
                  <div className="author__content">
                    <p className="author__subheader  second-header mt-3">{signature.description}</p>
                  </div>
                </div>
               
              </div>
            </div>
            <div className="card__foot">
              <span className="card__link"> {getEngageText(signature)} </span>

            </div>
            <div className="card__border"></div>
          </a>
      </div>
      
      {/* <div className="footer-area">testing bottom footer area</div> */}
    </div>
  </Col>
  );
};
export default CollectionCard;
