import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const createClan = payload => {
    return api.post("/createClan",payload)
}

export const updateClan = (payload) =>  { 
    return api.post("/updateClan",payload) 
}

export const getClans = (payload) =>  { 
    return api.post("/getClans",payload) 
}

export const getClanMembers = (payload) =>  { 
    return api.post("/getClanMembers",payload) 
}


const ClanInterface = {
    createClan,
    updateClan,
    getClans,
    getClanMembers
}

export default ClanInterface