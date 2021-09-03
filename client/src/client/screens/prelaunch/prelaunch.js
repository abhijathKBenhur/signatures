import React, { useState } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import "./prelaunch.scss";
import { useHistory, useLocation } from "react-router-dom";
import RelationsInterface from "../../interface/RelationsInterface";
import $ from "jquery";
import { showToaster } from "../../commons/common.utils";
const Prelaunch = () => {
  let history = useHistory();
  const [searchText, setSearchText] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const submitMailId = () => {
    $.get(
      "https://ipinfo.io?token=162c69a92ff37a",
      function(response) {
        let region = response.city + ", " + response.region;
        RelationsInterface.subscribe({
          mailID: searchText,
          location: region,
        }).then((success) => {
          showToaster("Sucbscribed!", { type: "dark" });
          setSubscribed(true)
        });
      },
      "jsonp"
    );
  };

  const type = (event) => {
    if (event) setSearchText(event.target.value);
  };

  return (
    <Container className="prelaunch-container">
      <div className="center-box">
      {subscribed ? <div className="subscribe-block second-grey justify-content-center">Thank you!</div>:  <div className="">
          {/* <Row className="subscribe-block master-header justify-content-center">Subscribe</Row> */}
          <Row className="subscribe-block second-grey justify-content-center">Subscribe to ideaTribe newsletter and updates.</Row>
          <Row>
            <div className="mailEntry w-100 mt-2">
              <input
                type="text"
                onKeyUp={type}
                id="search-box"
                autoComplete="off"
                className="search-box w-100"
                placeholder="Mail id"
              />
            </div>
            <Button
              variant="primary"
              className="subscribe-btn mt-2"
              onChan
              onClick={() => {
                submitMailId();
              }}
            >
              {" "}
              Submit
            </Button>
          </Row>
        </div>
      }</div>
    </Container>
  );
};

export default Prelaunch;
