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
        <div className="gallery">
            
        </div>
    )
}

export default gallery;