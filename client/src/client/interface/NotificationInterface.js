import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const postNotification = (from,to,action,status,message,payload) => {
    let request = {
        from, to, action, status, message,payload
    }
    return api.post("/postNotification",request)
}

export const markNotificationAsRead = (request) =>  { 
    return api.post("/markNotificationAsRead",request) 
}

export const getNotifications = (request) =>  { 
    return api.post("/getNotifications",request) 
}

export const markAllAsRead = (request) =>  { 
    return api.post("/markAllAsRead",request) 
}
  

const NotificationInterface = {
    postNotification,
    getNotifications,
    markAllAsRead,
    markNotificationAsRead
}

export default NotificationInterface