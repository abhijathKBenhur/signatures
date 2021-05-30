import axios from 'axios'
import { File } from 'react-feather'
import _ from "lodash";

import {uuid} from 'uuidv4'
const api = axios.create({
    baseURL: '/api',
})

const fileAPI = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})


export const updatePrice = payload => {
    return api.post(`/updatePrice`,{
        setter: payload.owner,
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
        transactionID: payload.transactionID,
        ideaID: payload.ideaID,
    })
}

export const updateIdeaID = payload => {
    return api.post(`/updateIdeaID`,{
        PDFHash: payload.PDFHash,
        transactionID: payload.transactionID,
        ideaID: payload.ideaID,
    })
}

export const getSignatures = (payload) =>  { 
    return api.post("/getSignatures",payload) 
}

export const getSignatureByHash = (tokenId) => { 
    return api.get(`/signature/${tokenId}`) 
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


export const buySignature = payload => { 
    return api.post(`/buySignature`,payload) 
}

export const getUserInfo = payload => { 
    return api.post(`/getUserInfo`,payload) 
}


const MongoDBInterface = {
    getSignatures,
    addSignature,
    updateIdeaID,
    getFilePath,
    getSignatureByHash,
    buySignature
}

export default MongoDBInterface