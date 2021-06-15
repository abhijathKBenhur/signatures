import _ from "lodash";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "react-google-login";

const Register = () => {
  const [appLocation, setAppLocatoin] = useState("home");
  function responseGoogle(response) {
    let userDetailsObject = {
      firstName: _.get(response.profileObj, "givenName"),
      LastName: _.get(response.profileObj, "givenName"),
      email: _.get(response.profileObj, "email"),
      fullName: _.get(response.profileObj, "givenName"),
      imageUrl: _.get(response.profileObj, "imageUrl"),
    };
    console.log(response);
  }

  return (
    <div className="register-wizard">
      <GoogleLogin
        // secretKey:I0YMKAriMhc6dB7bN44fHuKj
        clientId="639340003430-d17oardcjjpo9qnj0m02330l5orgn8sp.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
      />
    </div>
  );
};

export default Register;
