import React from "react";
import "../styles/MessageAlert.css"

const MessageAlert = ({ message, style}) => {
    return(
        <div className="message-show-info" style={style}>
            {message}
        </div>
    );
};

export default MessageAlert;