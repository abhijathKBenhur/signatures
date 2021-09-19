import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

import AxiosInstance from "../wrapper/apiWrapper"

export const getTotalIdeasOnTribe = payload => {
    return AxiosInstance.post("/getTotalIdeasOnTribe",payload)
}

export const getTotalUsersOnTribe = (payload) =>  { 
    return AxiosInstance.post("/getTotalUsersOnTribe",payload) 
}

export const getIdeasFromUser = (payload) =>  { 
    return AxiosInstance.post("/getIdeasFromUser",payload) 
}

export const getLikesForUser = (payload) =>  { 
    return AxiosInstance.post("/getIdeasFromUser",payload) 
}

const ClanInterface = {
    getTotalIdeasOnTribe,
    getTotalUsersOnTribe,
    getIdeasFromUser,
    getLikesForUser,
}

export default ClanInterface