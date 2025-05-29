import React from "react";
import '../styles/Review.css';
import productsInCart from '../ProductsInCart.json'; 

export default function Review() {
    const totalItems = productsInCart.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = productsInCart.reduce((sum, p) => sum + p.price * p.quantity, 0);

    return (
        <div className="review-container">
            <div className="products-list-bg">
                <h2 className="title">Products in your cart:</h2>
                <ul className="products-list">
                    {productsInCart.map(product => (
                        <li key={product.id}>
                            <span className="product-qty-price">{product.quantity}x</span>
                            <span className="product-name" style={{margin: "0 8px"}}>{product.name}</span>
                            <span style={{flex: 1}}></span>
                            <span className="product-qty-price">R${product.price.toFixed(2).replace('.', ',')}</span>
                        </li>
                    ))}
                </ul>
                <div className="products-list-total">
                    <span>Total de itens: {totalItems}</span>
                    <span>Total: R${totalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
    );
}