import React, { useState } from "react";
import "../styles/PaymentDetails.css"
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

export default function PaymentDetails({ onSubmit, onNext, onBack, steps }) {
    const [form, setForm] = useState({
        numero_cartao: "",
        nome_cartao: "",
        validade: "",
        cvv: "",
        cpf: "",
    });

    // Progresso
    const activeStep = 1;

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    function handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem("card", JSON.stringify(form));
        if (onSubmit) onSubmit(form);
        if (onNext) onNext();
    }

    return (
       <>
        <div style={{ width: "100%", margin: "32px 0" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </div>
        <form className="personal-details-form" onSubmit={handleSubmit} style={{maxWidth: 480, margin: "80px auto"}}>
            <h2>Dados de Pagamento</h2>
            <input
                id="numero_cartao"
                type="text"
                name="numero_cartao"
                placeholder="Número do cartão"
                value={form.numero_cartao}
                onChange={handleChange}
                required
                maxLength={19}
                style={{width: "100%", marginTop: 12}}
                inputMode="numeric"
                pattern="\d{16,19}"
            />
            <input
                type="text"
                name="nome_cartao"
                placeholder="Nome impresso no cartão"
                value={form.nome_cartao}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 12}}
            />
            <div style={{display: "flex", gap: 12, marginTop: 12}}>
                <input
                    type="text"
                    name="validade"
                    placeholder="Validade (MM/AA)"
                    value={form.validade}
                    onChange={handleChange}
                    required
                    maxLength={5}
                    style={{flex: 1}}
                />
                <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={form.cvv}
                    onChange={handleChange}
                    required
                    maxLength={4}
                    style={{flex: 1}}
                />
            </div>
            <input
                type="text"
                name="cpf"
                placeholder="CPF do titular"
                value={form.cpf}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 12}}
            />
            <div className="button-row">
                <button
                    type="button"
                    className="back-button"
                    onClick={onBack}
                >
                    Voltar
                </button>
                <button
                    type="submit"
                    className="submit-button"
                >
                    Próximo
                </button>
            </div>
        </form>
    </>
    );
}