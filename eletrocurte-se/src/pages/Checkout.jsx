import '../styles/Checkout.css';
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import CompraFinalizada from '../components/CompraFinalizada';
import PaymentDetails from '../components/PaymentDetails';
import PersonalDetails from '../components/PersonalDetails';
import Purchase from '../components/Purchase';

export default function Checkout() {

    //Atualização de checkout em uma mesma página, a fim de facilitar e componentizar o máximo possível
    // Etapas do checkout
    const steps = ["Carrinho", "Pagamento", "Dados Pessoais", "Revisão"];
    const [step, setStep] = useState(1);

    // Checagem rápida ao avançar etapas
    function nextStep() {
        // Checa se dados obrigatórios existem antes de avançar
        if (step === 1) {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (!cart.length) return; // Não avança se carrinho vazio
        }

        if (step === 2) {
            const card = JSON.parse(localStorage.getItem("card")) || {};
            if (!card.nome_cartao || !card.numero_cartao || !card.cvv || !card.cpf || !card.validade) return;
        }
        
        if (step === 3) {
            const personal = JSON.parse(localStorage.getItem("personal")) || {};
            if (!personal.nome || !personal.sobrenome || !personal.email || !personal.cpf || !personal.telefone) return;
        }
        setStep(prev => prev + 1);
    }
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <>
            <Header />
            {step === 1 && <Cart onNext={nextStep} onBack={prevStep} />}
            {step === 2 && <PaymentDetails onNext={nextStep} onBack={prevStep} steps={steps} />}
            {step === 3 && <PersonalDetails onNext={nextStep} onBack={prevStep} steps={steps}/>}
            {step === 4 && <Purchase onNext={nextStep} onBack={prevStep} steps={steps}/>}
            {step === 5 && <CompraFinalizada />}
            <Footer />
        </>
    );
}