import {useEffect, useMemo, useState} from "react";
import {WORD_LIST, POSSIBLE_WORDS} from "@config/wordle";
import Head from "next/head";


const Wordle = () => {

    const TEST_WORD = null;

    const MAX_WORD_LENGTH = 5;

    const MAX_GUESS_ATTEMPTS = 6;

    const DELETE_KEY_ENTRIES = useMemo(() => ["<", "backspace", "delete"], []);

    const SUBMIT_KEY_ENTRIES = useMemo(() => ["enter", " "], []);

    const KEYBOARD_LAYOUT = useMemo(() => [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["<", "z", "x", "c", "v", "b", "n", "m", "enter"]
    ], []);

    const keyboardCharacters = KEYBOARD_LAYOUT.flat();

    const [wordle, setWordle] = useState("");

    const [currentGuess, setCurrentGuess] = useState([]);

    const [guessedLetters, setGuessedLetters] = useState([]);

    const [guessedWords, setGuessedWords] = useState([]);

    const [remainingGuesses, setRemainingGuesses] = useState(MAX_GUESS_ATTEMPTS);

    const [stats, setStats] = useState([]);

    const [streak, setStreak] = useState(0);

    const [errorClass, setErrorClass] = useState("");

    const [gameOver, setGameOver] = useState(false);


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
            setErrorClass("error");
        } else {
            setGuessedWords([...guessedWords, guessedWord]);
        }
    }


    const highlightSelectedKeys = () => {
        clearSelectedKeys();
        currentGuess.forEach(guess => {
            document.querySelector(`[data-key="${guess}"]`).classList.add('pressed');
        });
    }


    const clearSelectedKeys = () => {
        [...document.querySelectorAll("[data-key]")].forEach((key) => {
            key.classList.remove("pressed");
        });
    };


    const handleReset = () => {
        setGuessedWords([]);
        setWordle(getWordle());
        setGameOver(false);
    };


    useEffect(() => {
        setWordle(getWordle());
    }, []);


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
            const results = [...Array(MAX_WORD_LENGTH).fill("pass")];
            const wordleLetters = wordle.split("");
            let availableLetters = [...wordleLetters];

            currentGuess.forEach((guess, index) => {
                if (guess === wordleLetters[index]) {
                    results[index] = "placed";
                    const idx = availableLetters.findIndex(letter => letter === guess);
                    availableLetters.splice(idx, 1)
                }
            });

            currentGuess.forEach((guess, index) => {
                if (results[index] !== "placed") {
                    if (availableLetters.includes(guess)) {
                        results[index] = "present";
                        const idx = availableLetters.findIndex(letter => letter === guess);
                        availableLetters.splice(idx, 1);
                    }
                }
            });

            if (results.every(val => val === "placed")) {
                setGameOver(true);
                setStreak(streak + 1);
            }
            setStats([...stats, results]);

        } else {
            setStats([]);
        }
    }, [guessedWords]);


    useEffect(() => {
        clearSelectedKeys();
        setGuessedLetters([...new Set([...guessedWords.toString().split("")])]);
        setCurrentGuess([]);
        setRemainingGuesses(MAX_GUESS_ATTEMPTS - guessedWords.length);
    }, [stats]);


    useEffect(() => {
        if (remainingGuesses <= 0) {
            setGameOver(true);
        }
    }, [remainingGuesses]);


    return (
        <div id="wordle">

            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
                <link rel="manifest" href="/site.webmanifest"/>
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
                <meta name="msapplication-TileColor" content="#2b5797"/>
                <meta name="theme-color" content="#ffffff"/>
                <link rel="preconnect" href="https://fonts.google.com"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Salsa&display=swap"
                    rel="stylesheet"/>
            </Head>

            <div className="nav">
                <div className="streak" title={wordle}>Streak: {streak}</div>
                {gameOver && <div className={"word"}>{wordle}</div>}
                {gameOver && <button type={"button"} className={"reset"} onClick={handleReset}>new game</button>}
            </div>

            <div className="guesses">
                {guessedWords.map((word, index) => {
                    word = word.split("");
                    return (
                        <div key={index} className={`guess`}>
                            {[...Array(MAX_WORD_LENGTH)].map((letter, pos) => {
                                let className = stats[index] !== undefined && [pos] !== undefined ? stats[index][pos] : "";
                                return (
                                    <div className={`letter roboto-medium ${className}`}
                                         key={pos}>{word[pos] ? word[pos].toUpperCase() : ""}</div>
                                );
                            })}
                        </div>
                    );
                })}

                {remainingGuesses > 0 && (
                    <>
                        <div className={`guess current ${errorClass}`} title={errorClass ? "not a word" : ""}>
                            {[...Array(MAX_WORD_LENGTH)].map((letter, index) => {
                                return (
                                    <div className={"letter"} key={index}>{currentGuess[index] ? currentGuess[index].toUpperCase() : ""}</div>
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
                                    const used = guessedLetters.includes(letter);
                                    return (
                                        <button
                                            type={"button"}
                                            key={letter}
                                            data-key={letter}
                                            className={`keyboard-letter ${used ? "used" : ""}`}
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