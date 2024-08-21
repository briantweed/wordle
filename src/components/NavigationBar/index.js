import {useDispatch, useSelector} from "react-redux";
import {updateSetup} from "@storage/slices/gameSetupSlice";
import {DARK_MODE_THEME, DEFAULT_THEME, MAX_GUESS_ATTEMPTS, SUBMIT_ENTRY_KEYS} from "@config/general";
import {updateData} from "@storage/slices/gameDataSlice";
import useWordle from "@hooks/useWordle";


const NavigationBar = () => {

    const dispatch = useDispatch();

    const [generateWordle] = useWordle();

    const {theme} = useSelector((state) => state.gameSetup);

    const {
        wordle,
        streak,
        gameOver
    } = useSelector((state) => state.gameData);


    const updateTheme = () => {
        const newTheme = theme === DARK_MODE_THEME ? DEFAULT_THEME : DARK_MODE_THEME;
        dispatch(updateSetup({theme: newTheme}));
    }


    const handleKeypress = (event) => {
        if(SUBMIT_ENTRY_KEYS.includes(event.key)) {
            updateTheme();
        }
    }


    const startNewGame = () => {
        dispatch(updateData({
            guessedWords: [],
            remainingGuesses: MAX_GUESS_ATTEMPTS,
            correctLetters: [],
            wordle: generateWordle(),
            gameOver: false
        }))
    }


    return (
        <div className="nav">

            <div className="streak">Streak: {wordle ? streak : ""}</div>

            {gameOver && (
                <div className={"word"}>{ wordle }</div>
            )}

            {gameOver ? (
                <div className="reset">
                    <button
                        type={"button"}
                        id={"start"}
                        onClick={startNewGame}
                    >start</button>
                </div>
            ) : (
                <div className="theme">
                    <div
                        tabIndex="0"
                        aria-label={"toggle theme"}
                        role="button"
                        onClick={updateTheme}
                        onKeyDown={(event) => handleKeypress(event)}
                    >{theme === DARK_MODE_THEME ? <span>&#9788;</span> : <span>&#9789;</span>}</div>
                </div>
            )}

        </div>
    );

}


export default NavigationBar;