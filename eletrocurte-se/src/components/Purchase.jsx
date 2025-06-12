import React, { useState, useEffect } from "react";
import "../styles/Purchase.css";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

/*
  Tela de confirmação da compra
  - Exibida como útlima etapa do processo de compra.
  - Contém o botão para que o pagamento seja feito e outro para que retorne a tela anterior
  - Quanto às informações, faz um resumo geral do produto: Total do pedido (qntidade de itens e preço), Endereço, Cartão e Dados pessoais -- todos inseridos nas etapas anteriores  
*/


export default function Purchase({ onBack, onNext, steps }) {

    // Recupera todos os dados que nós temos, então: carrinho, dados pessoais e dados de pagamento (que podem diferir)
    const [produtosLocais, setProdutosLocais] = React.useState([]); 
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const personal = JSON.parse(localStorage.getItem("personal")) || {};
    const card = JSON.parse(localStorage.getItem("card")) || {};

    //Lê dados dos produtos diretamento do JSON
    useEffect(() => {
        const localProducts = localStorage.getItem("produtos");
        if (localProducts) {
            setProdutosLocais(JSON.parse(localProducts));
        } else {
            fetch('/data/Produtos.json')
                .then(res => res.json())
                .then(data => setProdutosLocais(data))
                .catch(() => setProdutosLocais([]));
        }
        /* // Busca sempre do backend para garantir consistência
        fetch(process.env.REACT_APP_API_URL + '/produtos')
            .then(res => res.json())
            .then(data => setProdutosLocais(data))
            .catch(() => setProdutosLocais([])); */
    }, []);

    //Calcula o valor total do pedido, se baseando naquilo que está no carrinho
    const cartProducts = cart
        .map(item => {
            const prod = produtosLocais.find(p => String(p.id) === String(item.id));
            if (!prod) return null;
            return {
                ...item,
                name: prod.name || prod.nome,
                price: prod.price || prod.preco,
                image: prod.img || prod.imagem || prod.image,
                inStock: prod.inStock !== undefined ? prod.inStock : prod.estoque
            };
        })
        .filter(Boolean);

    const total = cartProducts.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const [, setErro] = useState('');

    // Checagem de dados obrigatórios
    function dadosValidos() {
        if (!cart.length) return "The cart is empty.";
        if (!personal.nome || !personal.sobrenome || !personal.email || !personal.cpf || !personal.telefone) return "Fill in all personal data.";
        if (!personal.endereco || !personal.numero || !personal.bairro || !personal.cidade || !personal.estado || !personal.cep) return "Fill in all address fields.";
        if (!card.nome_cartao || !card.numero_cartao || !card.cvv || !card.cpf || !card.validade) return "Fill in all card data.";
        // Checagem de estoque
        for (const item of cart) {
            const prod = produtosLocais.find(p => p.id === item.id);
            if (!prod || prod.inStock < item.quantity) return `Insufficient stock for product: ${item.name}`;
        }
        return "";
    }

    //Assim que o botão de finalizar compra é apertado, os itens que estvam no carrinho são retirados do estoque e o carrinho é esvaziado
    async function handlePurchase() {
        const erroMsg = dadosValidos();
        if (erroMsg) {
            setErro(erroMsg);
            return;
        }

        // Chamada à API para atualizar estoque
        try {
            await fetch(process.env.REACT_APP_API_URL + '/pedidos/finalizar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itens: cart.map(item => ({
                        id: item.id,
                        quantity: item.quantity
                    }))
                })
            });
        } catch (e) {
            setErro('Erro ao finalizar compra. Tente novamente.');
            return;
        }

        // Limpa carrinho após sucesso
        localStorage.setItem("cart", JSON.stringify([])); //Limpa cart após a finalização da compra
        setErro('');

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
                Order Summary
            </h2>
            <section className="purchase-section">
                <h3 className="purchase-section-title">Personal Data</h3>
                <div className="purchase-section-content">
                    <div><b>Name:</b> {personal.nome} {personal.sobrenome}</div>
                    <div><b>Email:</b> {personal.email}</div>
                    <div><b>Phone:</b> {personal.telefone}</div>
                    <div><b>CPF:</b> {personal.cpf}</div>
                    <div><b>Birth date:</b> {personal.nascimento}</div>
                </div>
                <h3 className="purchase-section-title">Billing Data</h3>
                <div className="purchase-section-content">
                    <div><b>Name:</b> {card.nome_cartao}</div>
                    <div><b>Card Number:</b> {card.numero_cartao}</div>
                    <div><b>CVV:</b> {card.cvv}</div>
                    <div><b>CPF:</b> {card.cpf}</div>
                    <div><b>Expiry Date:</b> {card.validade}</div>
                    <div><b>Installments:</b> In {card.parcelamento}x of ${(total/card.parcelamento).toFixed(2)}</div>
                </div>
                <h3 className="purchase-section-title address">Address</h3>
                <div className="purchase-section-content">
                    <div>
                        {personal.endereco}, {personal.numero} {personal.complemento && <span>- {personal.complemento}</span>}
                    </div>
                    <div>
                        {personal.bairro} - {personal.cidade}/{personal.estado} - <b>ZIP:</b> {personal.cep}
                    </div>
                </div>
            </section>
            <section className="purchase-section">
                <h3 className="purchase-section-title">Products</h3>
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
                                    ${(prod.price * item.quantity).toFixed(2)}
                                </span>
                            </li>
                        );
                    })}
                </ul>
                <div className="purchase-total">
                    Total: ${total.toFixed(2)}
                </div>
            </section>
            <div className="purchase-buttons-row">
                <button
                    type="button"
                    className="purchase-btn-back"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    type="button"
                    className="purchase-btn-finish"
                    onClick={handlePurchase}
                >
                    Finish Purchase
                </button>
            </div>
        </div>
        </>
    );
}
