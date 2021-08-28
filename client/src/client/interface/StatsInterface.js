import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const getTotalIdeasOnTribe = payload => {
    return api.post("/getTotalIdeasOnTribe",payload)
}

export const getTotalUsersOnTribe = (payload) =>  { 
    return api.post("/getTotalUsersOnTribe",payload) 
}

export const getIdeasFromUser = (payload) =>  { 
    return api.post("/getIdeasFromUser",payload) 
}

export const getLikesForUser = (payload) =>  { 
    return api.post("/getIdeasFromUser",payload) 
}

const ClanInterface = {
    getTotalIdeasOnTribe,
    getTotalUsersOnTribe,
    getIdeasFromUser,
    getLikesForUser,
}

export default ClanInterface