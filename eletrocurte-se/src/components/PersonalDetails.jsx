import React, { useState } from "react";
import "../styles/PersonalDetails.css"
import toast, { Toaster } from 'react-hot-toast';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CartOverview from "./CartOverview";

/*
  Buyer details page.
  - Displayed during the checkout process.
  - Collects customer data such as birth date, email, name, address.
  - Buttons to go back or proceed to the next step of the order.
*/

export default function PersonalDetails({ onSubmit, onNext, onBack, steps }) {
    // Progress
    const activeStep = 1;

    // User basic information form
    const [form, setForm] = useState({
        nome: "",
        sobrenome: "",
        email: "",
        telefone: "",
        cpf: "",
        nascimento: "",
        endereco: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: ""
    });

    // CPF formatting
    function formatCPF(value) {
        value = value.replace(/\D/g, "").slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value;
    }
    // Date formatting
    function formatNascimento(value) {
        value = value.replace(/\D/g, "").slice(0, 8);
        if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }
        return value;
    }
    // Phone number formatting
    function formatPhoneNumber(value) {
        value = value.replace(/\D/g, "").slice(0, 11); 

        if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        }
        if (value.length > 10) {
            value = value.replace(/(\d{5})(\d{4})$/, "$1-$2");
        } else if (value.length > 6) {
            value = value.replace(/(\d{4})(\d{4})$/, "$1-$2");
        }
        return value;
    }

    // Updates the form whenever a field is filled
    function handleChange(e) {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "cpf") {
            newValue = formatCPF(newValue);
        } else if (name === "nascimento") {
            newValue = formatNascimento(newValue);
        } else if (name === "numero") {
            newValue = newValue.replace(/\D/g, "").slice(0, 6);
        } else if (name === "cep") {
            newValue = newValue.replace(/\D/g, "").slice(0, 8);
        } else if (["nome", "sobrenome", "cidade", "estado", "bairro"].includes(name)) {
            newValue = newValue.replace(/[^A-Za-zÀ-ÿ\s]/g, "");
        } else if (name === "telefone") {
            newValue = formatPhoneNumber(newValue);
        } else if (["endereco", "complemento"].includes(name)) {
            newValue = newValue.replace(/[^A-Za-zÀ-ÿ0-9\s]/g, "");
        }
        setForm({ ...form, [name]: newValue });
    }

    // Sends the data to our "database"
    function handleSubmit(e) {
        e.preventDefault();

        // Birth date validation (DD/MM/YYYY)
        const nascimento = form.nascimento;
        const nascimentoRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = nascimento.match(nascimentoRegex);

        if (!match) {
            toast.error("Invalid birth date. Use the format DD/MM/YYYY.");
            return;
        }

        const dia = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10);
        const ano = parseInt(match[3], 10);

        if (dia < 1 || dia > 31) {
            toast.error("Birth day must be between 01 and 31.");
            return;
        }
        if (mes < 1 || mes > 12) {
            toast.error("Birth month must be between 01 and 12.");
            return;
        }
        if (ano > 2025) {
            toast.error("Birth year must be 2025 or less.");
            return;
        }

        localStorage.setItem("personal", JSON.stringify(form));
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
        <div className="main-content">
            <form className="personal-details-form" onSubmit={handleSubmit}>
                <h2>Personal Data</h2>
                <div className="form-row">
                    <input
                        type="text"
                        name="nome"
                        placeholder="First Name"
                        value={form.nome}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-zÀ-ÿ\s]+"
                        title="Only letters are allowed"
                    />
                    <input
                        type="text"
                        name="sobrenome"
                        placeholder="Last Name"
                        value={form.sobrenome}
                        onChange={handleChange}
                        required
                        pattern="[A-Za-zÀ-ÿ\s]+"
                        title="Only letters are allowed"
                    />
                </div>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="telefone"
                    placeholder="Phone"
                    value={form.telefone}
                    onChange={handleChange}
                    required
                />
                <div className="cpf-nascimento-row">
                    <input
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        value={form.cpf}
                        onChange={handleChange}
                        required
                        pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                        title="Enter CPF in the format 000.000.000-00"
                    />
                    <input
                        type="text"
                        name="nascimento"
                        placeholder="Birth date"
                        value={form.nascimento}
                        onChange={handleChange}
                        required
                        pattern="\d{2}/\d{2}/\d{4}"
                        title="Enter the date in the format DD/MM/YYYY"
                    />
                </div>
                <h3>Address</h3>
                <input
                    type="text"
                    name="endereco"
                    placeholder="Address"
                    value={form.endereco}
                    onChange={handleChange}
                    required
                />
                <div className="form-row">
                    <input
                        type="text"
                        name="numero"
                        placeholder="Number"
                        value={form.numero}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="complemento"
                        placeholder="Complement"
                        value={form.complemento}
                        onChange={handleChange}
                    />
                </div>
                <input
                    type="text"
                    name="bairro"
                    placeholder="Neighborhood"
                    value={form.bairro}
                    onChange={handleChange}
                    required
                />
                <div className="form-row">
                    <input
                        type="text"
                        name="cidade"
                        placeholder="City"
                        value={form.cidade}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="estado"
                        placeholder="State"
                        value={form.estado}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="cep"
                        placeholder="ZIP code"
                        value={form.cep}
                        onChange={handleChange}
                        required
                    />
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
