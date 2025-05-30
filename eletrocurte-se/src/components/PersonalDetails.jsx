import React, { useState } from "react";
import "../styles/PersonalDetails.css"
import toast, { Toaster } from 'react-hot-toast';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

export default function PersonalDetails({ onSubmit, onNext, onBack, steps }) {

    //Verifica se existe um arquivo locar existente, ou cria um vazio. 
    const personalDetails = JSON.parse(localStorage.getItem("personal"))|| [];
    
    // Progresso
    const activeStep = 2;

    //Formulário de informações básicas do usuário
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

    //Formatação de CPF
    function formatCPF(value) {
        value = value.replace(/\D/g, "").slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return value;
    }
    //Formatação de data
    function formatNascimento(value) {
        value = value.replace(/\D/g, "").slice(0, 8);
        if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }
        return value;
    }
    //Formatação de número de telefone
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

    //Atualização do form sempre que o formulário for preenchido
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

    //Envio dos dados para nosso "banco de dados"
    function handleSubmit(e) {
        e.preventDefault();

        // Validação do nascimento (DD/MM/AAAA)
        const nascimento = form.nascimento;
        const nascimentoRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = nascimento.match(nascimentoRegex);

        if (!match) {
            toast.error("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
            return;
        }

        const dia = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10);
        const ano = parseInt(match[3], 10);

        if (dia < 1 || dia > 31) {
            toast.error("Dia de nascimento deve ser entre 01 e 31.");
            return;
        }
        if (mes < 1 || mes > 12) {
            toast.error("Mês de nascimento deve ser entre 01 e 12.");
            return;
        }
        if (ano > 2025) {
            toast.error("Ano de nascimento deve ser 2025 ou menor.");
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
        <form className="personal-details-form" onSubmit={handleSubmit}>
            <h2>Dados Pessoais</h2>
            <div style={{display: "flex", gap: 12}}>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    style={{flex: 1}}
                    pattern="[A-Za-zÀ-ÿ\s]+"
                    title="Apenas letras são permitidas"
                />
                <input
                    type="text"
                    name="sobrenome"
                    placeholder="Sobrenome"
                    value={form.sobrenome}
                    onChange={handleChange}
                    required
                    style={{flex: 1}}
                    pattern="[A-Za-zÀ-ÿ\s]+"
                    title="Apenas letras são permitidas"
                />
            </div>
            <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={form.email}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 12}}
            />
            <input
                type="tel"
                name="telefone"
                placeholder="Telefone"
                value={form.telefone}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 12}}
            />
            <input
                type="text"
                name="cpf"
                placeholder="CPF"
                value={form.cpf}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 12}}
                pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
                title="Digite o CPF no formato 000.000.000-00"
            />
            <input
                type="text"
                name="nascimento"
                placeholder="Nascimento"
                value={form.nascimento}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 8}}
                pattern="\d{2}/\d{2}/\d{4}"
                title="Digite a data no formato DD/MM/AAAA"
            />
            <h3 style={{marginTop: 18}}>Endereço</h3>
            <input
                type="text"
                name="endereco"
                placeholder="Endereço"
                value={form.endereco}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 8}}
            />
            <div style={{display: "flex", gap: 12, marginTop: 8}}>
                <input
                    type="text"
                    name="numero"
                    placeholder="Número"
                    value={form.numero}
                    onChange={handleChange}
                    required
                    style={{flex: 1}}
                />
                <input
                    type="text"
                    name="complemento"
                    placeholder="Complemento"
                    value={form.complemento}
                    onChange={handleChange}
                    required
                    style={{flex: 2}}
                />
            </div>
            <input
                type="text"
                name="bairro"
                placeholder="Bairro"
                value={form.bairro}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 8}}
            />
            <div style={{display: "flex", gap: 12, marginTop: 8}}>
                <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={form.cidade}
                    onChange={handleChange}
                    required
                    style={{flex: 2}}
                />
                <input
                    type="text"
                    name="estado"
                    placeholder="Estado"
                    value={form.estado}
                    onChange={handleChange}
                    required
                    style={{flex: 1}}
                />
                <input
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={form.cep}
                    onChange={handleChange}
                    required
                    style={{flex: 1}}
                />
            </div>
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