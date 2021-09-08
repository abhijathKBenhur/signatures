import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';

const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
})

export const postTransaction = (request) => {
    return api.post("/postTransaction",request)
}

export const getTransactions = (request) =>  { 
    return api.post("/getTransactions",request) 
}

export const setTransactionAsCompleted = (request) =>  { 
    return api.post("/setTransactionAsCompleted",request) 
}
  

const TransactionsInterface = {
    postTransaction,
    getTransactions,
    setTransactionAsCompleted,
}

export default TransactionsInterface