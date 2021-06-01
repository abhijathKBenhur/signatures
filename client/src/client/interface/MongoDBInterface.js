import axios from 'axios'
import _ from "lodash";

const api = axios.create({
    baseURL: '/api',
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
    getSignatureByHash,
    buySignature,
    updatePrice
}

export default MongoDBInterface