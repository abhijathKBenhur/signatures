
import {SET_METAMASK_ID, SET_COLLECTION_LIST, SET_USER_DETAILS} from './actions'
const intialState = {
    metamaskID: undefined,
    collectionList: [],
    userDetails: {}
}

export const reducer = (state = intialState, action) => {
    switch (action.type) {
        case SET_METAMASK_ID:
        return {
            ...state,
            metamaskID: action.payload || undefined
        }
        case SET_USER_DETAILS:
        return {
            ...state,
            userDetails: action.payload || {}
        }
        case SET_COLLECTION_LIST:
            console.log(action)
        return {
            ...state,
            collectionList: action.payload || []
        }
        default:  return {...state};
    }
}