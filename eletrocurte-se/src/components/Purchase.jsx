import React, { useState } from "react";
import "../styles/Purchase.css";
import Products from "../Products.json";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

export default function Purchase({ onBack, onNext, steps }) {
    // Recupera todos os dados que nós temos, então: carrinho, dados pessoais e dados de pagamento (que podem diferir)
    const produtosLocais = JSON.parse(localStorage.getItem("products")) || Products;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const personal = JSON.parse(localStorage.getItem("personal")) || {};
    const card = JSON.parse(localStorage.getItem("card"))|| [];

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

    const [erro, setErro] = useState('');

    // Checagem de dados obrigatórios
    function dadosValidos() {
        if (!cart.length) return "O carrinho está vazio.";
        if (!personal.nome || !personal.sobrenome || !personal.email || !personal.cpf || !personal.telefone) return "Preencha todos os dados pessoais.";
        if (!personal.endereco || !personal.numero || !personal.bairro || !personal.cidade || !personal.estado || !personal.cep) return "Preencha todos os campos do endereço.";
        if (!card.nome_cartao || !card.numero_cartao || !card.cvv || !card.cpf || !card.validade) return "Preencha todos os dados do cartão.";
        // Checagem de estoque
        for (const item of cart) {
            const prod = produtosLocais.find(p => p.id === item.id);
            if (!prod || prod.inStock < item.quantity) return `Estoque insuficiente para o produto: ${item.name}`;
        }
        return "";
    }

    //Assim que o botão de finalizar compra é apertado, os itens que estvam no carrinho são retirados do estoque e o carrinho é esvaziado
    function handlePurchase() {
        const erroMsg = dadosValidos();
        if (erroMsg) {
            setErro(erroMsg);
            return;
        }

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
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        localStorage.setItem("cart", JSON.stringify([]));
        setErro('');
        if (onNext) onNext();
    }

    // Etapas do checkout
    const activeStep = 3;

    return (
        <>
        <div style={{ width: "100%", margin: "32px 0" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
        <div className="purchase-summary-container" style={{
            maxWidth: 650,
            margin: "40px auto",
            background: "white",
            borderRadius: 18,
            boxShadow: "0 6px 32px rgba(0,123,153,0.10)",
            padding: 32
        }}>
            <h2 style={{
                textAlign: "center",
                marginBottom: 28,
                color: "#007b99",
                letterSpacing: 1,
                fontWeight: 800,
                textShadow: "0 2px 8px #e0f7fa"
            }}>
                Resumo do Pedido
            </h2>
            {erro && (
                <div style={{ color: "#e53935", fontWeight: 700, marginBottom: 18, textAlign: "center" }}>
                    {erro}
                </div>
            )}
            <section style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 12px #e0f7fa",
                padding: 24,
                marginBottom: 28,
                border: "1.5px solid #e0f7fa"
            }}>
                <h3 style={{
                    marginBottom: 14,
                    color: "#005f73",
                    fontWeight: 700,
                    fontSize: "1.08rem"
                }}>Dados Pessoais</h3>
                <div style={{ fontSize: "1rem", color: "#333", lineHeight: 1.7 }}>
                    <div><b>Nome:</b> {personal.nome} {personal.sobrenome}</div>
                    <div><b>E-mail:</b> {personal.email}</div>
                    <div><b>Telefone:</b> {personal.telefone}</div>
                    <div><b>CPF:</b> {personal.cpf}</div>
                    <div><b>Data de nascimento:</b> {personal.nascimento ? new Date(personal.nascimento).toLocaleDateString("pt-BR") : ""}</div>
                </div>
                <h3 style={{
                    marginBottom: 14,
                    color: "#005f73",
                    fontWeight: 700,
                    fontSize: "1.08rem"
                }}>Dados Cobrança</h3>
                <div style={{ fmargin: "20px 0 8px 0", ontSize: "1rem", color: "#333", lineHeight: 1.7 }}>
                    <div><b>Nome:</b> {card.nome_cartao}</div>
                    <div><b>Numero do Cartão:</b> {card.numero_cartao}</div>
                    <div><b>CVV:</b> {card.cvv}</div>
                    <div><b>CPF:</b> {card.cpf}</div>
                    <div><b>Data de Validade:</b> {card.validade}</div>
                    
                </div>
                <h3 style={{
                    margin: "20px 0 8px 0",
                    color: "#005f73",
                    fontWeight: 700,
                    fontSize: "1.08rem"
                }}>Endereço</h3>
                <div style={{ fontSize: "1rem", color: "#333", lineHeight: 1.7 }}>
                    <div>
                        {personal.endereco}, {personal.numero} {personal.complemento && <span>- {personal.complemento}</span>}
                    </div>
                    <div>
                        {personal.bairro} - {personal.cidade}/{personal.estado} - <b>CEP:</b> {personal.cep}
                    </div>
                </div>
            </section>
            <section style={{
                background: "#fff",
                borderRadius: 14,
                boxShadow: "0 2px 12px #e0f7fa",
                padding: 24,
                marginBottom: 28,
                border: "1.5px solid #e0f7fa"
            }}>
                <h3 style={{
                    marginBottom: 14,
                    color: "#005f73",
                    fontWeight: 700,
                    fontSize: "1.08rem"
                }}>Produtos</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {cartProducts.map(item => (
                        <li key={item.id} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            marginBottom: 10,
                            padding: "8px 0",
                            borderBottom: "1px dashed #e0f7fa"
                        }}>
                            <span>
                                <span style={{ fontWeight: 600, alignText: "start" }}>{item.name}</span>
                                <span style={{ color: "#007b99", fontWeight: 700, marginLeft: 8 }}>x{item.quantity}</span>
                            </span>
                            <span style={{ color: "#005f73", fontWeight: 700 }}>
                                {(Number(item.price) * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </span>
                        </li>
                    ))}
                </ul>
                <div style={{
                    borderTop: "1.5px solid #e0f7fa",
                    marginTop: 16,
                    paddingTop: 14,
                    textAlign: "right",
                    fontWeight: 800,
                    fontSize: "1.13rem",
                    color: "#007b99"
                }}>
                    Total: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
            </section>
            <div style={{ display: "flex", gap: 18, marginTop: 28 }}>
                <button
                    type="button"
                    onClick={onBack}
                    style={{
                        flex: 1,
                        padding: "13px 0",
                        background: "#fff",
                        color: "#007b99",
                        border: "2px solid #007b99",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        boxShadow: "none",
                        transition: "background 0.2s, color 0.2s, border-color 0.2s"
                    }}
                    onMouseOver={e => {
                        e.currentTarget.style.background = "#e0f7fa";
                        e.currentTarget.style.borderColor = "#009fcf";
                    }}
                    onMouseOut={e => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.borderColor = "#007b99";
                    }}
                >
                    Voltar
                </button>
                <button
                    type="button"
                    onClick={handlePurchase}
                    style={{
                        flex: 2,
                        padding: "13px 0",
                        background: "linear-gradient(90deg, #007b99 0%, #005f73 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        cursor: "pointer",
                        boxShadow: "0 2px 12px rgba(0,123,153,0.10)",
                        letterSpacing: "0.5px",
                        transition: "background 0.2s, transform 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "linear-gradient(90deg, #009fcf 0%, #007b99 100%)"}
                    onMouseOut={e => e.currentTarget.style.background = "linear-gradient(90deg, #007b99 0%, #005f73 100%)"}
                >
                    Finalizar compra
                </button>
            </div>
        </div>
     </>
    );
}