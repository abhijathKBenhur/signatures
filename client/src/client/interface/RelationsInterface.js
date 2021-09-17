import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

import AxiosInstance from "../wrapper/apiWrapper"

export const postRelation = (from,to,relation,status,message) => {
    let payload = {
        from, to, relation, status, message
    }
    return AxiosInstance.post(`/postRelation`,payload)
}

export const removeRelation = (from,to,relation) => {
    let payload = {
        from, to, relation
    }
    return AxiosInstance.post(`/removeRelation`,payload)
}



export const getRelations = (payload) =>  { 
    return AxiosInstance.post("/getRelations",payload) 
}

export const markAllAsRead = (payload) =>  { 
    return AxiosInstance.post("/updateRelations",payload) 
}

export const subscribe = (payload) => {
    return AxiosInstance.post(`/subscribe`,payload)
}
  

const RelationsInterface = {
    postRelation,
    getRelations,
    markAllAsRead,
    removeRelation,
    subscribe
}

export default RelationsInterface