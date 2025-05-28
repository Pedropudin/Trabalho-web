import '../styles/ProductCard.css';
import React from 'react';
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    if (!product) return null;

    return (
        <div className="items">
            <img
                className="item-image"
                src={product.img}
                alt={"Imagem do " + product.name}
                style={!product.inStock > 0 ? { filter: "grayscale(100%)" } : {}}
            />
            <p className="item-name">{product.name}</p><br />
            <p className="item-price">
                {product.inStock > 0 ? "R$" + product.price.toFixed(2) : ""}
            </p>
            {product.inStock > 0 ? (
                <button
                    className="product-display-purchase-button"
                    onClick={() => navigate(`/pages/PaginaProduto/${product.id}`)}
                >
                    Comprar
                </button>
            ) : (
                <p className="product-unavailable">
                    <strong>Produto Indisponível</strong>
                </p>
            )}
        </div>
    );
}