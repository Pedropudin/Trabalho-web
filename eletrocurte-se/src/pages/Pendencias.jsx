import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Card from "../components/Card";
import Question from "../components/Pendencias/Question";
import GenericInfoRedirect from "../components/Pendencias/GenericInfoRedirect";
import ReactPaginate from 'react-paginate';

import "../styles/Pendencias.css";

const Pendencias = () => {
    const [questionsData, setQuestionsData] = useState(null);
    const [answersData, setAnswersData] = useState({});
    const [complainingsData, setComplainingsData] = useState(null);
    const [soldData, setSoldData] = useState(null);
    const [serviceData, setServiceData] = useState(null);

    const [usePagination,setUsePagination] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 5;

    useEffect(() => {
        fetch("/data/questions.json")
        .then(resp => {
            return resp.json();
        })
        .then(respData => {
            setQuestionsData(respData.questions);
            setAnswersData(Array(respData.questions.length))
            if(respData.questions.length > questionsPerPage) {
                setUsePagination(true);
            }
        })
    }, []);

    useEffect(() => {
        fetch("/data/reviews.json")
        .then(resp => {
            return resp.json();
        })
        .then(respData => {
            setComplainingsData(respData.reviews);
        })
    }, []);

    useEffect(() => {
        fetch("/data/soldProducts.json")
        .then(resp => {
            return resp.json();
        })
        .then(respData => {
            setSoldData(respData.soldProducts);
        })
    }, []);

    useEffect(() => {
        fetch("/data/services.json")
        .then(resp => {
            return resp.json();
        })
        .then(respData => {
            setServiceData(respData.services);
        })
    }, []);

    // Calculate the questions to display for the current page
    const offset = currentPage * questionsPerPage;
    const currentQuestions = questionsData ? questionsData.slice(offset, offset + questionsPerPage) : [];

    // Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswersData(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    return(
        <div>
            <AdminHeader categoryIndex={2} />
            <div className="content">
                <Card title={"Perguntas"} type={"card-vertical"} >
                    {currentQuestions.map((q) => {
                        return <Question
                            key={q.id}
                            data={q}
                            style={{width: '1000px'}}
                            answer={answersData[q.id] || ""}
                            onAnswerChange={value => handleAnswerChange(q.id, value)}
                        />
                        })}
                </Card>
                {questionsData && usePagination && <ReactPaginate
                    pageCount={Math.ceil(questionsData.length / questionsPerPage)}
                    onPageChange={handlePageChange}
                    previousLabel="Anterior"
                    nextLabel="Próxima"
                    containerClassName="questions-pagination"
                    activeClassName="active"
                /> }
                <Card 
                    title={"Reclamações"}
                    type={"card-vertical"}
                    description="Avaliações com 3 estrelas ou menos" 
                >
                    {complainingsData && complainingsData.map((c) => {
                        return <Question data={c} style={{backgroundColor: '#FFEDED', width: '1000px'}}/>
                    })}
                </Card>
                <div style={{
                    display: 'flex',
                    gap: '20px'
                }} >
                    <Card
                        title={"Envios pendentes"}
                        description="Produtos que esperam para serem despachados"
                        type={"card-vertical"}
                    >
                        {soldData && soldData.map((s) => {
                            return <GenericInfoRedirect 
                                photo={s.product_photo}
                                name={s.product_name} 
                                description={s.delivery_city + " - " + s.delivery_state}
                                buttonText="Ver detalhes"
                                buttonOnClick={() => {console.log("Viu só")}}
                                style={{width: '350px'}}
                            />
                        })}
                    </Card>
                    <Card
                        title={"Atendimentos"}
                        description="Conversas com clientes não finalizadas"
                        type={"card-vertical"}
                    >
                        {serviceData && serviceData.map((s) => {
                            return <GenericInfoRedirect 
                                photo={s.person_photo}
                                name={s.name} 
                                description={s.person_name}
                                buttonText="Abrir email"
                                style={{width: '400px'}}
                            />
                        })}
                    </Card>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Pendencias;