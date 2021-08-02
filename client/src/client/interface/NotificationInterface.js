import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const postNotification = (from,to,action,status,message) => {
    let payload = {
        from, to, action, status, message
    }
    return api.post("/postNotification",payload)
}

export const getNotifications = (payload) =>  { 
    return api.post("/getNotifications",payload) 
}

export const markAllAsRead = (payload) =>  { 
    return api.post("/updateNotifications",payload) 
}
  

const NotificationInterface = {
    postNotification,
    getNotifications,
    markAllAsRead,
}

export default NotificationInterface