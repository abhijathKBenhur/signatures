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
            <Rack classType="secondary"></Rack>
            <Rack classType="primary"></Rack>
            <Rack classType="secondary"></Rack>
        </div>
    )
}

export default gallery;