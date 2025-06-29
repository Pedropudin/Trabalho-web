import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Card from "../components/Card";
import Question from "../components/Pendencies/Question";
import GenericInfoRedirect from "../components/Pendencies/GenericInfoRedirect";
import ProductCard from '../components/Products/ProductCard';
import ProductDetailsModal from '../components/Products/ProductDetailsModal';
import ReactPaginate from 'react-paginate';
import "../styles/Pagination.css";

const Pending = () => {
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
            <AdminHeader categoryIndex={1} />
            <div className="content">
                <Card title={"Questions"} type={"card-vertical"} >
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
                    previousLabel="Previous"
                    nextLabel="Next"
                    containerClassName="questions-pagination"
                    activeClassName="active"
                /> }
                <Card 
                    title={"Complainings"}
                    type={"card-vertical"}
                    description="Reviews with 3 or more stars" 
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
                    previousLabel="Previous"
                    nextLabel="Next"
                    containerClassName="questions-pagination"
                    activeClassName="active"
                /> }
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    flexWrap: 'wrap'
                }} >
                    <Card
                        title={"Pending Shipments"}
                        description="Products waiting to be sent"
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
                        title={"Services"}
                        description="Unfinished client chats"
                        type={"card-vertical"}
                    >
                        {serviceData && serviceData.map((s, idx) => {
                            return <GenericInfoRedirect 
                                photo={s.person_photo}
                                name={s.name} 
                                description={s.person_name}
                                buttonText="Open email"
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

export default Pending;