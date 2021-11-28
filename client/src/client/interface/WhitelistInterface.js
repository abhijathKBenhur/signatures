import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

import AxiosInstance from "../wrapper/apiWrapper"



export const checkWhiteList  = (payload) => {
    return AxiosInstance.post(`/checkWhiteList`,payload)
}

export const getWhitelists  = (payload) => {
    return AxiosInstance.post(`/getWhitelists`,payload)
}

export const postWhitelist  = (payload) => {
    return AxiosInstance.post(`/postWhitelist`,payload)
}
  

const WhitelistInterface = {
    checkWhiteList,
    getWhitelists,
    postWhitelist
}

export default WhitelistInterface