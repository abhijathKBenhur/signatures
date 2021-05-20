import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../redux/userSlices";

export default configureStore({
    reducer: {
        user: userReducer
    }
})