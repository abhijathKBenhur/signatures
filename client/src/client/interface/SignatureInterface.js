import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';
const api = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS
    // baseURL: '/api',
})

const fileAPI = axios.create({
    baseURL: process.env.NODE_ENV == "production" ? ENDPOINTS.REMOTE_ENDPOINTS: ENDPOINTS.LOCAL_ENDPOINTS,
    // baseURL: '/api',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})


export const updatePurpose = payload => {
    return api.post(`/updatePurpose`,{
        ideaID: payload.ideaID,
        purpose: payload.purpose,
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
        fileType: payload.fileType,
        creator: payload.creator,
        storage: payload.storage,
        purpose: payload.purpose,
        location: payload.location,
        status: payload.status
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

export const updateIdeaID = payload => { 
    return api.post(`/updateIdeaID`,payload) 
}


const SignatureInterface = {
    getSignatures,
    addSignature,
    getSignatureByHash,
    buySignature,
    updatePurpose,
    updateIdeaID

}

export default SignatureInterface