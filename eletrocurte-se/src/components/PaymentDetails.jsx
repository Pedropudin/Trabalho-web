import React, { useState, useEffect } from "react";
import "../styles/PaymentDetails.css";
import toast, { Toaster } from 'react-hot-toast';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CartOverview from "./CartOverview";

/*
  Payment details page.
  - Displayed during the checkout process.
  - Collects customer card data.
  - Buttons to go back or proceed to the next step of the order.
*/

// --- Format Helpers ---
function formatCardNumber(value) {
    return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(value) {
    value = value.replace(/\D/g, "").slice(0, 4);
    if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    return value;
}
function formatCVC(value) {
    return value.replace(/\D/g, "").slice(0, 4);
}

export default function PaymentDetails({ onSubmit, onNext, onBack, steps }) {
    // --- State ---
    const activeStep = 2;
    const [form, setForm] = useState({
        cardName: "",
        cardNumber: "",
        expiry: "",
        cvc: ""
    });
    const [savedCards, setSavedCards] = useState([]);

    // --- Effects ---
    useEffect(() => {
        // Get user id from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user && user.id ? user.id : null;
        if (!userId) {
            setSavedCards([]);
            return;
        }
        fetch(`http://localhost:5000/api/users/${userId}`)
            .then(res => res.json())
            .then(user => {
                let cards = [];
                if (Array.isArray(user.cards)) cards = user.cards;
                else if (user.cards) cards = [user.cards];
                setSavedCards(cards);
                // Preenche automaticamente o formulário com o primeiro cartão salvo
                if (cards.length > 0) {
                    setForm(form => ({
                        ...form,
                        cardName: cards[0].cardName || "",
                        cardNumber: cards[0].cardNumber || "",
                        expiry: cards[0].expiry || "",
                        cvc: cards[0].cvc || ""
                    }));
                }
            })
            .catch(() => setSavedCards([]));
    }, []);

    // --- Handlers ---
    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "cardNumber") {
            newValue = formatCardNumber(newValue);
        } else if (name === "expiry") {
            newValue = formatExpiry(newValue);
        } else if (name === "cvc") {
            newValue = formatCVC(newValue);
        }
        setForm({ ...form, [name]: newValue });
    }

    function handleSubmit(e) {
        e.preventDefault();
        // Simple validation
        if (form.cardNumber.replace(/\s/g, "").length !== 16) {
            toast.error("Card number must have 16 digits.");
            return;
        }
        if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
            toast.error("Expiry must be in MM/YY format.");
            return;
        }
        if (form.cvc.length < 3) {
            toast.error("CVC must have at least 3 digits.");
            return;
        }
        localStorage.setItem("payment", JSON.stringify(form));
        if (onSubmit) onSubmit(form);
        if (onNext) onNext();
    }

    // --- Render ---
    return (
        <>
            <Toaster />
            <div style={{ width: "100%", margin: "32px 0" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <div className="main-content">
                <form className="payment-details-form" onSubmit={handleSubmit}>
                    <h2>Payment Data</h2>
                    <input
                        id="cardName"
                        type="text"
                        name="cardName"
                        placeholder="Name on Card"
                        value={form.cardName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        id="cardNumber"
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={form.cardNumber}
                        onChange={handleChange}
                        required
                        maxLength={19}
                    />
                    <div className="form-row">
                        <input
                            id="expiry"
                            type="text"
                            name="expiry"
                            placeholder="MM/YY"
                            value={form.expiry}
                            onChange={handleChange}
                            required
                            maxLength={5}
                        />
                        <input
                            id="cvc"
                            type="text"
                            name="cvc"
                            placeholder="CVC"
                            value={form.cvc}
                            onChange={handleChange}
                            required
                            maxLength={4}
                        />
                    </div>
                    <div className="saved-card-select">
                        <label>Select a saved card:</label>
                        <select
                            onChange={e => {
                                const idx = e.target.value;
                                if (idx !== "" && savedCards[idx]) {
                                    const selected = savedCards[idx];
                                    setForm(form => ({
                                        ...form,
                                        cardName: selected.cardName || "",
                                        cardNumber: selected.cardNumber || "",
                                        expiry: selected.expiry || "",
                                        cvc: selected.cvc || ""
                                    }));
                                }
                            }}
                            defaultValue=""
                        >
                            <option value="">Select</option>
                            {savedCards.length === 0 && (
                                <option value="" disabled>
                                    No saved cards
                                </option>
                            )}
                            {savedCards.map((card, idx) => (
                                <option value={idx} key={idx}>
                                    {card.cardName} - **** **** **** {card.cardNumber?.slice(-4)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="button-row">
                        <button
                            type="button"
                            className="back-button"
                            onClick={onBack}
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="submit-button"
                        >
                            Next
                        </button>
                    </div>
                </form>
                <CartOverview />
            </div>
        </>
    );
}
