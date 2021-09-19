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

export const setTransactionState = (request) =>  { 
    return AxiosInstance.post("/setTransactionState",request) 
}
  

const TransactionsInterface = {
    postTransaction,
    getTransactions,
    setTransactionState,
}

export default TransactionsInterface