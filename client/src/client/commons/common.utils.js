import { toast } from "react-toastify"

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


