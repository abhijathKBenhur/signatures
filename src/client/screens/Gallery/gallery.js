import React from 'react';
import MongoDBInterface from '../../interface/MongoDBInterface'
import _ from "lodash";
import Rack from '../../components/Rack/Rack'
import './gallery.scss'

function refreshTokens(){
    MongoDBInterface.getTokens().then(tokens =>{
      this.setState({
            tokens: _.get(tokens,'data.data')
          })
      })
    // BlockchainInterface.initialize().then(tokens => {
    //   this.setState({
    //     tokens
    //   })
    // })
  }


function gallery(props) {
    return (
        <div className="gallery d-flex flex-column flex-md-row flex-lg-row flex-xl-row">
            <Rack deck={[1,2,3,4,5]} classType="secondary"></Rack>
            <Rack deck={[1,2,3,4]} classType="primary"></Rack>
            <Rack deck={[1,2,3,4,5]} classType="secondary"></Rack>
        </div>
    )
}

export default gallery;