import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

import AxiosInstance from "../wrapper/apiWrapper"

export const postTransaction = (request) => {
    return AxiosInstance.post("/postTransaction",request)
}

export const getTransactions = (request) =>  { 
    return AxiosInstance.post("/getTransactions",request) 
}

export const getGroupedEarnings = (request) =>  { 
    return AxiosInstance.post("/getGroupedEarnings",request) 
}

export const getIncentivesList = (request) =>  { 
    return AxiosInstance.get("/getIncentivesList",request) 
}

export const setTransactionState = (request) =>  { 
    return AxiosInstance.post("/setTransactionState",request) 
}
  

const TransactionsInterface = {
    postTransaction,
    getTransactions,
    setTransactionState,
    getGroupedEarnings,
    getIncentivesList
}

export default TransactionsInterface