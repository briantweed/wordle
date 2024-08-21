import {useDispatch, useSelector} from "react-redux";
import {updateSetup} from "@storage/slices/gameSetupSlice";
import {DARK_MODE_THEME, DEFAULT_THEME, SUBMIT_ENTRY_KEYS} from "@config/general";


const NavigationBar = () => {

    const dispatch = useDispatch();

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