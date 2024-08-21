import {useSelector} from "react-redux";
import {MAX_WORD_LENGTH} from "@config/general";


const Guesses = () => {

    const {
        stats,
        guessedWords,
        remainingGuesses,
        currentGuess,
        errorClass,
        gameOver
    } = useSelector((state) => state.gameData);


    return (
        <div className="guesses">
            {guessedWords.map((word, index) => {
                word = word.split("");
                return (
                    <div key={index} className={`guess`}>
                        {[...Array(MAX_WORD_LENGTH)].map((letter, pos) => {
                            let className = stats[index] !== undefined && [pos] !== undefined ? stats[index][pos] : "";
                            return (
                                <div className={`letter flip ${className}`}
                                     key={pos}>{word[pos] ? word[pos].toUpperCase() : ""}</div>
                            );
                        })}
                    </div>
                );
            })}

            {remainingGuesses > 0 && (
                <>
                    <div
                        className={`guess ${gameOver ? "" : "current"} ${remainingGuesses === 1 ? "eek" : ""} ${errorClass}`}>
                        {[...Array(MAX_WORD_LENGTH)].map((letter, index) => {
                            return (
                                <div className={"letter"}
                                     key={index}>{currentGuess[index] ? currentGuess[index].toUpperCase() : ""}</div>
                            );
                        })}
                    </div>
                    {[...Array(remainingGuesses - 1)].map((word, index) => {
                        return (
                            <div key={index} className={`guess`}>
                                {[...Array(MAX_WORD_LENGTH)].map((letter, index) => {
                                    return (
                                        <div className={"letter"} key={index}/>
                                    );
                                })}
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );

}


export default Guesses;