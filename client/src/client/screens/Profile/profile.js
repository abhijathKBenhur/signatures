import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import { Badge, Button, Row, Col, Form, InputGroup } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import Image, { Shimmer } from "react-shimmer";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { toast } from "react-toastify";
import { confirm } from "../../modals/confirmation/confirmation";
import Web3Utils from 'web3-utils';
import {
  Edit3,
} from "react-feather";
function Profile(props) {
  const [collectionList, setCollectionList] = useState([]);
  const [rackList, setRackList] = useState([]);
  let history = useHistory();
  function openCardView(signature) {
    history.push({
      pathname: "/signature/" + signature.PDFHash,
      state: signature,
    });
  }

  function updatePriceInMongo(signature) {
    MongoDBInterface.updatePrice(signature).then((updatedSignature) => {
      signature.price = _.get(updatedSignature, "data.data.price");
    });
  }

  function feedbackMessage() {
    toast.dark(
      "Your order has been placed. Please wait a while for it to be processed.",
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  }

  function editPrice(signature) {
    confirm(
      "Set your price.",
      "Please enter the sell price",
      "Ok",
      "Cancel",
      true
    ).then((success) => {
      if (success.proceed) {
        signature.price = Web3Utils.toWei(success.input);
        BlockChainInterface.updatePrice(
          signature,
          updatePriceInMongo,
          feedbackMessage
        );
      } else {
      }
    });
  }


  useEffect(() => {
    BlockChainInterface.getAccountDetails()
      .then((metamaskID) => {
        MongoDBInterface.getSignatures({ userName: metamaskID }).then(
          (signatures) => {
            let response = _.get(signatures, "data.data");
            let rackValues = [];
            setCollectionList(response);
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Row className="profile">
      <Col md="12">
        <Row>
          <Col md="6">
            <h2>My collection</h2>
          </Col>
          <Col md="6">
            <h2>Following</h2>
          </Col>
        </Row>
      </Col>
      <Col md="6" className="mycollection">
        <Row>
          <Col md="12" className="collection-container">
            {collectionList.map((collection, index) => {
              return (
                <Row
                  key={index}
                  className="long-card cursor-pointer"
                  onClick={() => {
                    openCardView(collection);
                  }}
                >
                  <Col md="3" className="image-container">
                    <Image
                      src={collection.thumbnail}
                      width={50}
                      height={50}
                      fallback={<Shimmer width={50} height={50} />}
                    />
                  </Col>

                  <Col md="8" className="description-container">
                    <Row>
                      <Col md="12">
                        <h4>{collection.title}</h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        {collection.description.length > 50
                          ? collection.description.substring(0, 50) + "..."
                          : collection.description || "Click to see this idea"}
                      </Col>
                    </Row>
                  </Col>
                  <Col md="1" className="menu-bar">
                    <Row className="justify-content-center">
                      <Edit3 onClick={(e) => {
                        e.stopPropagation();
                        editPrice(collection)
                        }}></Edit3>
                    </Row>
                    <Row></Row>
                    <Row></Row>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
        <Row></Row>
      </Col>
      <Col md="6" className="favorites"></Col>
    </Row>
  );
}

export default Profile;
