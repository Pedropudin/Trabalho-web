import React from "react";
import Button from "../Button";
import "../../styles/GenericInfoRedirect.css"

const genericInfoRedirect = ({
    name,
    description = '',
    photo,
    buttonText = 'Saiba mais',
    buttonOnClick,
    style,
}) => {

    return(
        <div className="infoRedirect-container" style={style}>
            <img src={photo} style={{width: '40%'}} />
            <div className="infoRedirect-elements-container">
                <span className="element-name">{name}</span>
                <span className="element-description">{description}</span>
                <Button 
                    text={buttonText}
                    onClick={buttonOnClick}
                    type={1}
                />
            </div>
        </div>
   );
};

export default genericInfoRedirect;