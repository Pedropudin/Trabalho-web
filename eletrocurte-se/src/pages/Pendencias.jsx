import React, { useState, useEffect, use } from "react";
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Card from "../components/Card";
import Question from "../components/Pendencias/Question";
import GenericInfoRedirect from "../components/Pendencias/GenericInfoRedirect";
import ProductCard from '../components/Produtos/ProductCard';
import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';
import ReactPaginate from 'react-paginate';

import "../styles/Pagination.css";

const Pendencias = () => {
    const [questionsData, setQuestionsData] = useState(null);
    const [answersData, setAnswersData] = useState({});
    const [answersCompData, setAnswersCompData] = useState({});
    const [complainingsData, setComplainingsData] = useState(null);
    const [soldData, setSoldData] = useState(null);
    const [serviceData, setServiceData] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [usePagination,setUsePagination] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 5;

    const [usePaginationComp, setUsePaginationComp] = useState(false);
    const [currentPageComp, setCurrentPageComp] = useState(0);
    const questionsPerPageComp = 5;

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
            setAnswersCompData(Array(respData.reviews.length));
            if(respData.reviews.length > questionsPerPageComp) {
                setUsePaginationComp(true);
            }
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

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    }

    // Calculate the questions to display for the current page
    const offset = currentPage * questionsPerPage;
    const currentQuestions = questionsData ? questionsData.slice(offset, offset + questionsPerPage) : [];

    const offsetComp = currentPageComp * questionsPerPageComp;
    const currentQuestionsComp = complainingsData ? complainingsData.slice(offsetComp, offsetComp + questionsPerPageComp) : [];

    // Handle page change
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handlePageChangeComp = ({ selected }) => {
        setCurrentPageComp(selected);
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswersData(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleAnswerChangeComp = (questionId, value) => {
        setAnswersCompData(prev => ({
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
                    {currentQuestionsComp.map((q) => {
                        return <Question 
                            data={q}
                            style={{backgroundColor: '#FFEDED', width: '1000px'}}
                            answer={answersCompData[q.id] || ""}
                            onAnswerChange={value => handleAnswerChangeComp(q.id, value)}
                        />
                    })}
                </Card>
                {complainingsData && usePaginationComp && <ReactPaginate
                    pageCount={Math.ceil(complainingsData.length / questionsPerPageComp)}    
                    onPageChange={handlePageChangeComp}
                    previousLabel="Anterior"
                    nextLabel="Próxima"
                    containerClassName="questions-pagination"
                    activeClassName="active"
                /> }
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap'
                }} >
                    <Card
                        title={"Envios pendentes"}
                        description="Produtos que esperam para serem despachados"
                        type={"card-vertical"}
                    >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        {soldData && soldData.map((s, idx) => (
                            <div key={s.product_name + idx} style={{ minWidth: 220, maxWidth: 300 }}>
                                <ProductCard 
                                    product={{
                                        nome: s.product_name,
                                        preco: s.product_price,
                                        imagem: s.product_photo,
                                        cidade: s.delivery_city,
                                        estado: s.delivery_state
                                    }}
                                    onClick={handleProductClick}
                                    showBuyButton={false}
                                />
                            </div>
                        ))}
                        </div>
                    </Card>
                    <Card
                        title={"Atendimentos"}
                        description="Conversas com clientes não finalizadas"
                        type={"card-vertical"}
                    >
                        {serviceData && serviceData.map((s, idx) => {
                            return <GenericInfoRedirect 
                                photo={s.person_photo}
                                name={s.name} 
                                description={s.person_name}
                                buttonText="Abrir email"
                                style={{width: '400px'}}
                                key={s.id || idx}
                            />
                        })}
                    </Card>
                </div>
            </div>
            <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
            <Footer />
        </div>
    );
};

export default Pendencias;