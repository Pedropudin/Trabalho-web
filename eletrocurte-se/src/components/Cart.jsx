import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Cart.css';
import toast, { Toaster } from 'react-hot-toast';
import ROUTES from "../routes";

/*
  Cart page.
  - Displays products in the shopping cart.
  - Allows adding and removing products from the cart.
  - Buttons to redirect to the home page or to the next step of the checkout process.
*/

export default function Cart({onNext}) {
    const navigate = useNavigate();
    
    const userId = localStorage.getItem('userId');
    const cartKey = userId ? `cart_${userId}` : 'cart';
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem(cartKey)) || []);
    const [productsLocal, setProductsLocal] = useState([]);

    // User authentication check
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Checks authentication on page load
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    // Function that verifies if the user is logged in before proceeding with the payment
    function handleLogin(e) {
        if (!isLoggedIn) {
            toast.error('Login to pay!');
            return;
        } else{
            onNext();
        }
    }

    // Fetch products from database when the component mounts
    useEffect(() => {
        // Always fetch from backend for consistency
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(res => res.json())
            .then(data => setProductsLocal(data))
            .catch(() => setProductsLocal([]));
    }, []);

    // Gets the stock of the product
    function getProductStock(productId) {
        const prod = productsLocal.find(p => p.id === productId);
        if(prod){
            return prod.inStock;
        }else{
            return 0;
        }
    }

    // Increases quantity in the cart, always checking if there is stock
    function handleIncrease(productId) {
        let toastShown = false;
        setCart(prev =>
            prev.map(item => {
                if (item.id === productId) {
                    const stock = getProductStock(productId);
                    if (item.quantity + 1 > stock) {
                        if (!toastShown) {
                            toast.error("Maximum number of products reached. Error: Out of stock!");
                            toastShown = true;
                        }
                        return item; 
                    }
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            })
        );
    }

    // Decreases the quantity in the cart down to 1, if you want to delete, there will be a button for that
    function handleDecrease(productId) {
        setCart(prev =>
            prev.map(item =>
                item.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    }

    // Will remove the item from the cart by filtering by id, updates Cart directly which will update our local JSON
    function handleRemove(productId) {
        setCart(prev => prev.filter(item => item.id !== productId));
    }

    // Saves the cart to localStorage whenever it changes
    React.useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        window.forceCartUpdate && window.forceCartUpdate();
        // Could save to backend using userId, if desired
    }, [cart, cartKey]);

    // Calculates the total number of items and total prices
    const cartProducts = cart
        .map(item => {
            const prod = productsLocal.find(p => String(p.id) === String(item.id));
            if (!prod) return null;
            return {
                ...item,
                name: prod.name,
                price: prod.price,
                image: prod.image,
                inStock: prod.inStock
            };
        })
        .filter(Boolean);

    const totalItems = cartProducts.reduce((sum, p) => sum + p.quantity, 0);
    const totalPrice = cartProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

    // If the cart is empty
    if (!cartProducts.length) {
        return (
            <div className="review-container" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="products-list-bg" style={{ padding: 40, textAlign: "center" }}>
                    <h2 className="title">Your cart is empty</h2>
                    <p>Add products to view the cart summary.</p>
                    <button
                        type="button"
                        className="empty-cart-btn"
                        onClick={() => navigate(ROUTES.HOME_PAGE)}
                    >
                        Go to store
                    </button>
                </div>
            </div>
        );
    }

    // Cart rendering
    return (
        <div className="review-container">
            <Toaster/>
            <div className="products-list-bg">
                <h2 className="title">Cart Summary</h2>
                <ul className="products-list">
                    {cartProducts.map(product => (
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
                                    Product price: ${Number(product.price).toFixed(2)}
                                </span>
                                <span className="product-stock-info">
                                    Stock: {product.inStock}
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
                                <button className="remove-btn" onClick={() => handleRemove(product.id)} title="Remove">Delete</button>
                            </div>
                            <span className="product-total">
                                ${ (Number(product.price) * product.quantity).toFixed(2) }
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="products-list-total highlight-total">
                    <span>Total items: <b>{totalItems}</b></span>
                    <span>
                        <b>Total:</b>
                        <span className="total-value">
                            ${totalPrice.toFixed(2)}
                        </span>
                    </span>
                </div>
                <div className="review-buttons">
                    <button
                        type="button"
                        className="continue-btn"
                        onClick={() => navigate(ROUTES.HOME_PAGE)}
                    >
                        Continue Shopping
                    </button>
                    <button
                        type="button"
                        className="finish-btn"
                        onClick={handleLogin}
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
}
