import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeaderLogs from '../components/HeaderLogs';
import ROUTES from '../routes';
import '../styles/Logout.css';
import Footer from '../components/Footer';

/*
  Página de Logout adaptada do HTML antigo.
  Exibe mensagem de sucesso, contagem regressiva e botão para voltar à Home.
*/

export default function Logout() {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let countdown = 10;
    if (timerRef.current) timerRef.current.textContent = countdown;

    intervalRef.current = setInterval(() => {
      countdown--;
      if (timerRef.current) timerRef.current.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(intervalRef.current);
        navigate('/');
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  function handleHomeClick() {
    clearInterval(intervalRef.current);
    navigate('/');
  }

  return (
    <>
      {/* Cabeçalho com logo centralizado */}
      <HeaderLogs />

      {/* Container principal do logout, centralizando conteúdo */}
      <div className="logout-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '60vh' }}>
        <div className="logout-box" style={{ background: 'white', padding: 30, borderRadius: 10, boxShadow: '0 0 10px rgba(0,0,0,0.2)', maxWidth: 400, width: '90%' }}>
          <h2>Logout</h2>
          <p>Operação de saída efetuada com sucesso</p>
          <br />
          <p>Obrigado por nos visitar, volte sempre ;)</p>
          <br />
          <p>Você será redirecionado em <span id="timer" ref={timerRef}>10</span> segundos...</p>
          <button className="home-button" id="homeRedirect" type="button" onClick={handleHomeClick}>
            Voltar para a Home
          </button>
        </div>
      </div>

      {/* Rodapé com informações de contato e links externos */}
      <Footer />
    </>
  );
}