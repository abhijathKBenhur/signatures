import _ from "lodash";
import Signature from "../../beans/Signature";
import React, { useState, useEffect } from "react";
import Rack from "../../components/Rack/Rack";
import "./gallery.scss";
import { Container} from "react-bootstrap";
import MongoDBInterface from "../../interface/MongoDBInterface";

function gallery(props) {
  const [signatureList, setSignatureList] = useState([]);
  useEffect(() => {
    console.log("getting signatures ");
    MongoDBInterface.getSignatures({ limit: 14 }).then((signatures) => {
      let response = _.get(signatures, "data.data");
      setSignatureList(response);
    });
  }, []);

  return (
    <Container>
      <div className="gallery p-3">
        <Rack deck={signatureList}></Rack>
      </div>
    </Container>
  );
}

export default gallery;
