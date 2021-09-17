import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

import AxiosInstance from "../wrapper/apiWrapper"

export const postNotification = (from,to,action,status,message,payload) => {
    let request = {
        from, to, action, status, message,payload
    }
    return AxiosInstance.post("/postNotification",request)
}

export const markNotificationAsRead = (request) =>  { 
    return AxiosInstance.post("/markNotificationAsRead",request) 
}

export const getNotifications = (request) =>  { 
    return AxiosInstance.post("/getNotifications",request) 
}

export const markAllAsRead = (request) =>  { 
    return AxiosInstance.post("/markAllAsRead",request) 
}
  

const NotificationInterface = {
    postNotification,
    getNotifications,
    markAllAsRead,
    markNotificationAsRead
}

export default NotificationInterface