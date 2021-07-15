import _ from "lodash";
import React, { Component } from "react";
import "./App.scss";
import "./commons/Common.scss";

import CreateNew from "./screens/Create/Create-new";
import Signature from "./screens/Signature/Signature-new";
import Gallery from "./screens/Gallery/gallery";
import Profile from "./screens/Profile/profile";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Banner from "./components/banner/banner";

import { Switch, Route, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import DailyReads from "./components/daily-reads/daily-reads";
import Tutorial from "./components/tutorial/tutorial";
import ICO from "./components/ico/ico";
import Roadmap from "./components/roadmap/roadmap";
import About from "./components/about/about";
import Newsletter from "./components/newsletter/newsletter";
import Blog from "./components/blog/blog";
import Help from "./components/help/help";
import Support from "./components/support/support";
import Partner from "./components/partner/partner";
import Contact from "./components/contact/contact";

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
            <Route path="/create" children={<CreateNew />} />
            <Route path="/profile/:userName" children={<Profile />} />
            <Route path="/profile" children={<Profile />} />
            <Route path="/daily-reads" component={DailyReads} />
            <Route path="/tutorial" component={Tutorial} />
            <Route path="/ico" component={ICO} />
            <Route path="/roadmap" component={Roadmap} />
            <Route path="/about" component={About} />
            <Route path="/newsletter" component={Newsletter} />
            <Route path="/blog" component={Blog} />
            <Route path="/help" component={Help} />
            <Route path="/support" component={Support} />
            <Route path="/partner" component={Partner} />
            <Route path="/contact" component={Contact} />
            <Route exact path="/" render={() => <Redirect from="/" to="/home" />} />
          </Switch>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}

export default App;
