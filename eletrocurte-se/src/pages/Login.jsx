import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button, TextField, Tabs, Tab } from '@mui/material';
import HeaderLogs from '../components/HeaderLogs';
import ROUTES from '../routes';
import Footer from '../components/Footer';
import '../styles/Login.css';

/*
  Login page for the system.
  - Allows switching between Client and Admin login, as well as registration.
  - Robust validations for name, email, password, and token (admin).
  - Feedback messages and programmatic navigation.
  - Uses Material-UI for responsive layout and forms.
*/

export default function Login() {
  const [userType, setUserType] = useState('client');
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();

  // Regular expressions for name, password, and email validation
  // nameRegex: at least 6 characters, no special char required
  const nameRegex = /^.{6,}$/;
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  // Email domain validation using Google DNS public API
  async function validateEmailGoogle(email) {
    const domain = email.split('@')[1];
    if (!domain) return false;
    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const data = await res.json();
      return Array.isArray(data.Answer) && data.Answer.length > 0;
    } catch {
      return false;
    }
  }

  // Client form validation
  async function validateClient({ email, password }) {
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email.", "error");
      return false;
    }
    const validEmail = await validateEmailGoogle(email);
    if (!validEmail) {
      showMessage("The email domain does not exist or does not accept emails.", "error");
      return false;
    }
    if (!strongPassword.test(password)) {
      showMessage("Password must be at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.", "error");
      return false;
    }
    return true;
  }

  // Admin form validation
  async function validateAdmin({ name, email, password, token }) {
    // Permite domínio institucional @eletrocurte-se e domínios comuns
    const adminDomainRegex = /^[a-zA-Z0-9._-]+@eletrocurte-se(\.[a-zA-Z]{2,6})?$/;
    if (!adminDomainRegex.test(email) && !emailRegex.test(email)) {
      showMessage("Please enter a valid email. Admins can use @eletrocurte-se domain.", "error");
      return false;
    }
    // Se for domínio institucional, não faz validação DNS
    if (!adminDomainRegex.test(email)) {
      const validEmail = await validateEmailGoogle(email);
      if (!validEmail) {
        showMessage("The email domain does not exist or does not accept emails.", "error");
        return false;
      }
    }
    if (!nameRegex.test(name)) {
      showMessage("Admin name must have at least 6 characters.", "error");
      return false;
    }
    if (!strongPassword.test(password)) {
      showMessage("Password must be at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.", "error");
      return false;
    }
    if (!/^\d{6}$/.test(token)) {
      showMessage("Token must contain exactly 6 numeric digits.", "error");
      return false;
    }
    return true;
  }

  // Registration form validation
  async function validateRegistration({ name, email, password, confirmPassword }) {
    if (!nameRegex.test(name)) {
      showMessage("Name must have at least 6 characters.", "error");
      return false;
    }
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email.", "error");
      return false;
    }
    const validEmail = await validateEmailGoogle(email);
    if (!validEmail) {
      showMessage("The email domain does not exist or does not accept emails.", "error");
      return false;
    }
    if (!strongPassword.test(password)) {
      showMessage("Password must be at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.", "error");
      return false;
    }
    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return false;
    }
    return true;
  }

  // Utility function to display temporary messages
  function showMessage(msg, type = "info") {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  }

  // Form submission handlers
  // Client form submission
  async function handleClient(e) {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.senha.value.trim();

    if (await validateClient({ email, password })) {
      try {
        // Login via backend
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
          const data = await res.json();
          if (data.error === "Invalid credentials") {
            showMessage("User not found or incorrect password. Want to register?", "error");
            return;
          }
          showMessage("Invalid credentials.", "error");
          return;
        }
        const data = await res.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'client');
        localStorage.setItem('userName', data.user.firstName);
        localStorage.setItem('userId', data.user.id);
        showMessage("Client login successful!", "success");
        setTimeout(() => navigate(ROUTES.HOME_PAGE), 1500);
      } catch {
        showMessage("Login failed. Try again.", "error");
      }
    }
  }

  // Admin form submission
  async function handleAdmin(e) {
    e.preventDefault();
    const name = e.target.nome.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.senha.value.trim();
    const token = e.target.token.value.trim();

    if (await validateAdmin({ name, email, password, token })) {
      // Admin login: keep local only (ou implemente rota backend se necessário)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userName', name);
      showMessage("Admin login successful!", "success");
      setTimeout(() => navigate(ROUTES.PERFORMANCE), 1500);
    }
  }

  // Registration form submission
  async function handleRegistration(e) {
    e.preventDefault();
    const name = e.target.nome.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.senha.value.trim();
    const confirmPassword = e.target.confirmarSenha.value.trim();
    const telefone = e.target.telefone.value.trim();
    const cpf = e.target.cpf.value.trim();
    const birthDate = e.target.dataNascimento.value.trim();
    if (await validateRegistration({ name, email, password, confirmPassword })) {
      try {
        // Cadastro via backend
        const [firstName, ...lastArr] = name.split(' ');
        const lastName = lastArr.join(' ');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            phone: telefone,
            cpf,
            birthDate: birthDate ? new Date(birthDate) : undefined,
            address: [{
              street: "-",
              number: "-",
              complement: "",
              district: "-",
              city: "-",
              state: "-",
              zipCode: "-",
              id: `address_${Date.now()}`
            }],
            card: [],
            privacy: {}
          })
        });
        if (!res.ok) {
          showMessage("Registration failed. Try again.", "error");
          return;
        }
        showMessage("Registration successful! Please log in to continue.", "success");
        setTab('login');
      } catch {
        showMessage("Registration failed. Try again.", "error");
      }
    }
  }

  return (
    <>
      {/* Simple header for login/logout */}
      <HeaderLogs />
      {/* Centered container with responsive form */}
      <Box sx={{ minHeight: '100vh', background: '#f5fafd', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <Paper elevation={4} sx={{ maxWidth: 400, width: '100%', p: { xs: 2, md: 4 }, borderRadius: 4, mt: 2 }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700, color: '#004d66', mb: 2 }}>
            {tab === 'login' ? 'Login' : 'Register'}
          </Typography>
          {/* Tabs to switch between login and registration */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ mb: 2 }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Login" value="login" />
            <Tab label="Register" value="register" />
          </Tabs>
          {/* Login form: switch between client and admin */}
          {tab === 'login' && (
            <>
              <Tabs
                value={userType}
                onChange={(_, v) => setUserType(v)}
                variant="fullWidth"
                sx={{ mb: 2 }}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Client" value="client" />
                <Tab label="Administrator" value="admin" />
              </Tabs>
              {/* Client login form */}
              {userType === 'client' && (
                <Box component="form" onSubmit={handleClient} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Removido campo Name */}
                  <TextField label="E-mail" id="email-cliente" name="email" required fullWidth size="small" type="email" placeholder="Ex: usuario@gmail.com" />
                  <TextField label="Password" id="senha-cliente" name="senha" required fullWidth size="small" type="password" placeholder="Ex: @Eletrocurte-se-100%" />
                  <Button type="submit" variant="contained" sx={{ background: '#007b99', color: '#fff', fontWeight: 600, borderRadius: 2, mt: 1, '&:hover': { background: '#004d66' } }}>
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate(ROUTES.HOME_PAGE, { replace: true })}
                  >
                    Back
                  </Button>
                </Box>
              )}
              {/* Admin login form */}
              {userType === 'admin' && (
                <Box component="form" onSubmit={handleAdmin} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Name" id="nome-admin" name="nome" required fullWidth size="small" placeholder="Ex: Abcdef" />
                  <TextField label="E-mail" id="email-admin" name="email" required fullWidth size="small" type="email" placeholder="Ex: admin@empresa.com" />
                  <TextField label="Password" id="senha-admin" name="senha" required fullWidth size="small" type="password" placeholder="Ex: @Eletrocurte-se-100%" />
                  <TextField
                    label="Security Token"
                    id="token"
                    name="token"
                    required
                    fullWidth
                    size="small"
                    placeholder="Ex: 123456"
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      maxLength: 6,
                    }}
                    onInput={e => {
                      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    }}
                  />
                  <Button type="submit" variant="contained" sx={{ background: '#007b99', color: '#fff', fontWeight: 600, borderRadius: 2, mt: 1, '&:hover': { background: '#004d66' } }}>
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate(ROUTES.HOME_PAGE, { replace: true })}
                  >
                    Back
                  </Button>
                </Box>
              )}
            </>
          )}
          {/* Registration form */}
          {tab === 'register' && (
            <Box component="form" onSubmit={handleRegistration} autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Full Name" id="nome-cadastro" name="nome" required fullWidth size="small" placeholder="Ex: Abcdef" />
              <TextField label="E-mail" id="email-cadastro" name="email" required fullWidth size="small" type="email" placeholder="Ex: usuario@gmail.com" />
              <TextField
                label="Phone"
                id="telefone-cadastro"
                name="telefone"
                required
                fullWidth
                size="small"
                placeholder="(00) 00000-0000"
                inputProps={{ maxLength: 15 }}
                onInput={e => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
                  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
                  if (v.length > 7) v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
                  else if (v.length > 6) v = v.replace(/(\d{4})(\d{4})$/, '$1-$2');
                  e.target.value = v;
                }}
              />
              <TextField label="CPF" id="cpf-cadastro" name="cpf" required fullWidth size="small" placeholder="000.000.000-00"
                inputProps={{ maxLength: 14 }}
                onInput={e => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
                  v = v.replace(/(\d{3})(\d)/, '$1.$2');
                  v = v.replace(/(\d{3})(\d)/, '$1.$2');
                  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                  e.target.value = v;
                }}
              />
              <TextField
                label="Date of Birth"
                id="data-nascimento-cadastro"
                name="dataNascimento"
                required
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <TextField label="Password" id="senha-cadastro" name="senha" required fullWidth size="small" type="password" placeholder="Ex: @Eletrocurte-se-100%" />
              <TextField label="Confirm Password" id="confirmar-senha-cadastro" name="confirmarSenha" required fullWidth size="small" type="password" placeholder="Repeat password" />
              <Button type="submit" variant="contained" sx={{ background: '#007b99', color: '#fff', fontWeight: 600, borderRadius: 2, mt: 1, '&:hover': { background: '#004d66' } }}>
                Register
              </Button>
            </Box>
          )}
          {/* User feedback message */}
          {message && (
            <Box className={`message show ${messageType}`} sx={{ mt: 2, textAlign: 'center', background: messageType === 'success' ? '#4CAF50' : messageType === 'error' ? '#F44336' : '#2196F3', color: '#fff', p: 1.5, borderRadius: 2, fontWeight: 600 }}>{message}</Box>
          )}
        </Paper>
      </Box>
      <Footer />
    </>
  );
}