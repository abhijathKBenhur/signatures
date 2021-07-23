import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const postAction = payload => {
    return api.post(`/postAction`,payload)
}


export const getActions = (payload) =>  { 
    return api.post("/getActions",payload) 
}

export const markAllAsRead = (payload) =>  { 
    return api.post("/updateActions",payload) 
}
  

const SignatureInterface = {
    postAction,
    getActions,
    markAllAsRead,
}

export default SignatureInterface