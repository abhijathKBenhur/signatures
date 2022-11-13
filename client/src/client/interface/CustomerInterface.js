import AxiosInstance from "../wrapper/apiWrapper"

export const getPassportBalance = payload => {
    return AxiosInstance.post("/getPassportBalance",payload)
}

export const redeemGold = (payload) =>  { 
    return AxiosInstance.post("/redeemGold",payload) 
}

const CustomerInterface = {
    getPassportBalance,
    redeemGold
}

export default CustomerInterface