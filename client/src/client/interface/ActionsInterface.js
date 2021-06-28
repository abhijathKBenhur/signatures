import axios from 'axios'
import _ from "lodash";

const api = axios.create({
    // baseURL: 'http://localhost:4000/api',
    baseURL: '/api',
})




export const postAction = payload => {
    return api.post(`/postAction`,payload)
}



export const getActions = (payload) =>  { 
    return api.get("/getActions",payload) 
}

export const markAllAsRead = (payload) =>  { 
    return api.post("/updateActions",payload) 
}
  

const MongoDBInterface = {
    postAction,
    getActions,
    markAllAsRead,
}

export default MongoDBInterface