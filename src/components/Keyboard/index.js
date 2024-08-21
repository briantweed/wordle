import {KEYBOARD_LAYOUT} from "@config/general";
import {useSelector} from "react-redux";
import {useEffect} from "react";


const Keyboard = () => {

    const {
        guessedLetters,
        correctLetters
    } = useSelector((state) => state.gameData);


    const handleKeySelect = (letter) => {
        console.log(letter);
    }


    const getKeyCode = (event) => {
        handleKeySelect(event.key.toLowerCase());
    }


    useEffect(() => {
        document.addEventListener("keydown", getKeyCode);
        return () => document.removeEventListener("keydown", getKeyCode);
    }, [getKeyCode]);


    return (
        <div className="keyboard">
            {KEYBOARD_LAYOUT.map((row, index) => {
                return (
                    <div key={index} className="keyboard-row">
                        {row.map((letter) => {
                                const guessed = guessedLetters.includes(letter);
                                const correct = correctLetters.find(item => item.letter === letter) ?? {};
                                return (
                                    <button
                                        type={"button"}
                                        key={`${letter}`}
                                        data-key={letter}
                                        className={`keyboard-letter ${guessed ? "used" : ""} ${correct.className}`}
                                        onClick={() => handleKeySelect(letter)}
                                    >{letter}</button>
                                );
                            }
                        )}
                    </div>
                );
            })}
        </div>
    );

}


export default Keyboard;