import React from "react";
import "../styles/Card.css"

const Card = ({
    type,
    title,
    description = '',
    children,
    style
}) => {

    return(
        <div className="card-container" style={style}>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className={type}>
                {children}
            </div>
        </div>
    );
};

export default Card;