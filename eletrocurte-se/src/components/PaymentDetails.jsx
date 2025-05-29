import React, { useState } from "react";
import "../styles/PaymentDetails.css"

export default function PaymentDetails({ onSubmit }) {
    const [form, setForm] = useState({
        numero_cartao: "",
        nome_cartao: "",
        validade: "",
        cvv: "",
        cpf: "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (onSubmit) onSubmit(form);
    }

    return (
        <form className="personal-details-form" onSubmit={handleSubmit} style={{maxWidth: 480, margin: "0 auto"}}>
            <h2>Dados de Pagamento</h2>
            <input
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
            <button type="submit" style={{
                marginTop: 24,
                width: "100%",
                padding: "12px 0",
                background: "linear-gradient(90deg, #007b99 0%, #005f73 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "1.1rem",
                cursor: "pointer"
            }}>
                Confirmar 
            </button>
        </form>
    );
}