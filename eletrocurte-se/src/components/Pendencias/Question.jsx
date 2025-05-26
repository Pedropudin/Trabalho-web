import React from "react";
import "../../styles/Question.css";

const Question = ({ data }) => {

    return(
        <div className="question-container">
            <img src={data.product_photo} width='120px' />
            <div className="question-product-info">
                <span className="product-name">{data.product_name}</span>
                <div>
                    <button>A</button>
                    <button>B</button>
                </div>
                <span className="question-date">{data.date}</span>
            </div>
            <div className="question-text">
                {data.question}
            </div>
            <div className="question-person-info"> 
                <span className="question-person-name">{data.person_name}</span>
                <img src={data.person_photo} width='90px' />
            </div>
        </div>
    );
}

export default Question;