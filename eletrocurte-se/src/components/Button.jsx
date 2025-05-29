import React from "react";
import "../styles/Button.css";

const Button = ({
    text = "Botão",
    onClick,
    type = 0,
}) => {

    switch (type) {
        case 1:
            return(
                <button className="btn-type1" onClick={onClick}>{text}</button>
            );
        default:
            return(
                <button className="btn-generic" onClick={onClick}>{text}</button>
            );
    }
};

export default Button;