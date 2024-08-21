import {POSSIBLE_WORDS} from "@config/wordle";


const useWordle = () => {

    const generateWordle = () => {
        return POSSIBLE_WORDS[Math.floor(Math.random() * POSSIBLE_WORDS.length)];
    };

    return [generateWordle];

}


export default useWordle;