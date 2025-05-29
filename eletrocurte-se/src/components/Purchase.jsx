import React from "react";
import "../styles/Purchase.css";
import Products from "../Products.json";

export default function Purchase({ onBack, onNext }) {
    // Recupera todos os dados que nós temos, então: carrinho, dados pessoais e dados de pagamento (que podem diferir)
    const produtosLocais = JSON.parse(localStorage.getItem("products")) || Products;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const personal = JSON.parse(localStorage.getItem("personal")) || {};
    const card = JSON.parse(localStorage.getItem("card"))|| [];

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
        //Grava mudanças no JSON
        localStorage.setItem("products", JSON.stringify(updatedProducts));
        localStorage.setItem("cart", JSON.stringify([]));

        if (onNext) onNext();
    }

    return (
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
                    {cart.map(item => {
                        const prod = produtosLocais.find(p => p.id === item.id);
                        if (!prod) return null;
                        return (
                            <li key={item.id} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 10,
                                padding: "8px 0",
                                borderBottom: "1px dashed #e0f7fa"
                            }}>
                                <span>
                                    <span style={{ fontWeight: 600 }}>{prod.name}</span>
                                    <span style={{ color: "#007b99", fontWeight: 700, marginLeft: 8 }}>x{item.quantity}</span>
                                </span>
                                <span style={{ color: "#005f73", fontWeight: 700 }}>
                                    {(prod.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </span>
                            </li>
                        );
                    })}
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
    );
}