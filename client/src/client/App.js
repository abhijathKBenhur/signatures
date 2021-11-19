import _ from "lodash";
import React, { Component } from "react";
import "./App.scss";
import "./commons/Common.scss";

import CreateNew from "./screens/Create/Create-new";
import Signature from "./screens/Signature/Signature-new";
import Gallery from "./screens/Gallery/gallery";
import Profile from "./screens/Profile/profile";
import Clan from "./screens/Clan/Clan";

import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import {BrowserRouter as Router, Route, Switch, Redirect,withRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";


import About from "./screens/about/about";
import Contactus from "./screens/contactus/contactus";
import FAQ from "./screens/FAQ/FAQ";
import Tokenomics from "./screens/Tokenomics/Tokenomics";
import Terms from "./screens/terms/terms"
import Privacy from "./screens/privacy/privacy";

const App = () =>  {

    return (
      <Router>  
      <div className="appContainer">
        <ToastContainer></ToastContainer>
        <Header></Header>
        <div className="app-content">
          <Switch>
            <Route path="/home" render={(props) => <Gallery />} />
            <Route path="/signature/:hashId" component={Signature} />
            <Route path="/create" component={CreateNew} />
            <Route path="/profile/:userName" component={Profile} />
            <Route path="/clan/:clanID" component={Clan} />
            <Route path="/profile" component={Profile} />
            <Route path="/about" component={About} />
            <Route path="/contactus" component={Contactus} />
            <Route path="/FAQ" component={FAQ} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />

            <Route path="/tokenomics" component={Tokenomics} />
            <Route exact path="/" render={() => <Redirect from="/" to="/home" />} />
          </Switch>
        </div>
        <Footer></Footer>
      </div>
      </Router>
    );
}

export default withRouter(App);
