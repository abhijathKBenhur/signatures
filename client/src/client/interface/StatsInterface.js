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


export const getTotalUpvotesForUser = (payload) =>  { 
    return AxiosInstance.post("/getTotalUpvotesForUser",payload) 
}

export const getTotalGoldForUser = (payload) =>  { 
    return AxiosInstance.post("/getTotalGoldForUser",payload) 
}

export const getTotalGoldForIdea = (payload) =>  { 
    return AxiosInstance.post("/getTotalGoldForIdea",payload) 
}

const ClanInterface = {
    getTotalIdeasOnTribe,
    getTotalUsersOnTribe,
    getIdeasFromUser,
    getTotalUpvotesForUser,
    getTotalGoldForUser,
    getTotalGoldForIdea
}

export default ClanInterface