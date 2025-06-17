import '../styles/Checkout.css';
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import PurchaseConfirmation from '../components/PurchaseConfirmation';
import PaymentDetails from '../components/PaymentDetails';
import PersonalDetails from '../components/PersonalDetails';
import Purchase from '../components/Purchase';

/*
  Cart + Purchase page
  - Displayed when entering the cart, or when proceeding to purchase confirmation
  - Switches between the essential steps for a purchase to be made, by replacing the created components.
*/

export default function Checkout() {
    // Checkout update on the same page, to facilitate and componentize as much as possible
    // Checkout steps (fixed: Cart, Personal Data, Payment, Review)
    const steps = ["Cart", "Personal Data", "Payment", "Review"];
    const [step, setStep] = useState(1);

    // Quick check when advancing steps
    function nextStep() {
        // Checks if required data exists before advancing
        if (step === 1) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (!cart.length) return; // Do not advance if cart is empty
        }

        if (step === 2) {
            // Busca endereço do perfil
            const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
            const selectedAddressId = localStorage.getItem('selectedAddress');
            const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];
            if (!selectedAddress || !selectedAddress.street || !selectedAddress.number || !selectedAddress.city || !selectedAddress.state || !selectedAddress.zipCode) {
                alert("No delivery address found in your profile. Please register an address in your profile before proceeding.");
                return;
            }
            const personal = JSON.parse(localStorage.getItem("personal")) || {};
            if (
                !personal.firstName ||
                !personal.lastName ||
                !personal.email ||
                !personal.cpf ||
                !personal.phone ||
                !personal.address ||
                !personal.number ||
                !personal.district ||
                !personal.city ||
                !personal.state ||
                !personal.zipCode
            ) return;
        }

        if (step === 3) {
            const card = JSON.parse(localStorage.getItem("card")) || {};
            if (!card.cardHolder || !card.cardNumber || !card.cvv || !card.cpf || !card.expiry || !card.installments) return;
        }
        setStep(prev => prev + 1);
    }
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <>
            <Header />
            {step === 1 && <Cart onNext={nextStep} onBack={prevStep} />}
            {step === 2 && <PersonalDetails onNext={nextStep} onBack={prevStep} steps={steps}/> }
            {step === 3 && <PaymentDetails onNext={nextStep} onBack={prevStep} steps={steps} />}
            {step === 4 && <Purchase onNext={nextStep} onBack={prevStep} steps={steps}/>}
            {step === 5 && <PurchaseConfirmation />}
            <Footer />
        </>
    );
}