
export const SET_METAMASK_ID = 'SET_METAMASK_ID';
export const SET_USER_DETAILS = 'SET_USER_DETAILS';

export const setReduxMetaMaskID = (id) => {
    return {
        type: SET_METAMASK_ID,
        payload: id
    }
}

export const setReduxUserDetails = (payload) => {
    return {
        type: SET_USER_DETAILS,
        payload: payload
    }
}
