import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getTotalIdeasOnTribe = payload => {
    return AxiosInstance.post("/getTotalIdeasOnTribe",payload)
}

export const getTotalUsersOnTribe = (payload) =>  { 
    return AxiosInstance.post("/getTotalUsersOnTribe",payload) 
}

export const getIdeasCountFromUser = (payload) =>  { 
    return AxiosInstance.post("/getIdeasCountFromUser",payload) 
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

export const getTotalSalesHeld = (payload) =>  { 
    return AxiosInstance.post("/getTotalSalesHeld",payload) 
}

export const getTotalTribeGoldDistributed = (payload) =>  { 
    return AxiosInstance.post("/getTotalTribeGoldDistributed",payload) 
}





const ClanInterface = {
    getTotalIdeasOnTribe,
    getTotalUsersOnTribe,
    getIdeasCountFromUser,
    getTotalUpvotesForUser,
    getTotalGoldForUser,
    getTotalGoldForIdea,
    getTotalSalesHeld,
    getTotalTribeGoldDistributed
}

export default ClanInterface