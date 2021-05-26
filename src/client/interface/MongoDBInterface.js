import axios from 'axios'
import { File } from 'react-feather'
import _ from "lodash";

import {uuid} from 'uuidv4'
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
})

const fileAPI = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
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

export const addSignature = payload => {
    return api.post(`/addSignature`,{
        owner: payload.owner,
        title: payload.title,
        category: payload.category,
        description: payload.description,
        price:  payload.price,
        thumbnail: payload.thumbnail,
        PDFHash: payload.PDFHash,
        PDFFile: payload.PDFFile,
    })
}
export const getSignatures = (payload) =>  { 
    return api.post("/getSignatures",payload) 
}
export const getTokenById = (tokenId, owner) => { 
    return api.get(`/token/${tokenId}/${owner}`) 
}

export const getFilePath = form => { 
    let promiseList = []
    let PDFformData = new FormData();
    PDFformData.append('fileData',form.PDFFile )
    PDFformData.append('hash',form.PDFHash )


    let IMGformData = new FormData();
    IMGformData.append('fileData',form.thumbnail )
    IMGformData.append('hash',form.PDFHash )


    promiseList.push(fileAPI.post("/getFilePath",PDFformData))
    promiseList.push(fileAPI.post("/getFilePath",IMGformData))
    return Promise.all(promiseList)
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
    addSignature,
    getSignatures,
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