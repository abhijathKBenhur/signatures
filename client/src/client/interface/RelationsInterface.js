import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const postRelation = (from,to,relation,status,message) => {
    let payload = {
        from, to, relation, status, message
    }
    return api.post(`/postRelation`,payload)
}

export const removeRelation = (from,to,relation) => {
    let payload = {
        from, to, relation
    }
    return api.post(`/removeRelation`,payload)
}



export const getRelations = (payload) =>  { 
    return api.post("/getRelations",payload) 
}

export const markAllAsRead = (payload) =>  { 
    return api.post("/updateRelations",payload) 
}
  

const RelationsInterface = {
    postRelation,
    getRelations,
    markAllAsRead,
    removeRelation
}

export default RelationsInterface