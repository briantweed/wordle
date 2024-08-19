import {createSlice} from "@reduxjs/toolkit";


const initialState = {

    wordle: "",

    gameOver: false,

    currentGuess: [],

    guessedLetters: [],

    correctLetters: [],

    guessedWords: [],

    remainingGuesses: 6,

    stats: [],

    streak: 0,

    errorClass: ""

};


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