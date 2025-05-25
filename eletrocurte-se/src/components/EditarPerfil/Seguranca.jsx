import React from 'react';

export default function FormSeguranca({ form, handleChange, handleSubmit, mensagem, onVoltar }) {
  return (
    <form className="editarperfil-card-form" onSubmit={handleSubmit}>
      <h2>Segurança</h2>
      <label htmlFor="email">E-mail:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Digite seu e-mail"
        required
      />
      <label htmlFor="senha">Senha:</label>
      <input
        type="password"
        id="senha"
        name="senha"
        value={form.senha}
        onChange={handleChange}
        placeholder="Nova senha"
        required
      />
      <label htmlFor="cpf">CPF:</label>
      <input
        type="text"
        id="cpf"
        name="cpf"
        value={form.cpf}
        onChange={handleChange}
        placeholder="000.000.000-00"
        required
      />
      <button type="submit" className="editarperfil-btn-salvar">
        Salvar Alterações
      </button>
      {mensagem && <div className="editarperfil-mensagem-editar">{mensagem}</div>}
      <button
        type="button"
        className="editarperfil-btn-voltar"
        onClick={onVoltar}
      >
        Voltar ao Perfil
      </button>
    </form>
  );
}
