import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';
import AxiosInstance from "../wrapper/apiWrapper"

export const getUserInfo = payload => { 
    return AxiosInstance.post(`/getUserInfo`,payload) 
}

export const getUsers = payload => { 
    return AxiosInstance.post(`/getUsers`,payload) 
}

export const registerUser = payload => { 
    return AxiosInstance.post(`/registerUser`,payload) 
}

export const updateUser = payload => { 
    return AxiosInstance.post(`/updateUser`,payload) 
}

export const getNonceAndRegister = payload => { 
    return AxiosInstance.post(`/getNonceAndRegister`,payload) 
}
export const renewNonce = payload => { 
    return AxiosInstance.post(`/renewNonce`,payload) 
}


const UserInterface = {
    registerUser,
    getUserInfo,
    updateUser,
    getUsers,
    getNonceAndRegister,
    renewNonce
}

export default UserInterface