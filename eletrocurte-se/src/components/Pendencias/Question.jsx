import React from "react";
import Button from "../Button";
import "../../styles/Question.css";

const Question = ({ data }) => {

    return(
        <div className="question-container">
            <img src={data.product_photo} style={{width: '10%'}} />
            <div className="question-product-info">
                <span className="product-name">{data.product_name}</span>
                <div className="question-buttons-container">
                    <Button type={1} text="Responder" />
                    <Button type={1} text="Ver produto" />
                </div>
                <span className="question-date">{data.date}</span>
            </div>
            <div className="question-text">
                {data.question}
            </div>
            <div className="question-person-info">
                <span className="question-person-name">{data.person_name}</span>
                <img src={data.person_photo} style={{height: '80%'}} />
            </div>
        </div>
    );
}

export default Question;