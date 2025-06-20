import '../styles/CartOverview.css'
import React, { useState, useEffect } from "react";
import '../styles/Cart.css';

// Cart summary component
export default function CartOverview(){
    const userId = localStorage.getItem('userId');
    const cartKey = userId ? `cart_${userId}` : 'cart';
    const [cart, setCart] = useState([]);
    const [productsLocal, setProductsLocal] = useState([]);

    // Fetch products from database when the component mounts
    useEffect(() => {
        // Always fetch from backend for consistency
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(res => res.json())
            .then(data => setProductsLocal(data))
            .catch(() => setProductsLocal([]));
    }, []);

    // Always get cart from localStorage on mount and when userId changes
    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem(cartKey)) || []);
    }, [cartKey]);

    const cartProducts = cart
    .map(item => {
        const prod = productsLocal.find(p => String(p.id) === String(item.id));
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

    const totalItems = cartProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);


    return (
        <div className="cart-overview">
            <h2>Cart Summary</h2>
            <ul>
                {cartProducts.map((item) => (
                    <li key={item.id}>
                        <span>{item.quantity}x</span> 
                        <span>{item.name}</span>  
                        <span>${item.price.toFixed(2)} </span>
                    </li>
                ))}
            </ul>
            <div className="cart-summary">
                <p><strong>Total items:</strong> {totalItems}</p>
                <p><strong>Total:</strong> ${totalPrice.toFixed(2)}</p>
            </div>
        </div>
    );
}