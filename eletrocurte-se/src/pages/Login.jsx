import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, TextField, Tabs, Tab } from '@mui/material';
import HeaderLogs from '../components/HeaderLogs';
import ROUTES from '../routes';
import Footer from '../components/Footer';

/*
  Página de Login adaptada do HTML antigo.
  Permite alternar entre login de Cliente e Administrador.
  Validações básicas e navegação programática.
*/

export default function Login() {
  const [tipo, setTipo] = useState('cliente');
  const [aba, setAba] = useState('login'); // 'login' ou 'cadastro'
  const [mensagem, setMensagem] = useState('');
  const [mensagemTipo, setMensagemTipo] = useState('info');
  const navigate = useNavigate();

  // Expressões regulares para validação
  const nomeRegex = /^(?=.*[\W_]).{6,}$/;
  const senhaSegura = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Validação do domínio do e-mail usando a API pública do Google DNS
  async function validarEmailGoogle(email) {
    const dominio = email.split('@')[1];
    if (!dominio) return false;
    try {
      const res = await fetch(`https://dns.google/resolve?name=${dominio}&type=MX`);
      const data = await res.json();
      return Array.isArray(data.Answer) && data.Answer.length > 0;
    } catch {
      return false;
    }
  }

  // Validação do formulário do cliente
  async function validarCliente({ nome, email, senha }) {
    if (!nomeRegex.test(nome)) {
      exibirMensagem("O nome do cliente deve ter ao menos 6 caracteres e conter ao menos 1 caractere especial.", "erro");
      return false;
    }
    if (!regexEmail.test(email)) {
      exibirMensagem("Por favor, insira um e-mail válido.", "erro");
      return false;
    }
    const emailValido = await validarEmailGoogle(email);
    if (!emailValido) {
      exibirMensagem("O domínio do e-mail não existe ou não aceita e-mails.", "erro");
      return false;
    }
    if (!senhaSegura.test(senha)) {
      exibirMensagem("A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.", "erro");
      return false;
    }
    return true;
  }

  // Validação do formulário do administrador
  async function validarAdmin({ nome, email, senha, token }) {
    if (!regexEmail.test(email)) {
      exibirMensagem("Por favor, insira um e-mail válido.", "erro");
      return false;
    }
    const emailValido = await validarEmailGoogle(email);
    if (!emailValido) {
      exibirMensagem("O domínio do e-mail não existe ou não aceita e-mails.", "erro");
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

  // Validação do formulário de cadastro
  async function validarCadastro({ nome, email, senha, confirmarSenha }) {
    if (!nomeRegex.test(nome)) {
      exibirMensagem("O nome deve ter ao menos 6 caracteres e conter ao menos 1 caractere especial.", "erro");
      return false;
    }
    if (!regexEmail.test(email)) {
      exibirMensagem("Por favor, insira um e-mail válido.", "erro");
      return false;
    }
    const emailValido = await validarEmailGoogle(email);
    if (!emailValido) {
      exibirMensagem("O domínio do e-mail não existe ou não aceita e-mails.", "erro");
      return false;
    }
    if (!senhaSegura.test(senha)) {
      exibirMensagem("A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um caractere especial.", "erro");
      return false;
    }
    if (senha !== confirmarSenha) {
      exibirMensagem("As senhas não coincidem.", "erro");
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
  async function handleCliente(e) {
    e.preventDefault();
    const nome = e.target['nome-cliente'].value.trim();
    const email = e.target['email-cliente'].value.trim();
    const senha = e.target['senha-cliente'].value.trim();

    if (await validarCliente({ nome, email, senha })) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'cliente');
      exibirMensagem("Login do cliente efetuado com sucesso!", "sucesso");
      setTimeout(() => navigate(ROUTES.PAGINA_INICIAL), 1500);
    }
  }

  // Submissão do formulário do administrador
  async function handleAdmin(e) {
    e.preventDefault();
    const nome = e.target['nome-admin'].value.trim();
    const email = e.target['email-admin'].value.trim();
    const senha = e.target['senha-admin'].value.trim();
    const token = e.target['token'].value.trim();

    if (await validarAdmin({ nome, email, senha, token })) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'admin');
      exibirMensagem("Login do administrador efetuado com sucesso!", "sucesso");
      setTimeout(() => navigate(ROUTES.DESEMPENHO), 1500);
    }
  }

  // Submissão do formulário de cadastro
  async function handleCadastro(e) {
    e.preventDefault();
    const nome = e.target['nome-cadastro'].value.trim();
    const email = e.target['email-cadastro'].value.trim();
    const senha = e.target['senha-cadastro'].value.trim();
    const confirmarSenha = e.target['confirmar-senha-cadastro'].value.trim();
    if (await validarCadastro({ nome, email, senha, confirmarSenha })) {
      exibirMensagem("Cadastro realizado com sucesso! Faça login para continuar.", "sucesso");
      setAba('login');
    }
  }

  return (
    <>
      <HeaderLogs />
      <Box sx={{ minHeight: '100vh', background: '#f5fafd', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <Paper elevation={4} sx={{ maxWidth: 400, width: '100%', p: { xs: 2, md: 4 }, borderRadius: 4, mt: 6 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: '#004d66', mb: 2 }}>
            {aba === 'login' ? 'Login' : 'Cadastro'}
          </Typography>
          <Tabs
            value={aba}
            onChange={(_, v) => setAba(v)}
            variant="fullWidth"
            sx={{ mb: 2 }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Login" value="login" />
            <Tab label="Cadastro" value="cadastro" />
          </Tabs>
          {/* Formulário de login */}
          {aba === 'login' && (
            <>
              <Tabs
                value={tipo}
                onChange={(_, v) => setTipo(v)}
                variant="fullWidth"
                sx={{ mb: 2 }}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Cliente" value="cliente" />
                <Tab label="Administrador" value="admin" />
              </Tabs>
              {tipo === 'cliente' && (
                <Box component="form" onSubmit={handleCliente} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Nome" id="nome-cliente" name="nome" required fullWidth size="small" placeholder="Ex: $Abcdef" />
                  <TextField label="E-mail" id="email-cliente" name="email" required fullWidth size="small" type="email" placeholder="Ex: usuario@gmail.com" />
                  <TextField label="Senha" id="senha-cliente" name="senha" required fullWidth size="small" type="password" placeholder="Ex: @Eletrocurte-se-100%" />
                  <Button type="submit" variant="contained" sx={{ background: '#007b99', color: '#fff', fontWeight: 600, borderRadius: 2, mt: 1, '&:hover': { background: '#004d66' } }}>
                    Entrar
                  </Button>
                </Box>
              )}
              {tipo === 'admin' && (
                <Box component="form" onSubmit={handleAdmin} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Nome" id="nome-admin" name="nome" required fullWidth size="small" placeholder="Ex: $Abcdef" />
                  <TextField label="E-mail" id="email-admin" name="email" required fullWidth size="small" type="email" placeholder="Ex: admin@empresa.com" />
                  <TextField label="Senha" id="senha-admin" name="senha" required fullWidth size="small" type="password" placeholder="Ex: @Eletrocurte-se-100%" />
                  <TextField label="Token de segurança" id="token" name="token" required fullWidth size="small" placeholder="Ex: 123456" />
                  <Button type="submit" variant="contained" sx={{ background: '#007b99', color: '#fff', fontWeight: 600, borderRadius: 2, mt: 1, '&:hover': { background: '#004d66' } }}>
                    Entrar
                  </Button>
                </Box>
              )}
            </>
          )}
          {/* Formulário de cadastro */}
          {aba === 'cadastro' && (
            <Box component="form" onSubmit={handleCadastro} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Nome completo" id="nome-cadastro" name="nome" required fullWidth size="small" placeholder="Ex: $Abcdef" />
              <TextField label="E-mail" id="email-cadastro" name="email" required fullWidth size="small" type="email" placeholder="Ex: usuario@gmail.com" />
              <TextField label="Senha" id="senha-cadastro" name="senha" required fullWidth size="small" type="password" placeholder="Ex: @Eletrocurte-se-100%" />
              <TextField label="Confirmar senha" id="confirmar-senha-cadastro" name="confirmarSenha" required fullWidth size="small" type="password" placeholder="Repita a senha" />
              <Button type="submit" variant="contained" sx={{ background: '#007b99', color: '#fff', fontWeight: 600, borderRadius: 2, mt: 1, '&:hover': { background: '#004d66' } }}>
                Cadastrar
              </Button>
            </Box>
          )}
          {mensagem && (
            <Box className={`mensagem show ${mensagemTipo}`} sx={{ mt: 2, textAlign: 'center', background: mensagemTipo === 'sucesso' ? '#4CAF50' : mensagemTipo === 'erro' ? '#F44336' : '#2196F3', color: '#fff', p: 1.5, borderRadius: 2, fontWeight: 600 }}>{mensagem}</Box>
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
}