
import {SET_METAMASK_ID, SET_COLLECTION_LIST} from './actions'
const intialState = {
    metamaskID: undefined,
    collectionList: []
}

export const reducer = (state = intialState, action) => {
    switch (action.type) {
        case SET_METAMASK_ID:
        return {
            ...state,
            metamaskID: action.payload || undefined
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