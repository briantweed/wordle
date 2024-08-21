import {createSlice} from "@reduxjs/toolkit";
import {MAX_GUESS_ATTEMPTS} from "@config/general";


const initialState = {

    wordle: "",

    gameOver: false,

    currentGuess: [],

    guessedLetters: [],

    correctLetters: [],

    guessedWords: [],

    remainingGuesses: MAX_GUESS_ATTEMPTS,

    stats: [],

    streak: 0,

    errorClass: ""

};


export const gameDataSlice = createSlice({

    name: "gameData",

    initialState,

    reducers: {
        clearData: () => initialState
    }

});


export const {
    clearData
} = gameDataSlice.actions;


export default gameDataSlice.reducer;