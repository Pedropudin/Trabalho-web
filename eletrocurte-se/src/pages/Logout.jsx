import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Button } from '@mui/material';
import HeaderLogs from '../components/HeaderLogs';
import ROUTES from '../routes';
import '../styles/Logout.css';
import Footer from '../components/Footer';

/*
  Página de Logout do sistema.
  - Exibe mensagem de sucesso, contagem regressiva e botão para voltar à Home.
  - Remove flags de autenticação do localStorage e redireciona automaticamente.
  - Layout centralizado e responsivo com Material-UI.
*/

export default function Logout() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const intervalRef = useRef(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Remove flags de login ao sair e inicia contagem regressiva
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    setCountdown(10);
    if (timerRef.current) timerRef.current.textContent = 10;
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          navigate(ROUTES.PAGINA_INICIAL);
          return 0;
        }
        if (timerRef.current) timerRef.current.textContent = prev - 1;
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [navigate]);

  // Handler para botão de retorno imediato
  function handleHomeClick() {
    clearInterval(intervalRef.current);
    navigate(ROUTES.PAGINA_INICIAL);
  }

  return (
    <>
      {/* Cabeçalho com logo centralizado */}
      <HeaderLogs />

      {/* Container principal centralizado com mensagem e botão */}
      <Box sx={{ minHeight: '100vh', background: '#f5fafd', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 6 }}>
        <Paper elevation={6} sx={{ maxWidth: 420, width: '100%', p: { xs: 3, md: 5 }, borderRadius: 4, mt: 6, textAlign: 'center', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#004d66', mb: 2 }}>
            Logout
          </Typography>
          <Typography variant="h6" sx={{ color: '#007b99', mb: 2 }}>
            Operação de saída efetuada com sucesso
          </Typography>
          <Typography sx={{ color: '#333', mb: 2 }}>
            Obrigado por nos visitar, volte sempre ;)
          </Typography>
          <Typography sx={{ color: '#555', mb: 2 }}>
            Você será redirecionado em <span ref={timerRef}>{countdown}</span> segundos...
          </Typography>
          <Button variant="contained" color="primary" onClick={handleHomeClick} sx={{ mt: 2, fontWeight: 600, borderRadius: 2, background: '#007b99', '&:hover': { background: '#004d66' } }}>
            Voltar para a Home
          </Button>
        </Paper>
      </Box>

      {/* Rodapé institucional */}
      <Footer />
    </>
  );
}