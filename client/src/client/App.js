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
import Banner from "./components/banner/banner";
import {BrowserRouter as Router, Route, Switch, Redirect,withRouter, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DailyReads from "./screens/daily-reads/daily-reads";
import Tutorial from "./screens/tutorial/tutorial";
import ICO from "./screens/ico/ico";
import Roadmap from "./screens/roadmap/roadmap";
import About from "./screens/about/about";

import Newsletter from "./screens/newsletter/newsletter";
import Blog from "./screens/blog/blog";
import Help from "./screens/help/help";
import Support from "./screens/support/support";
import Partner from "./screens/partner/partner";
import Contact from "./screens/contact/contact";

const App = () =>  {

    return (
      <Router>  
      <div className="appContainer">
        <ToastContainer></ToastContainer>
        <Header></Header>
        {/* <Banner></Banner> */}
        <div className="app-content">
          <Switch>
            <Route path="/home" render={(props) => <Gallery />} />
            <Route path="/signature/:hashId" component={Signature} />
            <Route path="/create" component={CreateNew} />
            <Route path="/profile/:userName" component={Profile} />
            <Route path="/clan/:clanID" component={Clan} />
            <Route path="/profile" component={Profile} />
            <Route path="/daily-reads" component={DailyReads} />
            <Route path="/tutorial" component={Tutorial} />
            <Route path="/ico" component={ICO} />
            <Route path="/roadmap" component={Roadmap} />
            {/* <Route path="/"  render={(props) => <Gallery />} /> */}
            <Route path="/newsletter" component={Newsletter} />
            <Route path="/blog" component={Blog} />
            <Route path="/help" component={Help} />
            <Route path="/support" component={Support} />
            <Route path="/partner" component={Partner} />
            <Route path="/contact" component={Contact} />
            <Route path="/about" component={About} />
            <Route exact path="/" render={() => <Redirect from="/" to="/about" />} />
          </Switch>
        </div>
        {/* <Footer></Footer> */}
      </div>
      </Router>
    );
}

export default withRouter(App);
