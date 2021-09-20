import { toast } from "react-toastify"
import CONSTANTS from "./Constants";
const intialToastValues = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: 'generic-cls'
}

export const showToaster = (text, data) => {
    toast(text, {
        ...intialToastValues,
        ...data
    })
}


export const getPurposeIcon = (item) => {
    if (item == CONSTANTS.PURPOSES.SELL) {
      return "fa fa-usd purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.AUCTION) {
      return "fa fa-gavel purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.COLLAB) {
      return "fa fa-handshake-o purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.KEEP) {
      return "fa fa-floppy-o purpose-icon second-grey";
    } else if (item == CONSTANTS.PURPOSES.LICENCE) {
      return "fa fa-id-card-o purpose-icon second-grey";
    }
  }

  export const getInitialSubString = (string,limit) => {
    if(string && string.length > limit){
      return string.substring(0,limit) + "... "
    }
    else{
      return string || ""
    }
  }

