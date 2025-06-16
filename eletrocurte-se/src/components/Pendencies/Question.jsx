import React, { useState } from "react";
import Button from "../Button";
import MessageAlert from "../MessageAlert";
import { useNavigate } from "react-router-dom";
import ROUTES from "../../routes";
import "../../styles/Question.css";

const Answer = ({ value, change, submit }) => {
    return(
        <div className="answer-container">
            <span style={{fontWeight: 'bold'}} >Your Answer:</span>
            <textarea rows={5} cols={50} className="answer-box" value={value} onChange={e => change(e.target.value)}/>
            <Button text={"Send"} onClick={submit} type={1} style={{marginTop: '10px'}}/>
        </div>
    );
};

const Question = ({ data, style, answer, onAnswerChange }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useNavigate();

    const handleAnswer = () => {
        setShowAnswer(!showAnswer);
    }

    const handleRedirectProduct = () => {
        if (data.product_id) {
            navigate(ROUTES.PRODUCT_PAGE.replace(":id", data.product_id));
        } else {
            alert("Does nothing here");
        }
    };

    const handleSubmit = () => {
        onAnswerChange(""); // Clear answer after submit if you want
        setShowConfirmation(true);
        setShowAnswer(false);
        setTimeout(() => {setShowConfirmation(false)}, 2000);
    };

    return(
        <div>
            {showConfirmation && <MessageAlert message={"Resposta enviada"} />}
            <div className="question-container" style={style} >
                {data.product_photo && data.product_photo !== "" ? (
                  <img src={data.product_photo} alt={data.product_name || "Produto"} style={{width: '10%'}} />
                ) : (
                  <img src="/logo-sem-borda.png" alt="Logo" style={{width: '10%'}} />
                )}
                <div className="question-product-info">
                    <span className="product-name">{data.product_name}</span>
                    <div className="question-buttons-container">
                        <Button type={1} text="Answer" onClick={handleAnswer}/>
                        <Button type={1} text="Check product" onClick={handleRedirectProduct}/>
                    </div>
                    <span className="question-date">{data.date}</span>
                </div>
                <div className="question-text">
                    {data.question}
                </div>
                <div className="question-person-info">
                    <span className="question-person-name">{data.person_name}</span>
                    {data.person_photo && data.person_photo !== "" ? (
                      <img src={data.person_photo} alt={data.person_name || "Pessoa"} style={{height: '80%'}} />
                    ) : (
                      <img src="/logo-sem-borda.png" alt="Logo" style={{height: '80%'}} />
                    )}
                </div>
            </div>
            {showAnswer && <Answer value={answer} change={onAnswerChange} submit={handleSubmit} />}
        </div>
    );
}

export default Question;