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

    const nextStep = () => setStep(prev => prev + 1);
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