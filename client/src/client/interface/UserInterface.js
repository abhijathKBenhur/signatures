import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';
const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
    // baseURL: '/api',
})


export const getUserInfo = payload => { 
    return api.post(`/getUserInfo`,payload) 
}

export const getUsers = payload => { 
    return api.post(`/getUsers`,payload) 
}

export const registerUser = payload => { 
    return api.post(`/registerUser`,payload) 
}

export const register_user = payload => { 
    console.log("register_user")
    return api.post(`/register_user`,payload) 
  }

export const update_user = payload => { 
    console.log("update_user")
    return api.post(`/update_user`,payload) 
}
  

const UserInterface = {
    registerUser,
    getUserInfo,
    update_user,
    getUsers
}

export default UserInterface