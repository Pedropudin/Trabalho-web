import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Cart.css';
import toast, { Toaster } from 'react-hot-toast';

/*
  Página do carrinho.
  - Exibe produtos no carrinho de compra.
  - Permite adição e deleção de produtos do carrinho.
  - Botões de redirecionamento para tela inicial ou para a próxima etapa da conclusão do pedido.
*/



export default function Cart({onNext}) {
    const navigate = useNavigate();

    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [productsLocal, setProductsLocal] = useState([]);

    // Buscar produtos do JSON ao montar o componente
    useEffect(() => {
        const localProducts = localStorage.getItem("products");
        if (localProducts) {
            setProductsLocal(JSON.parse(localProducts));
        } else {
            fetch('/data/Produtos.json')
                .then(res => res.json())
                .then(data => setProductsLocal(data))
                .catch(() => setProductsLocal([]));
        }
    }, []);

    //Pega o estoque do produto
    function getProductStock(productId) {
        const prod = productsLocal.find(p => p.id === productId);
        if(prod){
            return prod.inStock;
        }else{
            return 0;
        }
    }

    //Aumenta quantidade no carrinho, semmpre conferindo se existe estoque
    function handleIncrease(productId) {
        setCart(prev =>
            prev.map(item => {
                if (item.id === productId) {
                    const stock = getProductStock(productId);
                    if (item.quantity + 1 > stock) {
                        toast.error ("Número máximo de produtos atingido. Erro: Falta de estoque!");
                        return item;
                    }
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );
    }

    //Diminui a quantidade no carrinho até 1, caso queira excluir, teremos um botão para isso
    function handleDecrease(productId) {
        setCart(prev =>
            prev.map(item =>
                item.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    }

    //Irá remover o item do carrinho por meio de uma filtragem pelo id, atualiza diretamente o Cart que atualizará nosso JSON local
    function handleRemove(productId) {
        setCart(prev => prev.filter(item => item.id !== productId));
    }

    // Salva o carrinho no localStorage sempre que mudar
    React.useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    //Calculo do total de itens e do total de preços 
    const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // Se o carrinho estiver vazio
    if (!cart.length) {
        return (
            <div className="review-container" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="products-list-bg" style={{ padding: 40, textAlign: "center" }}>
                    <h2 className="title">Seu carrinho está vazio</h2>
                    <p>Adicione produtos para visualizar o resumo do carrinho.</p>
                    <button
                        type="button"
                        className="empty-cart-btn"
                        onClick={() => navigate(`/PaginaPesquisa`)}
                    >
                        Ir para a loja
                    </button>
                </div>
            </div>
        );
    }

    // Renderização do carrinho
    return (
        <div className="review-container">
            <Toaster/>
            <div className="products-list-bg">
                <h2 className="title">Resumo do Carrinho</h2>
                <ul className="products-list">
                    {cart.map(product => (
                        <li key={product.id} className="product-list-item">
                            <span className="product-qty">{product.quantity}x</span>
                            <img
                                src={product.image || "https://via.placeholder.com/120x120?text=Img"}
                                alt={product.name}
                                className="product-img"
                            />
                            <div className="product-info">
                                <span className="product-name">{product.name}</span>
                                <span className="product-qty-price">
                                    Preço do produto: R${product.price.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="product-stock-info">
                                    Estoque: {getProductStock(product.id)}
                                </span>
                            </div>
                            <div className="product-actions">
                                <button onClick={() => handleDecrease(product.id)}>-</button>
                                <span style={{
                                    minWidth: 24,
                                    textAlign: "center",
                                    fontWeight: 600,
                                    color: "#007b99"
                                }}>{product.quantity}</span>
                                <button onClick={() => handleIncrease(product.id)}>+</button>
                                <button className="remove-btn" onClick={() => handleRemove(product.id)} title="Remover">Excluir</button>
                            </div>
                            <span className="product-total">
                                R${(product.price * product.quantity).toFixed(2).replace('.', ',')}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="products-list-total highlight-total">
                    <span>Total de itens: <b>{totalItems}</b></span>
                    <span>
                        <b>Total:</b>
                        <span className="total-value">
                            R${totalPrice.toFixed(2).replace('.', ',')}
                        </span>
                    </span>
                </div>
                <div className="review-buttons">
                    <button
                        type="button"
                        className="continue-btn"
                        onClick={() => navigate(`/PaginaPesquisa`)}
                    >
                        Continuar Comprando
                    </button>
                    <button
                        type="button"
                        className="finish-btn"
                        onClick={onNext}
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    );
}
