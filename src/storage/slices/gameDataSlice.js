import {createSlice} from "@reduxjs/toolkit";

const initialState = {};


export const gameDataSlice = createSlice({

    name: "gameData",

    initialState,

    reducers: {
        clear: () => initialState
    }

});


export const {
    clear
} = gameDataSlice.actions;


export default gameDataSlice.reducer;