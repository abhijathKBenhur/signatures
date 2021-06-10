
import {SET_METAMASK_ID, setMetaMaskID} from './actions'
const intialState = {
    metamaskID: undefined
}

export const reducer = (state = intialState, action) => {
    switch (action.type) {
        case SET_METAMASK_ID:
        return {
            ...state,
            metamaskID: action.payload || undefined
        }
        default:  return {...state};
    }
}