import {useEffect, useMemo, useState} from "react";
import {WORD_LIST} from "@config/wordle";
import confetti from "canvas-confetti";
import {KEYBOARD_LAYOUT, MAX_GUESS_ATTEMPTS, MAX_WORD_LENGTH} from "@config/general";
import GameBoard from "@components/GameBoard";
import NavigationBar from "@components/NavigationBar";
import {useDispatch} from "react-redux";
import {updateData} from "@storage/slices/gameDataSlice";
import useWordle from "@hooks/useWordle";
import Keyboard from "@components/Keyboard";
import Guesses from "@components/Guesses";


const Wordle = () => {

    const dispatch = useDispatch();

    const [generateWordle] = useWordle();

    const LOCAL_STORAGE_KEY = "wordiddily-streak";

    const DELETE_KEY_ENTRIES = useMemo(() => ["<", "backspace", "delete"], []);

    const SUBMIT_KEY_ENTRIES = useMemo(() => ["enter", " "], []);


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


    const fireTheCannons = () => {
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: {y: 0.5}
            });
        }, 900);
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


    useEffect(() => {
        setWordle(generateWordle());
        const currentStreak = Number(localStorage.getItem(LOCAL_STORAGE_KEY)) ?? 0;
        setStreak(currentStreak);
    }, []);


    useEffect(() => {
        if (streak > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, streak.toString());
        }
    }, [streak])





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
                dispatch(updateData({
                    gameOver: true
                }));
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
            dispatch(updateData({
                gameOver: true
            }));
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
        <GameBoard>

            <NavigationBar/>

            <Guesses/>

            <Keyboard/>

        </GameBoard>
    );

}


export default Wordle;