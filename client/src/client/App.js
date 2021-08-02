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
// import DailyReads from "./components/daily-reads/daily-reads";
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
            {/* <Route path="/daily-reads" component={DailyReads} /> */}
            <Route path="/tutorial" component={Tutorial} />
            <Route path="/ico" component={ICO} />
            <Route path="/roadmap" component={Roadmap} />
            <Route path="/" component={About} />
            <Route path="/newsletter" component={Newsletter} />
            <Route path="/blog" component={Blog} />
            <Route path="/help" component={Help} />
            <Route path="/support" component={Support} />
            <Route path="/partner" component={Partner} />
            <Route path="/contact" component={Contact} />
            <Route exact path="/" render={() => <Redirect from="/" to="/" />} />
          </Switch>
          <Footer></Footer>
        </div>
      </div>
    );
  }
}

export default App;
