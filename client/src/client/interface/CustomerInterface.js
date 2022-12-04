import AxiosInstance from "../wrapper/apiWrapper"

export const getPassportBalance = payload => {
    return AxiosInstance.post("/getPassportBalance",payload)
}

export const redeemGold = (payload) =>  { 
    return AxiosInstance.post("/redeemGold",payload) 
}

export const redeemGoldFromTribe = (payload) =>  { 
    return AxiosInstance.post("/redeemGoldFromTribe",payload) 
}

const CustomerInterface = {
    getPassportBalance,
    redeemGold,
    redeemGoldFromTribe
}

export default CustomerInterface