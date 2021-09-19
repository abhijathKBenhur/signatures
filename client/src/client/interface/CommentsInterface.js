import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

import AxiosInstance from "../wrapper/apiWrapper"

export const postComment = (from,to,action,comment,entity,payload) => {
    let request = {
        from, to, action, comment,entity, payload
    }
    return AxiosInstance.post("/postComment",request)
}

export const getComments = (request) =>  { 
    return AxiosInstance.post("/getComments",request) 
}

export const markAllAsRead = (request) =>  { 
    return AxiosInstance.post("/updateNotifications",request) 
}
  

const CommentsInterface = {
    postComment,
    getComments,
    markAllAsRead,
}

export default CommentsInterface