import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Footer from "../components/Footer";
import AdminHeader from "../components/admin/AdminHeader";
import Card from "../components/Card";
import Question from "../components/Pendencias/Question";
import GenericInfoRedirect from "../components/Pendencias/GenericInfoRedirect";

const Pendencias = () => {
    const [questionsData, setQuestionsData] = useState(null);
    const [complainingsData, setComplainingsData] = useState(null);
    const [soldData, setSoldData] = useState(null);
    const [serviceData, setServiceData] = useState(null);

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

    return(
        <div>
            <AdminHeader categoryIndex={2} />
            <div className="content">
                <Card title={"Perguntas"} type={"card-vertical"} style={{width: '80%'}} >
                    {questionsData && questionsData.map((q) => {
                        return <Question data={q} />
                        //Unique key warning
                    })}
                </Card>
                <Card 
                    title={"Reclamações"}
                    type={"card-vertical"}
                    description="Avaliações com 3 estrelas ou menos" 
                    style={{width: '80%'}} 
                >
                    {complainingsData && complainingsData.map((c) => {
                        return <Question data={c} style={{backgroundColor: '#FFEDED'}}/>
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