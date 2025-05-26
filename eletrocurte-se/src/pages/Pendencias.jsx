import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import Header from "../components/Header";
import Card from "../components/Card";
import Question from "../components/Pendencias/Question";

const Pendencias = () => {
    const [questionsData, setQuestionsData] = useState(null);
    const categories = ["Desempenho", "Produtos", "Pendências"];

    useEffect(() => {
        fetch("/data/questions.json")
        .then(resp => {
            return resp.json();
        })
        .then(respData => {
            setQuestionsData(respData);
        })
    }, []);

    return(
        <div>
            <Header categories={categories} useElementsMenu={[true, false, true]} selectedCategoryIndex={2}/>
            <div className="content">
                <Card title={"Perguntas"} type={"card-vertical"}>
                    {questionsData && questionsData.questions.map((q) => {
                        return <Question data={q} />
                        //Unique key warning
                    })}
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default Pendencias;