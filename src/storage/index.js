import {configureStore} from "@reduxjs/toolkit";
import gameSetupReducer from "@storage/slices/gameSetupSlice";
import gameDataReducer from "@storage/slices/gameDataSlice";


export default configureStore({

    reducer: {
        gameSetup: gameSetupReducer,
        gameData: gameDataReducer
    }

});