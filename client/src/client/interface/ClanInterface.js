import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

import AxiosInstance from "../wrapper/apiWrapper"

export const createClan = payload => {
    return AxiosInstance.post("/createClan",payload)
}

export const updateClan = (payload) =>  { 
    return AxiosInstance.post("/updateClan",payload) 
}

export const getClans = (payload) =>  { 
    return AxiosInstance.post("/getClans",payload) 
}

export const getClan = (payload) =>  { 
    return AxiosInstance.post("/getClan",payload) 
}

export const getClanMembers = (payload) =>  { 
    return AxiosInstance.post("/getClanMembers",payload) 
}


const ClanInterface = {
    createClan,
    updateClan,
    getClans,
    getClan,
    getClanMembers
}

export default ClanInterface