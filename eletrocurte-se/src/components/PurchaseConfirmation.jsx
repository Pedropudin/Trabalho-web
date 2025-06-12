import React from "react";
import '../styles/PurchaseConfirmation.css'
import { useNavigate } from "react-router-dom";
import ROUTES from "../routes";

/*
  Purchase confirmation screen.
  - Displayed at the end of the purchase.
  - Button to redirect to the home screen.
*/

export default function PurchaseConfirmation(){
    const navigate = useNavigate(); 
    return(
        <>
            <div className="conteudo-principal">
                <strong><h1 className="textos-confirmacao-cima">Order placed successfully!</h1></strong>
                <img className="foto-confirmacao" src="/compra-finalizada.png" alt="Purchase completed" />
                <strong>
                  <h1 className="textos-confirmacao-baixo">
                    The status of your order is updated in real time.<br />
                    Check your email or the "profile" tab to track your order.
                  </h1>
                </strong>
                <button className="botao-inicio" onClick={() => navigate(ROUTES.HOME_PAGE)}>
                  Back to Home
                </button>
            </div>
        </>
    )
}
