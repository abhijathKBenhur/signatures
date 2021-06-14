
export const SET_METAMASK_ID = 'SET_METAMASK_ID';
export const SET_COLLECTION_LIST = 'SET_COLLECTION_LIST'
export const SET_USER_DETAILS = 'SET_USER_DETAILS'

export const setMetaMaskID = (id) => {
    return {
        type: SET_METAMASK_ID,
        payload: id
    }
}

export const setUserDetails = (payload) => {
    return {
        type: SET_USER_DETAILS,
        payload: payload
    }
}

export const setCollectionList = (cl) => {
    return {
        type: SET_COLLECTION_LIST,
        payload: cl
    }
}