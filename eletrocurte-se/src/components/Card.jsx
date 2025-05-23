import React from "react";
import "../styles/Card.css"

const Card = ({ type, title, children}) => {

    return(
        <div className="card-container">
            <h1>{title}</h1>
            <div className={type}>
                {children}
            </div>
        </div>
    );
};

export default Card;