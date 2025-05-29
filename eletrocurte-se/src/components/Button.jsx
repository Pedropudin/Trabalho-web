import React from "react";
import "../styles/Button.css";

const Button = ({
    text = "Botão",
    onClick,
    type = 0,
    style,
}) => {

    switch (type) {
        case 1:
            return(
                <button className="btn-type1" onClick={onClick} style={style}>{text}</button>
            );
        default:
            return(
                <button className="btn-generic" onClick={onClick} style={style}>{text}</button>
            );
    }
};

export default Button;