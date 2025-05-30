import React, { useState } from "react";
import "../styles/PaymentDetails.css"
import toast, { Toaster } from 'react-hot-toast';
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
        parcelamento: "", 
    });

    //Vezes de parcelamento
    const vezesDeParcelamento = [
        1,2,3,4,5,6,7,8,9,10,11,12
    ];

    // Progresso
    const activeStep = 2;

    //Formatação de CPF
    function formatCPF(value) {
        value = value.replace(/\D/g, "").slice(0, 11);
        // Aplica a máscara
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value;
    }
    //Formatação de data de validade
    function formatValidade(value) {
        value = value.replace(/\D/g, "").slice(0, 4);
        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }
        return value;
    }
    //Formatação de cartão
    function formatCartao(value) {
        value = value.replace(/\D/g, "").slice(0, 16);
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        return value.trim();
    }
    
    //Atualização do form sempre que o formulário for preenchido
    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;

        //Formatação de dados
        if (name === "cpf") {
            newValue = formatCPF(newValue);
        }else if (name === "validade") {
            newValue = formatValidade(newValue);
        } else if (name === "cvv") {
            newValue = newValue.replace(/\D/g, "").slice(0, 3);
        } else if (name === "numero_cartao") {
            newValue = formatCartao(newValue);
        } else if (name === "nome_cartao") {
            newValue = newValue.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        }

        setForm({ ...form, [name]: newValue });
    }
    
    //Envio do formulário
    function handleSubmit(e) {
        e.preventDefault();//Grante controle do envio do formulário

        // Validação da validade (MM/AA)
        const validade = form.validade;
        const validadeRegex = /^(\d{2})\/(\d{2})$/;
        const match = validade.match(validadeRegex);

        if (!match) {//Aviso caso condição não tenha sido cumprida
            toast.error("Validade inválida. Use o formato MM/AA.");
            return;
        }

        //Separa mês e ano, a fim de garantir que cumprem regras básicas do calendário
        const mes = parseInt(match[1], 10);
        const ano = 2000 + parseInt(match[2], 10);

        if (mes < 1 || mes > 12) {//Aviso caso condição não tenha sido cumprida
            toast.error("Mês da validade deve ser entre 01 e 12.");
            return;
        }
        if (ano < 2025) {//Aviso caso condição não tenha sido cumprida
            toast.error("Ano da validade deve ser 2025 ou maior.");
            return;
        }

        if (!form.parcelamento) {//Aviso caso condição não tenha sido cumprida
            toast.error("Escolha o número de parcelas.");
            return;
        }
        //Salvamento no json local e envio
        localStorage.setItem("card", JSON.stringify(form));
        if (onSubmit) onSubmit(form);
        if (onNext) onNext();
    }

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
        <form className="payment-details-form" onSubmit={handleSubmit}>
            <h2>Dados de Pagamento</h2>
            <label htmlFor="numero_cartao"></label>
            <input
                id="numero_cartao"
                type="text"
                name="numero_cartao"
                placeholder="Número do cartão"
                value={form.numero_cartao}
                onChange={handleChange}
                required
                maxLength={19}
                inputMode="numeric"
                pattern="\d{4} \d{4} \d{4} \d{4}"
                title="Digite 16 números do cartão (formato: 0000 0000 0000 0000)"
            />
            <label htmlFor="nome_cartao"></label>
            <input
                id="nome_cartao"
                type="text"
                name="nome_cartao"
                placeholder="Nome impresso no cartão"
                value={form.nome_cartao}
                onChange={handleChange}
                required
            />
            <div className="input-row">
                <div>
                    <label htmlFor="validade"></label>
                    <input
                        id="validade"
                        type="text"
                        name="validade"
                        placeholder="MM/AA"
                        value={form.validade}
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
                placeholder="CPF do titular"
                value={form.cpf}
                onChange={handleChange}
                required
            />
            <label htmlFor="parcelamento"></label>
            <select
                id="parcelamento"
                name="parcelamento"
                value={form.parcelamento || ""}
                onChange={handleChange}
            >
                <option value="" disabled>Escolha o número de parcelas</option>
                {vezesDeParcelamento.map((num) => (
                    <option key={num} value={num}>
                        Em {num}x sem juros
                    </option>
                ))}
            </select>
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
