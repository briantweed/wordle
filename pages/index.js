import {useEffect, useMemo, useState} from "react";
import {WORD_LIST, POSSIBLE_WORDS} from "@config/wordle";
import confetti from "canvas-confetti";


const Wordle = () => {

    const TEST_WORD = null;

    const LOCAL_STORAGE_KEY = "wordiddily-streak";

    const MAX_WORD_LENGTH = 5;

    const MAX_GUESS_ATTEMPTS = 6;

    const DELETE_KEY_ENTRIES = useMemo(() => ["<", "backspace", "delete"], []);

    const SUBMIT_KEY_ENTRIES = useMemo(() => ["enter", " "], []);

    const KEYBOARD_LAYOUT = useMemo(() => [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["enter", "z", "x", "c", "v", "b", "n", "m", "<"]
    ], []);

    const CLASS_NAMES = {
        ERROR: "error",
        PRESSED: "pressed",
        PASSED: "pass",
        PLACED: "placed",
        PRESENT: "present"
    }

    const keyboardCharacters = KEYBOARD_LAYOUT.flat();

    const [wordle, setWordle] = useState("");

    const [currentGuess, setCurrentGuess] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]);

    const [correctLetters, setCorrectLetters] = useState([]);

    const [guessedWords, setGuessedWords] = useState([]);

    const [remainingGuesses, setRemainingGuesses] = useState(MAX_GUESS_ATTEMPTS);

    const [stats, setStats] = useState([]);

    const [streak, setStreak] = useState(0);

    const [errorClass, setErrorClass] = useState("");

    const [gameOver, setGameOver] = useState(false);

    const [theme, setTheme] = useState("");


    const fireTheCannons = () => {
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: {y: 0.5}
            });
        }, 900);
    }

    const getWordle = () => {
        return TEST_WORD ?? POSSIBLE_WORDS[Math.floor(Math.random() * POSSIBLE_WORDS.length)];
    }


    const getKeyCode = (event) => {
        handleKeySelect(event.key.toLowerCase());
    }


    const handleKeySelect = (selectedKey) => {
        if (gameOver) return;
        if (DELETE_KEY_ENTRIES.includes(selectedKey)) {
            deleteLastKey();
        } else if (SUBMIT_KEY_ENTRIES.includes(selectedKey)) {
            if (currentGuess.length === MAX_WORD_LENGTH) {
                handleGuessedWord();
            }
        } else if (keyboardCharacters.includes(selectedKey) && currentGuess.length < MAX_WORD_LENGTH) {
            addSelectedKey(selectedKey);
        }
    }


    const addSelectedKey = (selection) => {
        setCurrentGuess([...currentGuess, selection]);
    }


    const deleteLastKey = () => {
        setCurrentGuess(currentGuess.slice(0, -1));
    }


    const handleGuessedWord = () => {
        const guessedWord = currentGuess.join("");
        if (!WORD_LIST.includes(guessedWord)) {
            setErrorClass(CLASS_NAMES.ERROR);
        } else {
            setCurrentGuess([]);
            setRemainingGuesses(MAX_GUESS_ATTEMPTS - (guessedWords.length + 1));
            setGuessedWords([...guessedWords, guessedWord]);
        }
    }


    const highlightSelectedKeys = () => {
        clearSelectedKeys();
        currentGuess.forEach(guess => {
            document.querySelector(`[data-key="${guess}"]`).classList.add(CLASS_NAMES.PRESSED);
        });
    }


    const clearSelectedKeys = () => {
        [...document.querySelectorAll("[data-key]")].forEach((key) => {
            key.classList.remove(CLASS_NAMES.PRESSED);
        });
    };


    const handleReset = () => {
        setGuessedWords([]);
        setRemainingGuesses(MAX_GUESS_ATTEMPTS);
        setCorrectLetters([]);
        setWordle(getWordle());
        setGameOver(false);
    };


    const updateTheme = () => {
        const updatedTheme = theme === "dark" ? "" : "dark";
        setTheme(updatedTheme);
        localStorage.setItem("theme", updatedTheme);
    }


    useEffect(() => {
        setWordle(getWordle());
        const currentStreak = Number(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? 0;
        const theme = localStorage.getItem("theme") ?? "";
        setStreak(currentStreak);
        setTheme(theme);
    }, []);


    useEffect(() => {
        if (streak > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, streak.toString());
        }
    }, [streak])


    useEffect(() => {
        document.addEventListener("keydown", getKeyCode);
        return () => document.removeEventListener("keydown", getKeyCode);
    }, [getKeyCode]);


    useEffect(() => {
        highlightSelectedKeys();
        setErrorClass("");
    }, [currentGuess]);


    useEffect(() => {
        if (guessedWords.length > 0) {
            const results = [...Array(MAX_WORD_LENGTH).fill(CLASS_NAMES.PASSED)];
            const wordleLetters = wordle.split("");
            let availableLetters = [...wordleLetters];
            let keyboardHighlights = [...correctLetters];
            const currentGuess = guessedWords.slice(-1)[0].split("");

            currentGuess.forEach((guess, index) => {
                if (guess === wordleLetters[index]) {
                    results[index] = CLASS_NAMES.PLACED;
                    const idx = availableLetters.findIndex(letter => letter === guess);
                    availableLetters.splice(idx, 1);
                    keyboardHighlights = [
                        ...keyboardHighlights.filter(item => item.letter !== guess),
                        {
                            letter: guess,
                            className: CLASS_NAMES.PLACED
                        }
                    ];
                }
            });

            currentGuess.forEach((guess, index) => {
                if (results[index] !== CLASS_NAMES.PLACED) {
                    if (availableLetters.includes(guess)) {
                        results[index] = CLASS_NAMES.PRESENT;
                        const idx = availableLetters.findIndex(letter => letter === guess);
                        availableLetters.splice(idx, 1);
                        keyboardHighlights = [
                            ...keyboardHighlights,
                            {
                                letter: guess,
                                className: CLASS_NAMES.PRESENT
                            }
                        ];
                    }
                }
            });

            if (results.every(val => val === CLASS_NAMES.PLACED)) {
                setGameOver(true);
                setStreak(streak + 1);
                fireTheCannons();
            } else if (guessedWords.length >= MAX_GUESS_ATTEMPTS) {
                setStreak(0);
            }
            setCorrectLetters(keyboardHighlights);
            setStats([...stats, results]);
        } else {
            setStats([]);
        }
    }, [guessedWords]);


    useEffect(() => {
        clearSelectedKeys();
        setGuessedLetters([...new Set([...guessedWords.toString().split("")])]);
    }, [stats]);


    useEffect(() => {
        if (remainingGuesses <= 0) {
            setGameOver(true);
        } else if (remainingGuesses === 1 && !gameOver) {
            localStorage.setItem(LOCAL_STORAGE_KEY, "0");
        }
    }, [remainingGuesses]);


    useEffect(() => {
        if (gameOver) {
            const startButton = document.getElementById("start");
            if (startButton) {
                startButton.focus();
            }
        }
    }, [gameOver]);


    return (
        <div id="wordle" className={theme}>

            <div className="nav">
                <div className="streak">Streak: {wordle ? streak : ""}</div>
                {gameOver && <div className={"word"}>{wordle}</div>}
                {gameOver ? (
                    <div className="reset">
                        <button type={"button"} id={"start"} onClick={handleReset}>start</button>
                    </div>
                ) : (
                    <div className="theme">
                        <div tabIndex="0" aria-label={"toggle theme"} role="button" onClick={updateTheme}>{theme === "dark" ? <span>&#9788;</span> : <span>&#9789;</span>}</div>
                    </div>
                )}
            </div>

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
                                            key={letter}
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

        </div>
    );

}


export default Wordle;