import React from 'react';
import Header from '../components/Header';
import ROUTES from '../routes';
import { navigate, useNavigate } from "react-router-dom";
import '../styles/ConfirmacaoCompra.css';
import Footer from '../components/Footer';

export default function ConfirmacaoCompra(){
    const navigate = useNavigate(); 
    return(
        <>
            <Header/>
                <h1>Pedido feito com sucesso!</h1>
                <img src="/compra-finalizada.png"></img>
                <h1>Os status do seu pedido são atualizados em tempo real, Cheque o email ou o a aba “perfil” para ler o andamento de seu pedido. </h1>
                <button onClick={() => navigate(ROUTES.APRESENTACAO)}>Voltar ao início</button>
            <Footer/>
        </>
    )
}