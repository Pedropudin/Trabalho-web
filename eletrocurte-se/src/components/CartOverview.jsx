import '../styles/CartOverview.css'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Cart.css';
import toast, { Toaster } from 'react-hot-toast';

// Cart summary component
export default function CartOverview(){
   
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
    const [productsLocal, setProductsLocal] = useState([]);

    // Fetch products from JSON when the component mounts
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