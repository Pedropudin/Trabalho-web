import React from "react";
import '../styles/CompraFinalizada.css'
import { navigate, useNavigate } from "react-router-dom";
import ROUTES from "../routes";

export default function CompraFinalizada(){
    const navigate = useNavigate(); 
    return(
        <>
            <strong><h1 className="textos-confirmacao">Pedido feito com sucesso!</h1></strong>
            <img className="foto-confirmacao" src="/compra-finalizada.png"></img>
            <strong><h1 className="textos-confirmacao">Os status do seu pedido são atualizados em tempo real.<br /> Cheque o email ou o a aba “perfil” para ler o andamento de seu pedido. </h1></strong>
            <button className="botao-inicio" onClick={() => navigate(ROUTES.APRESENTACAO)}>Voltar ao início</button>
        </>
    )
}