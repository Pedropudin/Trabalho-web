import '../styles/ProductCard.css';
import React from 'react';
import { useNavigate } from "react-router-dom";

export default function ProductCard({product}) {
    const navigate = useNavigate();

    return (
        <div className={`items${product.inStock > 0 ? '' : ' unavailable'}`}>
            <img
                className="item-image"
                src={product.img}
                alt={"Imagem do " + product.name}
                style={!product.inStock > 0 ? { filter: "grayscale(100%)" } : {}}
            />
            <p className="item-name">{product.name}</p><br />
            <p className="item-price">
                {product.inStock > 0 ? "R$" + product.price.toFixed(2) : "Produto indisponível."}
            </p>
            {product.inStock > 0 ? (
                <button
                    className="product-display-purchase-button"
                    onClick={() => navigate(`/PaginaProduto/${product.id}`)}
                >
                    Comprar
                </button>
            ) : (
                <button
                    className="product-display-purchase-button"
                    onClick={() => navigate(`/PaginaProduto/${product.id}`)}
                >
                    Ver produto
                </button>
            )}
        </div>
    );
}