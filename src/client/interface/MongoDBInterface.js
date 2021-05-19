import axios from 'axios'
import {uuid} from 'uuidv4'
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})


export const signup = payload => {
    return api.post(`/signup`,{
        userName: payload.userName,
        password: payload.password,
    })
}


export const login = payload => {
    return api.post(`/login`,{
        userName: payload.userName,
        password: payload.password,
    })
}

export const updatePrice = payload => {
    return api.post(`/updatePrice`,{
        setter: payload.setter,
        price: payload.price,
        tokenId: payload.tokenId,
    })
}



export const addToken = payload => {
    return api.post(`/token`,{
        account: localStorage.getItem("userInfo"),
        owner: localStorage.getItem("userInfo"),
        name: payload.name,
        category: payload.category,
        description: payload.description,
        amount: parseFloat(payload.amount),
        price:  payload.price,
        uri: payload.uri,
        type: payload.type,
        tokenId:uuid()
    })
}
export const getTokens = (payload) =>  { 
    // return api.post("/tokens",payload) 
    return api.post("/tokens",payload) 
}
export const getTokenById = (tokenId, owner) => { 
    return api.get(`/token/${tokenId}/${owner}`) 
}

export const getFilePath = file => { 
    let formData = new FormData();
    formData.append('fileData',file )
    return axios({
        method: 'post',
        url: 'http://localhost:4000/api/getFilePath',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
}

export const buyToken = payload => { 
    return api.post(`/buyToken`,payload) 
}


export const buyUserToken = payload => { 
    return api.post(`/buyUserToken`,payload) 
}

export const getUserInfo = payload => { 
    return api.post(`/getUserInfo`,payload) 
}


const MongoDBInterface = {
    addToken,
    getTokens,
    getTokenById,
    getFilePath,
    signup,
    login,
    buyToken,
    buyUserToken,
    getUserInfo,
    updatePrice
}

export default MongoDBInterface