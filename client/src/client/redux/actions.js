
export const SET_METAMASK_ID = 'SET_METAMASK_ID';

export const setMetaMaskID = (id) => {
    return {
        type: SET_METAMASK_ID,
        payload: id
    }
}