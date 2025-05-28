import React, { use, useState } from "react";
import Button from "../Button";
import MessageAlert from "../MessageAlert";

import "../../styles/Question.css";

const Answer = ({ value, change, submit }) => {

    return(
        <div className="answer-container">
            <span style={{fontWeight: 'bold'}} >Sua resposta:</span>
            <textarea rows={5} cols={50} className="answer-box" value={value} onChange={e => change(e.target.value)}/>
            <Button text={"Enviar"} onClick={submit} type={1} style={{marginTop: '10px'}}/>
        </div>
    );
};

const Question = ({ data, style }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [answerText, setAnswerText] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleAnswer = () => {
        setShowAnswer(!showAnswer);
    }

    const handleRedirectProduct = () => {
        alert("Faz nada ainda");
    };

    const handleSubmit = () => {
        setAnswerText("");
        setShowConfirmation(true);
        setShowAnswer(false);
        setTimeout(() => {setShowConfirmation(false)}, 2000);
    };

    return(
        <div>
            {showConfirmation && <MessageAlert message={"Resposta enviada"} />}
            <div className="question-container" style={style} >
                <img src={data.product_photo} style={{width: '10%'}} />
                <div className="question-product-info">
                    <span className="product-name">{data.product_name}</span>
                    <div className="question-buttons-container">
                        <Button type={1} text="Responder" onClick={handleAnswer}/>
                        <Button type={1} text="Ver produto" onClick={handleRedirectProduct}/>
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
            {showAnswer && <Answer value={answerText} change={e => setAnswerText(e)} submit={handleSubmit} />}
        </div>
    );
}

export default Question;