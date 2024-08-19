import {createSlice} from "@reduxjs/toolkit";
import {
    CLASS_NAMES,
    DEFAULT_THEME,
    DELETE_ENTRY_KEYS,
    KEYBOARD_LAYOUT,
    LOCAL_STORAGE_KEY,
    MAX_GUESS_ATTEMPTS,
    MAX_WORD_LENGTH,
    SUBMIT_ENTRY_KEYS
} from "@config/general";


const initialState = {

    testWord: null,

    localStorageKey: LOCAL_STORAGE_KEY,

    maxWordLength: MAX_WORD_LENGTH,

    maxGuessAttempts: MAX_GUESS_ATTEMPTS,

    deleteEntryKeys: DELETE_ENTRY_KEYS,

    submitKeyEntries: SUBMIT_ENTRY_KEYS,

    keyboardLayout: KEYBOARD_LAYOUT,

    keyboardCharacters: KEYBOARD_LAYOUT.flat(),

    styles: CLASS_NAMES,

    theme: DEFAULT_THEME

};


export const gameDataSlice = createSlice({

    name: "gameSetup",

    initialState,

    reducers: {
        clear: () => initialState
    }

});


export const {
    clear
} = gameDataSlice.actions;


export default gameDataSlice.reducer;