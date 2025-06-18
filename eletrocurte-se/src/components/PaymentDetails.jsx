import React, { useState, useEffect } from "react";
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
  - User must select a registered card from wallet.
  - Shows card balance and checks if it's enough for the purchase.
  - If no card, instructs user to register one in the wallet.
  - If insufficient balance, blocks advance.
  - Cardholder CPF is auto-filled from personal data and cannot be edited here.
*/

export default function PaymentDetails({ onSubmit, onNext, onBack, steps }) {
    // Cards from wallet
    const [cards, setCards] = useState([]);
    const [selectedCardLast4, setSelectedCardLast4] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [error, setError] = useState('');
    const [total, setTotal] = useState(0);
    const [cpf, setCpf] = useState('');

    // Progress
    const activeStep = 2;

    // Busca cartões cadastrados e saldo
    useEffect(() => {
        const storedCards = JSON.parse(localStorage.getItem('walletCards') || '[]');
        setCards(storedCards);
        if (storedCards.length > 0) {
            setSelectedCardLast4(storedCards[0].last4);
        }
    }, []);

    // Atualiza cartão selecionado
    useEffect(() => {
        const card = cards.find(c => c.last4 === selectedCardLast4);
        setSelectedCard(card || null);
    }, [selectedCardLast4, cards]);

    // Update the selected card in backend
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId && selectedCardLast4) {
            fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/select-card`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ last4: selectedCardLast4 })
            });
        }
    }, [selectedCardLast4]);

    // Calculate the total amount of the shop
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const cartKey = userId ? `cart_${userId}` : 'cart';
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const products = JSON.parse(localStorage.getItem("products")) || [];
        let sum = 0;
        for (const item of cart) {
            const prod = products.find(p => String(p.id) === String(item.id));
            if (prod) sum += Number(prod.price) * item.quantity;
        }
        setTotal(sum);
    }, []);

    // Busca CPF do usuário (personal data)
    useEffect(() => {
        const personal = JSON.parse(localStorage.getItem("personal") || "{}");
        setCpf(personal.cpf || "");
    }, []);

    // Formulário para parcelas
    const [installments, setInstallments] = useState("");
    const vezesDeParcelamento = [1,2,3,4,5,6,7,8,9,10,11,12];

    // Payment Submission
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        if (!cards.length) {
            toast.error("No card registered. Please register a card in your Wallet before proceeding.");
            setError("No card registered.");
            return;
        }
        if (!selectedCard) {
            toast.error("Select a card to proceed.");
            setError("Select a card.");
            return;
        }
        if (!installments) {
            toast.error("Choose the number of installments.");
            setError("Choose installments.");
            return;
        }
        if ((selectedCard.balance ?? 0) < total) {
            toast.error("Insufficient balance on the selected card. Please recharge your card in the Wallet.");
            setError("Insufficient balance.");
            return;
        }
        // Subtract the amount of the selected card used for the shop
        const userId = localStorage.getItem('userId');
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/cards/${selectedCard.last4}/debit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total })
            });
            if (!res.ok) {
                const data = await res.json();
                toast.error(data.error || "Insufficient card balance. Please recharge your card in the Wallet.");
                setError(data.error || "Insufficient card balance.");
                return;
            }
        } catch {
            toast.error("Error debiting card. Try again.");
            setError("Error debiting card.");
            return;
        }
        // Update local amount
        const updatedCards = cards.map(c =>
            c.last4 === selectedCard.last4
                ? { ...c, balance: (c.balance ?? 0) - total }
                : c
        );
        setCards(updatedCards);
        localStorage.setItem('walletCards', JSON.stringify(updatedCards));
        // Salva dados do pagamento
        localStorage.setItem("card", JSON.stringify({
            cardHolder: selectedCard.nameOnCard || "",
            cardNumber: selectedCard.cardNumber || selectedCard.number || "",
            cpf: cpf,
            expiry: selectedCard.expiry || "",
            cvv: selectedCard.cvv || selectedCard.CVV || "",
            installments
        }));
        if (onSubmit) onSubmit();
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
            {cards.length === 0 ? (
                <div style={{ color: "#c00", marginBottom: 24 }}>
                    No card registered. Please register a card in your <b>Wallet</b> before proceeding.
                </div>
            ) : (
                <>
                    <label htmlFor="cardHolder">Cardholder Name</label>
                    <input
                        id="cardHolder"
                        type="text"
                        name="cardHolder"
                        value={selectedCard?.nameOnCard || ""}
                        disabled
                        required
                        placeholder="Cardholder Name"
                    />
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                        id="cardNumber"
                        type="text"
                        name="cardNumber"
                        value={selectedCard?.cardNumber || selectedCard?.number || ""}
                        disabled
                        required
                        placeholder="Card Number"
                    />
                    <label htmlFor="expiry">Expiry</label>
                    <input
                        id="expiry"
                        type="text"
                        name="expiry"
                        value={selectedCard?.expiry || ""}
                        disabled
                        required
                        placeholder="MM/YY"
                    />
                    <label htmlFor="cvv">CVV</label>
                    <input
                        id="cvv"
                        type="text"
                        name="cvv"
                        value={selectedCard?.cvv || selectedCard?.CVV || ""}
                        disabled
                        required
                        placeholder="CVV"
                    />
                    <label htmlFor="cpf">Cardholder CPF</label>
                    <input
                        id="cpf"
                        type="text"
                        name="cpf"
                        value={cpf}
                        disabled
                        required
                        placeholder="Cardholder CPF"
                    />
                    <label htmlFor="cardSelect">Select a card</label>
                    <select
                        id="cardSelect"
                        name="cardSelect"
                        value={selectedCardLast4}
                        onChange={e => setSelectedCardLast4(e.target.value)}
                        required
                    >
                        {cards.map(card => (
                            <option key={card.last4} value={card.last4}>
                                {card.brand} **** {card.last4} (Balance: ${Number(card.balance ?? 0).toFixed(2)})
                            </option>
                        ))}
                    </select>
                    <label htmlFor="installments">Installments</label>
                    <select
                        id="installments"
                        name="installments"
                        value={installments || ""}
                        onChange={e => setInstallments(e.target.value)}
                        required
                    >
                        <option value="" disabled>Choose the number of installments</option>
                        {vezesDeParcelamento.map((num) => (
                            <option key={num} value={num}>
                                In {num}x of ${ (total/num).toFixed(2) } without interest
                            </option>
                        ))}
                    </select>
                    <div style={{ margin: "10px 0", color: "#007b99" }}>
                        <b>Total purchase:</b> ${total.toFixed(2)}
                    </div>
                    {error && <div style={{ color: "#c00", marginBottom: 8 }}>{error}</div>}
                </>
            )}
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
                    disabled={cards.length === 0}
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