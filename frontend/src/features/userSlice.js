import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username : null,
    id : null,
    users : []
}

export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        logUser : (state,action)=>{
            state.username = action.payload.user
            state.id = action.payload.id
            state.users = action.payload.users ?? []
        }
    }
})

export const { logUser } = userSlice.actions
export default userSlice.reducer

