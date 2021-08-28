import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const postComment = (from,to,action,comment,entity,payload) => {
    let request = {
        from, to, action, comment,entity, payload
    }
    return api.post("/postComment",request)
}

export const getComments = (request) =>  { 
    return api.post("/getComments",request) 
}

export const markAllAsRead = (request) =>  { 
    return api.post("/updateNotifications",request) 
}
  

const CommentsInterface = {
    postComment,
    getComments,
    markAllAsRead,
}

export default CommentsInterface