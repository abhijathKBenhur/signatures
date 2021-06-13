
export const SET_METAMASK_ID = 'SET_METAMASK_ID';
export const SET_COLLECTION_LIST = 'SET_COLLECTION_LIST'

export const setMetaMaskID = (id) => {
    return {
        type: SET_METAMASK_ID,
        payload: id
    }
}

export const setCollectionList = (cl) => {
    return {
        type: SET_COLLECTION_LIST,
        payload: cl
    }
}