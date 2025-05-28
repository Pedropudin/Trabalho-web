import React from "react";
import "../../styles/DataDescription.css";

const DataDescription = ({ 
    value, 
    valueColor="#575756", 
    description,
    newStyle
}) => {

    return(
        <div className="data-description" style={newStyle}>
            <span className="data"style={{'color': valueColor}} >{value}</span>
            <span className="description">{description}</span>
        </div>
    );
};

export default DataDescription;