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

    // Always get the correct cart key for the current user
    function getCartKey() {
        const userId = localStorage.getItem('userId');
        return userId ? `cart_${userId}` : 'cart';
    }

    // Quick check when advancing steps
    function nextStep() {
        // Checks if required data exists before advancing
        if (step === 1) {
            const cartKey = getCartKey();
            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            if (!cart.length) {
                alert("Your cart is empty. Add products before proceeding.");
                return;
            }
        }

        if (step === 2) {
            // Fetch address from profile
            const userId = localStorage.getItem('userId');
            const addressKey = userId ? `address_${userId}` : 'address';
            const selectedAddressKey = userId ? `selectedAddress_${userId}` : 'selectedAddress';
            const addressArr = JSON.parse(localStorage.getItem(addressKey) || '[]');
            const selectedAddressId = localStorage.getItem(selectedAddressKey);
            const selectedAddress = addressArr.find(a => a.id === selectedAddressId) || addressArr[0];
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
                (!personal.address && (
                    !personal.street ||
                    !personal.number ||
                    !personal.district ||
                    !personal.city ||
                    !personal.state ||
                    !personal.zipCode
                ))
            ) {
                alert("Fill in all personal and address data before proceeding.");
                return;
            }
        }

        if (step === 3) {
            const card = JSON.parse(localStorage.getItem("card")) || {};
            if (!card.cardHolder || !card.cardNumber || !card.cvv || !card.cpf || !card.expiry || !card.installments) {
                alert("Fill in all card data before proceeding.");
                return;
            }
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