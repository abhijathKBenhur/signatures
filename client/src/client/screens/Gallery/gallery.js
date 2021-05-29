import _ from "lodash";
import Signature from '../../beans/Signature'
import React, { useState, useEffect } from 'react';
import Rack from '../../components/Rack/Rack'
import './gallery.scss'
import MongoDBInterface from '../../interface/MongoDBInterface'


function gallery(props) {
  const [signatureList, setSignatureList] = useState([]);
  const [rackList, setRackList] = useState([]);
  useEffect(() => {
      console.log("getting signatures ")
      MongoDBInterface.getSignatures({limit:14}).then(signatures => {
        let response = _.get(signatures,'data.data')
        let rackValues = []
        setSignatureList(response);
        _.forEach(response, (signature, index) => {
          rackValues[index % 3] = rackValues[index % 3] || []
          rackValues[index % 3].push(new Signature(signature))
        })
        setRackList(rackValues)
      })
  }, []);

    return (
        <div className="gallery d-flex flex-column flex-md-row flex-lg-row flex-xl-row">
            <Rack deck={rackList[0] || []} classType="secondary"></Rack>
            <Rack deck={rackList[1] || []} classType="secondary"></Rack>
            <Rack deck={rackList[2] || []} classType="secondary"></Rack>
            <Rack deck={rackList[2] || []} classType="secondary"></Rack>
        </div>
    )
}

export default gallery;