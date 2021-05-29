// import BlockchainInterface from './interface/BlockchainInterface'

import _ from 'lodash'
import React, { Component } from 'react';
import './App.scss';
import './commons/Common.scss'

import Create from './screens/Create/Create'
import Signature from './screens/Signature/Signature'
import Gallery from './screens/Gallery/gallery'
import Profile from './screens/Profile/profile'
import Header from './components/header/header'
import { Container, Row, Col } from "react-bootstrap";
import {  Switch, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
        <div className="appContainer">
          <ToastContainer></ToastContainer>
          <Header></Header>
          <Container fluid className="content p-5">
              <Switch>
             
                <Route
                  path='/home'
                  render={(props) => (
                    <Gallery/>
                  )}
                />
                <Route path="/signature/:hashId" children={<Signature />} />
                <Route path="/create" children={<Create />} />
                <Route path="/profile" children={<Profile />} />
              </Switch>
          </Container>
        </div>
    );
  }
}

export default App;