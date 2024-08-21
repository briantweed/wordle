import {useEffect} from "react";
import {useSelector} from "react-redux";


const GameBoard = (props) => {

    const {children} = props;

    const {
        theme
    } = useSelector((state) => state.gameSetup);


    useEffect(() => {
        document.querySelector("body").classList.value = "";
        return () => {
            document.querySelector("body").classList.value = "";
        }
    }, [theme]);


    return (
        <div
            className={`gameBoard ${theme}`}
        >{ children }</div>
    );

}


export default GameBoard;