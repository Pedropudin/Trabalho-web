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
                <strong><h1 className="textos-confirmacao">Pedido feito com sucesso!</h1></strong>
                <img className="foto-confirmacao" src="/compra-finalizada.png"></img>
                <strong><h1 className="textos-confirmacao">Os status do seu pedido são atualizados em tempo real.<br /> Cheque o email ou o a aba “perfil” para ler o andamento de seu pedido. </h1></strong>
                <button className="botao-inicio" onClick={() => navigate(ROUTES.APRESENTACAO)}>Voltar ao início</button>
            <Footer/>
        </>
    )
}