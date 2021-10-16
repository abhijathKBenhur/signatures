import axios from 'axios'
import _ from "lodash";
import ENDPOINTS from '../commons/Endpoints';
import AxiosInstance from "../wrapper/apiWrapper"
const Web3Utils = require("web3-utils");

export const updatePurpose = payload => {
    return AxiosInstance.post(`/updatePurpose`,{
        ideaID: payload.ideaID,
        purpose: payload.purpose,
        price:  Web3Utils.toWei(payload.price,"ether"),
        owner: payload.owner._id
    })
}

export const addSignature = payload => {
    return AxiosInstance.post(`/addSignature`,{
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
    return AxiosInstance.post("/getSignatures",payload) 
}

export const getSignatureByHash = (tokenId) => { 
    return AxiosInstance.get(`/signature/${tokenId}`) 
}

export const buySignature = payload => { 
    return AxiosInstance.post(`/buySignature`,payload) 
}

export const updateIdeaID = payload => { 
    return AxiosInstance.post(`/updateIdeaID`,payload) 
}
export const removeIdeaEntry = payload => { 
    return AxiosInstance.post(`/removeIdeaEntry`,payload) 
}




const SignatureInterface = {
    getSignatures,
    addSignature,
    getSignatureByHash,
    buySignature,
    updatePurpose,
    updateIdeaID,
    removeIdeaEntry

}

export default SignatureInterface