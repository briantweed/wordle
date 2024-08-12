import {configureStore} from "@reduxjs/toolkit";
import gameDataReducer from "@storage/slices/gameDataSlice";


export default configureStore({

    reducer: {
        gameData: gameDataReducer
    }

});