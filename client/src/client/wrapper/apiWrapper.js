import axios from "axios";
import Cookies from "universal-cookie";
import CONSTANTS from "../commons/Constants";
import ENDPOINTS from "../commons/Endpoints";

const AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? ENDPOINTS.REMOTE_ENDPOINTS
      : ENDPOINTS.LOCAL_ENDPOINTS,
});

AxiosInstance.interceptors.request.use(function(config) {
  const token = new Cookies().get(CONSTANTS.COOKIE_TOKEN_PHRASE);
  config.headers["x-access-token"] =  token;
  return config;
});

AxiosInstance.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default AxiosInstance;



