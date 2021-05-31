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


export const updatePrice = payload => {
    return api.post(`/updatePrice`,{
        setter: payload.owner,
        price: payload.price,
        ideaID: payload.ideaID,
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

export const getFilePaths = form => { 
    let promiseList = []
    let PDFformData = new FormData();
    PDFformData.append('fileData',form.PDFFile )
    PDFformData.append('hash',form.PDFHash )
    PDFformData.append('type',"PDFFile" )


    let IMGformData = new FormData();
    IMGformData.append('fileData',form.thumbnail )
    IMGformData.append('hash',form.PDFHash )
    IMGformData.append('type',"thumbnail" )


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
    getFilePaths,
    getSignatureByHash,
    buySignature
}

export default MongoDBInterface