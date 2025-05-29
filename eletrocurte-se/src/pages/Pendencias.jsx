import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Card from "../components/Card";
import Question from "../components/Pendencias/Question";
import GenericInfoRedirect from "../components/Pendencias/GenericInfoRedirect";
import ProductCard from '../components/Produtos/ProductCard';
import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';

const Pendencias = () => {
    const [questionsData, setQuestionsData] = useState(null);
    const [complainingsData, setComplainingsData] = useState(null);
    const [soldData, setSoldData] = useState(null);
    const [serviceData, setServiceData] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetch("/data/questions.json")
        .then(resp => {
            return resp.json();
        })
        .then(respData => {
            setQuestionsData(respData.questions);
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

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };
    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    return(
        <div>
            <AdminHeader categoryIndex={2} />
            <div className="content">
                <Card title={"Perguntas"} type={"card-vertical"} style={{width: '80%'}} >
                    {questionsData && questionsData.map((q, idx) => {
                        return <Question data={q} key={q.id || idx} />
                    })}
                </Card>
                <Card 
                    title={"Reclamações"}
                    type={"card-vertical"}
                    description="Avaliações com 3 estrelas ou menos" 
                    style={{width: '80%'}} 
                >
                    {complainingsData && complainingsData.map((c, idx) => {
                        return <Question data={c} style={{backgroundColor: '#FFEDED'}} key={c.id || idx}/>
                    })}
                </Card>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }} >
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