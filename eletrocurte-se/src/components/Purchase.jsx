import React, { useState, useEffect } from "react";
import "../styles/Purchase.css";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

/*
  Purchase confirmation screen
  - Displayed as the last step of the purchase process.
  - Contains the button to make the payment and another to return to the previous screen
  - As for the information, it gives a general summary of the product: Order total (quantity of items and price), Address, Card and Personal data -- all entered in previous steps  
*/

export default function Purchase({ onBack, onNext, steps }) {
    // Retrieves all the data we have: cart, personal data and payment data (which may differ)
    const userId = localStorage.getItem('userId');
    const cartKey = userId ? `cart_${userId}` : 'cart';
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const personal = JSON.parse(localStorage.getItem("personal")) || {};
    const card = JSON.parse(localStorage.getItem("card")) || {};

    // Fix: define produtosLocal and setProductsLocal
    const [produtosLocal, setProductsLocal] = useState([]);

    // Fetch products from database when the component mounts
    useEffect(() => {
        // Always fetch from backend for consistency
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(res => res.json())
            .then(data => setProductsLocal(data))
            .catch(() => setProductsLocal([]));
    }, []);

    // Calculates the total order value, based on what is in the cart
    const cartProducts = cart
        .map(item => {
            const prod = produtosLocal.find(p => String(p.id) === String(item.id));
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

    const total = cartProducts.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const [, setErro] = useState('');

    // Mandatory data check
    function dadosValidos() {
        if (!cart.length) return "The cart is empty.";
        if (
            !personal.firstName ||
            !personal.lastName ||
            !personal.email ||
            !personal.cpf ||
            !personal.phone
        ) return "Fill in all personal data.";
        if (
            !personal.address ||
            !personal.number ||
            !personal.district ||
            !personal.city ||
            !personal.state ||
            !personal.zipCode
        ) return "Fill in all address fields.";
        if (
            !card.cardHolder ||
            !card.cardNumber ||
            !card.cvv ||
            !card.cpf ||
            !card.expiry
        ) return "Fill in all card data.";
        // Stock check
        for (const item of cart) {
            const prod = produtosLocal.find(p => p.id === item.id);
            if (!prod || prod.inStock < item.quantity) return `Insufficient stock for product: ${item.name}`;
        }
        return "";
    }

    // As soon as the finish purchase button is pressed, the items in the cart are removed from stock and the cart is emptied
    async function handlePurchase() {
        console.log("handlePurchase called");
        const erroMsg = dadosValidos();
        if (erroMsg) {
            setErro(erroMsg);
            return;
        }
        // API call to update stock
        try {
            // Update stock of bought products
            for (const item of cart) {
                const prod = produtosLocal.find(p => p.id === item.id);
                if (prod) {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${prod.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ inStock: prod.inStock - item.quantity })
                    });
                    await response.json();
                }
            }
        } catch (e) {
            setErro('Error finishing purchase. Try again.');
            return;
        }
        // Mark products as paid in the backend
        try {
            for (const item of cart) {
                await fetch(`${process.env.REACT_APP_API_URL}/api/products/${item.id}/pay`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        payed: true,
                        payedDate: new Date().toISOString()
                    })
                });
            }
        } catch (e) {
            setErro('Error updating payment status. Try again.');
            return;
        }

        // Create order in backend and add to user purchase history 
        try {
            // Create order in backend
            const token = localStorage.getItem('token');
            const orderRes = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    itens: cartProducts.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        name: item.name,
                        price: item.price
                    })),
                    personal,
                    card,
                    status: "pending"
                })
            });
            if (!orderRes.ok) {
                setErro('Error saving order. Try again.');
                return;
            }
        } catch (e) {
            setErro('Error saving order. Try again.');
            return;
        }

        // Clear cart after success
        localStorage.setItem(cartKey, JSON.stringify([]));
        setErro('');

        if (onNext) onNext();
    }

    // Checkout steps
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
                    <div><b>Name:</b> {personal.firstName} {personal.lastName}</div>
                    <div><b>Email:</b> {personal.email}</div>
                    <div><b>Phone:</b> {personal.phone}</div>
                    <div><b>CPF:</b> {personal.cpf}</div>
                    <div><b>Birth date:</b> {personal.birthDate}</div>
                </div>
                <h3 className="purchase-section-title">Billing Data</h3>
                <div className="purchase-section-content">
                    <div><b>Name:</b> {card.cardHolder}</div>
                    <div><b>Card Number:</b> {card.cardNumber}</div>
                    <div><b>CVV:</b> {card.cvv}</div>
                    <div><b>CPF:</b> {card.cpf}</div>
                    <div><b>Expiry Date:</b> {card.expiry}</div>
                    <div><b>Installments:</b> In {card.installments}x of ${ (total/card.installments).toFixed(2) }</div>
                </div>
                <h3 className="purchase-section-title address">Address</h3>
                <div className="purchase-section-content">
                    <div>
                        {personal.address}, {personal.number} {personal.complement && <span>- {personal.complement}</span>}
                    </div>
                    <div>
                        {personal.district} - {personal.city}/{personal.state} - <b>ZIP:</b> {personal.zipCode}
                    </div>
                </div>
            </section>
            <section className="purchase-section">
                <h3 className="purchase-section-title">Products</h3>
                <ul className="purchase-products-list">
                    {cart.map(item => {
                        const prod = produtosLocal.find(p => p.id === item.id);
                        if (!prod) return null;
                        return (
                            <li key={item.id} className="purchase-product-item">
                                <span>
                                    <span className="purchase-product-name">{prod.name}</span>
                                    <span className="purchase-product-qty">x{item.quantity}</span>
                                </span>
                                <span className="purchase-product-price">
                                    ${ (prod.price * item.quantity).toFixed(2) }
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