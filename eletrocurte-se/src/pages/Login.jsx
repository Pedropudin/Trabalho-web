import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeaderLogs from '../components/HeaderLogs';
import ROUTES from '../routes';
import '../styles/Login.css';
import Footer from '../components/Footer';

/*
  Página de Login adaptada do HTML antigo.
  Permite alternar entre login de Cliente e Administrador.
  Validações básicas e navegação programática.
*/

export default function Login() {
  const [tipo, setTipo] = useState('cliente');
  const [mensagem, setMensagem] = useState('');
  const [mensagemTipo, setMensagemTipo] = useState('info');
  const navigate = useNavigate();

  // Expressões regulares para validação
  const nomeRegex = /^(?=.*[\W_]).{6,}$/;
  const senhaSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Validação do formulário do cliente
  function validarCliente({ nome, email, senha }) {
    if (!nomeRegex.test(nome)) {
      exibirMensagem("O nome do cliente deve ter ao menos 6 caracteres e conter ao menos 1 caractere especial.", "erro");
      return false;
    }
    if (!regexEmail.test(email)) {
      exibirMensagem("Por favor, insira um e-mail válido.", "erro");
      return false;
    }
    if (!senhaSegura.test(senha)) {
      exibirMensagem("A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.", "erro");
      return false;
    }
    return true;
  }

  // Validação do formulário do administrador
  function validarAdmin({ nome, email, senha, token }) {
    if (!regexEmail.test(email)) {
      exibirMensagem("Por favor, insira um e-mail válido.", "erro");
      return false;
    }
    if (!nomeRegex.test(nome)) {
      exibirMensagem("O nome do administrador deve ter ao menos 6 caracteres e conter ao menos 1 caractere especial.", "erro");
      return false;
    }
    if (!senhaSegura.test(senha)) {
      exibirMensagem("A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.", "erro");
      return false;
    }
    if (!/^\d{6}$/.test(token)) {
      exibirMensagem("O token deve conter exatamente 6 dígitos numéricos.", "erro");
      return false;
    }
    return true;
  }

  function exibirMensagem(msg, tipo = "info") {
    setMensagem(msg);
    setMensagemTipo(tipo);
    setTimeout(() => setMensagem(''), 4000);
  }

  // Submissão do formulário do cliente
  function handleCliente(e) {
    e.preventDefault();
    const nome = e.target['nome-cliente'].value.trim();
    const email = e.target['email-cliente'].value.trim();
    const senha = e.target['senha-cliente'].value.trim();

    if (validarCliente({ nome, email, senha })) {
      exibirMensagem("Login do cliente efetuado com sucesso!", "sucesso");
      setTimeout(() => navigate(ROUTES.APRESENTACAO), 1500);
    }
  }

  // Submissão do formulário do administrador
  function handleAdmin(e) {
    e.preventDefault();
    const nome = e.target['nome-admin'].value.trim();
    const email = e.target['email-admin'].value.trim();
    const senha = e.target['senha-admin'].value.trim();
    const token = e.target['token'].value.trim();

    if (validarAdmin({ nome, email, senha, token })) {
      exibirMensagem("Login do administrador efetuado com sucesso!", "sucesso");
      setTimeout(() => navigate(ROUTES.APRESENTACAO), 1500);
    }
  }

  return (
    <>
      {/* Cabeçalho com logo centralizado */}
      <HeaderLogs />

      {/* Container principal que engloba todo o conteúdo de login */}
      <div className="container">
        {/* Seção de opções de usuário (seleção de perfil) */}
        <div className="user-options">
          <button
            className={`user-btn${tipo === 'cliente' ? ' active' : ''}`}
            id="btn-cliente"
            type="button"
            onClick={() => setTipo('cliente')}
          >
            <i className="fas fa-user"></i><br />
            Cliente
          </button>
          <button
            className={`user-btn${tipo === 'admin' ? ' active' : ''}`}
            id="btn-admin"
            type="button"
            onClick={() => setTipo('admin')}
          >
            <i className="fas fa-shield-alt"></i><br />
            Administrador
          </button>
        </div>

        {/* Formulário de login do Cliente */}
        <form
          id="form-cliente"
          className={`login-box${tipo === 'cliente' ? ' show' : ' hidden'}`}
          onSubmit={handleCliente}
          autoComplete="off"
        >
          <label htmlFor="nome-cliente">Nome</label>
          <input type="text" id="nome-cliente" required placeholder="(mínimo de 6 caracteres e 1 especial. Ex: $Abcdef)" />

          <label htmlFor="email-cliente">E-mail</label>
          <input type="email" id="email-cliente" required placeholder="(coloque algum domínio válido. Ex: @yahoo e @gmail)" />

          <label htmlFor="senha-cliente">Senha</label>
          <input type="password" id="senha-cliente" required placeholder="(mínimo 8 caracteres. Ex: @Eletrocurte-se-100%)" />

          <button type="submit" className="btn-enviar" id="submit-cliente">
            Entrar
          </button>
        </form>

        {/* Formulário de login do Administrador */}
        <form
          id="form-admin"
          className={`login-box${tipo === 'admin' ? ' show' : ' hidden'}`}
          onSubmit={handleAdmin}
          autoComplete="off"
        >
          <label htmlFor="nome-admin">Nome</label>
          <input type="text" id="nome-admin" required placeholder="(mínimo de 6 caracteres e 1 especial. Ex: $Abcdef)" />

          <label htmlFor="email-admin">E-mail</label>
          <input type="email" id="email-admin" required placeholder="(coloque algum domínio válido. Ex: @yahoo e @gmail)" />

          <label htmlFor="senha-admin">Senha</label>
          <input type="password" id="senha-admin" required placeholder="(mínimo 8 caracteres. Ex: @Eletrocurte-se-100%)" />

          <label htmlFor="token">Token de segurança</label>
          <input type="text" id="token" required placeholder="(deve conter exatamente 6 dígitos. Ex: 123456)" />

          <button type="submit" className="btn-enviar" id="submit-admin">
            Entrar
          </button>
        </form>
      </div>

      {/* Caixa de mensagens de erro ou sucesso */}
      {mensagem && (
        <div className={`mensagem show ${mensagemTipo}`}>{mensagem}</div>
      )}

      <Footer />
    </>
  );
}