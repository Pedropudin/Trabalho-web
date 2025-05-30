import React, { useState, useEffect } from "react";
import "../styles/Purchase.css";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

export default function Purchase({ onBack, onNext, steps }) {

    // Recupera todos os dados que nós temos, então: carrinho, dados pessoais e dados de pagamento (que podem diferir)
    const [produtosLocais, setProdutosLocais] = React.useState([]); 
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const personal = JSON.parse(localStorage.getItem("personal")) || {};
    const card = JSON.parse(localStorage.getItem("card")) || {};

    //Lê dados dos produtos diretamento do JSON
    useEffect(() => {
        const localProducts = localStorage.getItem("products");
        if (localProducts) {
            setProdutosLocais(JSON.parse(localProducts));
        } else {
            fetch('/data/Produtos.json')
                .then(res => res.json())
                .then(data => setProdutosLocais(data))
                .catch(() => setProdutosLocais([]));
        }
    }, []);

    //Calcula o valor total do pedido, se baseando naquilo que está no carrinho
    const total = cart.reduce((sum, item) => {
        const prod = produtosLocais.find(p => p.id === item.id);
        return sum + (prod ? prod.price * item.quantity : 0);
    }, 0);

    //Assim que o botão de finalizar compra é apertado, os itens que estvam no carrinho são retirados do estoque e o carrinho é esvaziado
    function handlePurchase() {
        const updatedProducts = produtosLocais.map(prod => {
            const cartItem = cart.find(p => p.id === prod.id);
            if (cartItem) {
                return {
                    ...prod,
                    inStock: prod.inStock - cartItem.quantity,
                }
            }
            return prod;
        });
        //Grava mudanças no JSON local
        localStorage.setItem("products", JSON.stringify(updatedProducts));//Atualiza estoque após a finalização da compra
        localStorage.setItem("cart", JSON.stringify([]));//Limpa cart após a finalização da compra

        if (onNext) onNext();
    }

    // Etapas do checkout
    const activeStep = 3;

    return (
        <>
        <div className="purchase-stepper-container">
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
        <div className="purchase-summary-container">
            <h2 className="purchase-summary-title">
                Resumo do Pedido
            </h2>
            <section className="purchase-section">
                <h3 className="purchase-section-title">Dados Pessoais</h3>
                <div className="purchase-section-content">
                    <div><b>Nome:</b> {personal.nome} {personal.sobrenome}</div>
                    <div><b>E-mail:</b> {personal.email}</div>
                    <div><b>Telefone:</b> {personal.telefone}</div>
                    <div><b>CPF:</b> {personal.cpf}</div>
                    <div><b>Data de nascimento:</b> {personal.nascimento}</div>
                </div>
                <h3 className="purchase-section-title">Dados Cobrança</h3>
                <div className="purchase-section-content">
                    <div><b>Nome:</b> {card.nome_cartao}</div>
                    <div><b>Numero do Cartão:</b> {card.numero_cartao}</div>
                    <div><b>CVV:</b> {card.cvv}</div>
                    <div><b>CPF:</b> {card.cpf}</div>
                    <div><b>Data de Validade:</b> {card.validade}</div>
                    <div><b>Parcelamento:</b> Em {card.parcelamento}x vezes de R${(total/card.parcelamento).toFixed(2).replace('.',',')}</div>
                </div>
                <h3 className="purchase-section-title address">Endereço</h3>
                <div className="purchase-section-content">
                    <div>
                        {personal.endereco}, {personal.numero} {personal.complemento && <span>- {personal.complemento}</span>}
                    </div>
                    <div>
                        {personal.bairro} - {personal.cidade}/{personal.estado} - <b>CEP:</b> {personal.cep}
                    </div>
                </div>
            </section>
            <section className="purchase-section">
                <h3 className="purchase-section-title">Produtos</h3>
                <ul className="purchase-products-list">
                    {cart.map(item => {
                        const prod = produtosLocais.find(p => p.id === item.id);
                        if (!prod) return null;
                        return (
                            <li key={item.id} className="purchase-product-item">
                                <span>
                                    <span className="purchase-product-name">{prod.name}</span>
                                    <span className="purchase-product-qty">x{item.quantity}</span>
                                </span>
                                <span className="purchase-product-price">
                                    {(prod.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <div className="purchase-total">
                    Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
            </section>
            <div className="purchase-buttons-row">
                <button
                    type="button"
                    className="purchase-btn-back"
                    onClick={onBack}
                >
                    Voltar
                </button>
                <button
                    type="button"
                    className="purchase-btn-finish"
                    onClick={handlePurchase}
                >
                    Finalizar compra
                </button>
            </div>
        </div>
        </>
    );
}
