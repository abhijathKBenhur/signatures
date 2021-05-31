import _ from "lodash";
import Signature from '../../beans/Signature'
import React, { useState, useEffect } from 'react';
import Rack from '../../components/Rack/Rack'
import './gallery.scss'
import MongoDBInterface from '../../interface/MongoDBInterface'


function gallery(props) {
  const [signatureList, setSignatureList] = useState([]);
  useEffect(() => {
      console.log("getting signatures ")
      MongoDBInterface.getSignatures({limit:14}).then(signatures => {
        let response = _.get(signatures,'data.data')
        let rackValues = []
        setSignatureList(response);
      })
  }, []);

    return (
        <div className="gallery d-flex flex-column flex-md-row flex-lg-row flex-xl-row">
            <Rack deck={signatureList || []} classType="secondary"></Rack>
        </div>
    )
}

export default gallery;