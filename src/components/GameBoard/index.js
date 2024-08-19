import {useEffect, useState} from "react";
import {DEFAULT_THEME} from "@config/general";


const GameBoard = (props) => {

    const {children} = props;

    const [theme, setTheme] = useState(DEFAULT_THEME);


    useEffect(() => {
        const theme = localStorage.getItem("theme") ?? DEFAULT_THEME;

        setTheme(theme);
        document.querySelector("body").classList.value = theme;

        return () => {
            document.querySelector("body").classList.value = "";
        }

    }, []);


    return (
        <div
            className={`gameBoard ${theme}`}
        >{ children }</div>
    );

}


export default GameBoard;