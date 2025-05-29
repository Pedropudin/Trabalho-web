import React, { useState } from "react";
import "../styles/PersonalDetails.css"
import toast, { Toaster } from 'react-hot-toast';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';

export default function PersonalDetails({ onSubmit, onNext, onBack }) {

    //Verifica se existe um arquivo locar existente, ou cria um vazio. 
    const personalDetails = JSON.parse(localStorage.getItem("personal"))|| [];
    
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

    //Atualização do form sempre que o formulário for preenchido
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    //Envio dos dados para nosso "banco de dados"
    function handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem("personal", JSON.stringify(form));
        if (onSubmit) onSubmit(form);
        if (onNext) onNext();
    }
    return (
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
                />
                <input
                    type="text"
                    name="sobrenome"
                    placeholder="Sobrenome"
                    value={form.sobrenome}
                    onChange={handleChange}
                    required
                    style={{flex: 1}}
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
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                    label="Data de nascimento"
                    value={form.nascimento}
                    onChange={newValue => setForm({ ...form, nascimento: newValue })}
                    slotProps={{
                        textField: {
                            required: true,
                            fullWidth: true,
                            sx: {
                                marginTop: 2,
                                background: "#f7fafc",
                                borderRadius: "5px",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "5px",
                                    fontSize: "1rem",
                                    padding: "10px 12px",
                                    background: "#f7fafc",
                                },
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#e0f7fa",
                                    borderRadius: "5px",
                                    borderWidth: "1.5px",
                                },
                                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#007b99",
                                    borderRadius: "5px",
                                },
                            }
                        }
                    }}
                    required
                />
            </LocalizationProvider>
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
    );
}