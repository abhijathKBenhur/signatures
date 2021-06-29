import _ from "lodash";
import React, { Component } from "react";
import "./App.scss";
import "./commons/Common.scss";

import Create from "./screens/Create/Create";
import Signature from "./screens/Signature/Signature";
import Gallery from "./screens/Gallery/gallery";
import Profile from "./screens/Profile/profile";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Banner from "./components/banner/banner";

import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="appContainer">
        <ToastContainer></ToastContainer>
        <Header></Header>
        {/* <Banner></Banner> */}
        <div className="content">
          <Switch>
            <Route path="/home" render={(props) => <Gallery />} />
            <Route path="/signature/:hashId" children={<Signature />} />
            <Route path="/create" children={<Create />} />
            <Route path="/profile/:userID" children={<Profile />} />
            <Route path="/profile" children={<Profile />} />
            <Route exact path="/" render={() => <Redirect from="/" to="/home" />} />
          </Switch>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}

export default App;
