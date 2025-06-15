import React, { useState } from "react";
import "../styles/PaymentDetails.css"
import toast, { Toaster } from 'react-hot-toast';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CartOverview from "./CartOverview";
import { useNavigate } from 'react-router-dom';
import ROUTES from '../routes';

/*
  Payment details page.
  - Displayed during the checkout process.
  - Collects credit card data such as number, name, cvv.
  - Buttons to go back or proceed to the next step of the order.
*/

export default function PaymentDetails({ onSubmit, onNext, onBack, steps }) {
    const [form, setForm] = useState({
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: "",
        cpf: "",
        installments: "", 
    });

    // Installment options
    const vezesDeParcelamento = [
        1,2,3,4,5,6,7,8,9,10,11,12
    ];

    // Progress
    const activeStep = 2;

    // CPF formatting
    function formatCPF(value) {
        value = value.replace(/\D/g, "").slice(0, 11);
        // Apply mask
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value;
    }
    // Expiry date formatting
    function formatValidade(value) {
        value = value.replace(/\D/g, "").slice(0, 4);
        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }
        return value;
    }
    // Card number formatting
    function formatCartao(value) {
        value = value.replace(/\D/g, "").slice(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        return value.trim();
    }
    
    // Updates the form whenever a field is filled
    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;

        // Data formatting
        if (name === "cpf") {
            newValue = formatCPF(newValue);
        } else if (name === "expiry") {
            newValue = formatValidade(newValue);
        } else if (name === "cvv") {
            newValue = newValue.replace(/\D/g, "").slice(0, 3);
        } else if (name === "cardNumber") {
            newValue = formatCartao(newValue);
        } else if (name === "cardHolder") {
            newValue = newValue.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        }

        setForm({ ...form, [name]: newValue });
    }
    
    // Form submission
    function handleSubmit(e) {
        e.preventDefault();//Ensures control of form submission

        // Expiry validation (MM/YY)
        const expiry = form.expiry;
        const expiryRegex = /^(\d{2})\/(\d{2})$/;
        const match = expiry.match(expiryRegex);

        if (!match) {//Warn if condition is not met
            toast.error("Invalid expiry date. Use the format MM/YY.");
            return;
        }

        // Separate month and year to ensure they meet basic calendar rules
        const month = parseInt(match[1], 10);
        const year = 2000 + parseInt(match[2], 10);

        if (month < 1 || month > 12) {//Warn if condition is not met
            toast.error("Expiry month must be between 01 and 12.");
            return;
        }
        if (year < 2025) {//Warn if condition is not met
            toast.error("Expiry year must be 2025 or greater.");
            return;
        }

        if (!form.installments) {//Warn if condition is not met
            toast.error("Choose the number of installments.");
            return;
        }
        // Save to local json and submit
        localStorage.setItem("card", JSON.stringify(form));
        if (onSubmit) onSubmit(form);
        if (onNext) onNext();
    }

    const navigate = useNavigate();

    const handleVoltar = () => {
        navigate(ROUTES.PROFILE);
    };

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
            <h2>Payment Details</h2>
            <label htmlFor="cardNumber"></label>
            <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                placeholder="Card number"
                value={form.cardNumber}
                onChange={handleChange}
                required
                maxLength={19}
                inputMode="numeric"
                pattern="\d{4} \d{4} \d{4} \d{4}"
                title="Enter 16 card numbers (format: 0000 0000 0000 0000)"
            />
            <label htmlFor="cardHolder"></label>
            <input
                id="cardHolder"
                type="text"
                name="cardHolder"
                placeholder="Name on card"
                value={form.cardHolder}
                onChange={handleChange}
                required
            />
            <div className="input-row">
                <div>
                    <label htmlFor="expiry"></label>
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
                </div>
                <div>
                    <label htmlFor="cvv"></label>
                    <input
                        id="cvv"
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={form.cvv}
                        onChange={handleChange}
                        required
                        maxLength={4}
                    />
                </div>
            </div>
            <label htmlFor="cpf"></label>
            <input
                id="cpf"
                type="text"
                name="cpf"
                placeholder="Cardholder CPF"
                value={form.cpf}
                onChange={handleChange}
                required
            />
            <label htmlFor="installments"></label>
            <select
                id="installments"
                name="installments"
                value={form.installments || ""}
                onChange={handleChange}
            >
                <option value="" disabled>Choose the number of installments</option>
                {vezesDeParcelamento.map((num) => (
                    <option key={num} value={num}>
                        In {num}x without interest
                    </option>
                ))}
            </select>
            <div className="button-row">
                <button
                    type="button"
                    className="back-button"
                    onClick={handleVoltar}
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
        <CartOverview/>
        </div>
    </>
    );
}
