
import {SET_METAMASK_ID, SET_USER_DETAILS, SET_CHAIN} from './actions'
const intialState = {
    metamaskID: undefined,
    userDetails: {},
    reduxChain: undefined,
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
        case SET_CHAIN:
        return {
            ...state,
            reduxChain: action.payload || undefined
        }
        default:  return {...state};
    }
}