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
import { getInitialSubString } from "../../commons/common.utils";
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
  useEffect(() => {
    setSignature(props.collection);
  }, [props]);

  const [signature, setSignature] = useState(props.collection);

  const getClassNames = () => {
    return "bottom-content d-flex justify-content-between align-items-center " +
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
      body.style.transform = `translateY(${ bodyDistance }px)`
  
      const authorDistance = distance(head, author, 'height')
      author.style.transform = `translateY(${ authorDistance }px)`
  
    }
  
    elem.onmouseleave = () => {
  
      elem.classList.remove('hover')
  
      image.style.transform = `none`
      body.style.transform = `none`
      author.style.transform = `none`
  
    }
  
  })

  return (
    <Col
      key={signature._id}
      className="main-container col-lg-2-4"
      md="4"
      lg="3"
      sm="6"
      xs="12"
    >
     <a href="#" class="card">
	<div class="card__head">
		<div class="card__image"></div>
		<div class="card__author">
			<div class="author">
				<img src="https://s.gravatar.com/avatar/7ff9e93ff25e002bc49f4d69c0c3eac7?s=80" alt="Author of Tobias Reich" class="author__image"/>
				<div class="author__content">
					<p class="author__header">Tobias Reich</p>
					<p class="author__subheader">Web developer and designer</p>
				</div>
			</div>
		</div>
	</div>
	<div class="card__body">
		<h2 class="card__headline">Hover me</h2>
		<p class="card__text">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.</p>
	</div>
	<div class="card__foot">
		<span class="card__link">Read more</span>
	</div>
	<div class="card__border"></div>
</a>
      {/* <div className="card-container">
        <div className="card-float-header">
          <div className="user-logo">
            <Image src={_.get(signature,'owner.imageUrl')} color="F3F3F3" />
            <div className="user-popup-outer">
              <div className="user-popup">
                <div className="user-logo">
                  <Image src={_.get(signature,'owner.imageUrl')} />
                </div>
                <div>
                  <Button disabled variant="pill">
                    {JSON.parse(signature.category).label}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="user-name third-header ml-2"
            onClick={() => {
              goToUserProfile(_.get(signature,'owner.userName'));
            }}
          >
            {_.get(signature,"owner.userName")}
          </div>
        </div>
        <div
          className="image-container"
          onClick={() => {
            openCardView();
          }}
        >
          <div className={_.get(JSON.parse(signature.category), "value") + " masking third-header h-100"}>
            <div className="description">
              {
               getInitialSubString(signature.description, 40)}
            </div>
            <div className="title master-grey color-white h-100">
            {getInitialSubString(signature.title,20)}
            </div>
          </div>
          <Image
            src={signature.thumbnail}
            className="img-fluid"
            style={{
              background: "#f1f1f1",
            }}
          />
        </div>
        <div className={getClassNames()}>
          <div className="tag-n-location">
            <div className=" second-header timestamp">
              {moment(signature.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </div>
            <div className="tags second-grey">
              {signature.location || "Global"}
            </div>
          </div>
          <div className="purpose-badge">
            <i
              className={getPurposeIcon(
                _.get(signature, "purpose.purposeType") ||
                  _.get(signature, "purpose")
              )}
            ></i>
          </div>
        </div>
        {/* <div className="footer-area">testing bottom footer area</div> */}
      {/* </div> */} 
    </Col>
  );
};
export default CollectionCard;
