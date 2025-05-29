import React, { useState } from "react";
import "../styles/PersonalDetails.css"

export default function PersonalDetails({ onSubmit }) {
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

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (onSubmit) onSubmit(form);
    }

    return (
        <form className="personal-details-form" onSubmit={handleSubmit} style={{maxWidth: 480, margin: "0 auto"}}>
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
            <input
                type="date"
                name="nascimento"
                placeholder="Data de nascimento"
                value={form.nascimento}
                onChange={handleChange}
                required
                style={{width: "100%", marginTop: 12}}
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
                Confirmar Dados
            </button>
        </form>
    );
}