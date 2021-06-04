import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  Container,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./profile.scss";
import Image, { Shimmer } from "react-shimmer";
import MongoDBInterface from "../../interface/MongoDBInterface";
import BlockChainInterface from "../../interface/BlockchainInterface";
import { toast } from "react-toastify";
import { confirm } from "../../modals/confirmation/confirmation";
import Web3Utils from "web3-utils";
import { Edit3, Award, User } from "react-feather";
import StorageInterface from "../../interface/StorageInterface";
import CollectionCard  from "../../components/CollectionCard/CollectionCard"



function Profile(props) {
  const [collectionList, setCollectionList] = useState([]);
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

  function getPDFFile(signature){
    let hash = signature.PDFFile
    StorageInterface.getFileFromIPFS(hash).then(pdfFileResponse => {
      let pdfData = new Blob([pdfFileResponse.content.buffer])
      signature.pdfTempFile = pdfData
    })
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
    <Container>
      <Row className="profile">
        <Col md="12" className="mycollection">
          <Row className="userPane">
            <div className="profileHolder">
              <Award size={50}></Award>
            </div>
          </Row>
          <Row className="collections">
            {collectionList.map((collection, index) => {
              return (
                <CollectionCard card={collection}> </CollectionCard>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
