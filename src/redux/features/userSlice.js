import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name:'user',
    initialState: {
        login: false,
        userDetail: {}
    },
    reducers: {
        setUserDetails: (state,action) => {
            // state.login
            state.userDetail = action.payload.element
            state.login = action.payload.login
        }
    }
})

export const {setUserDetails} = userSlice.actions;
export default userSlice.reducer 