import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ROUTES from '../routes';
import Header from '../components/Header';
import '../styles/EditarPerfil.css';
import Footer from '../components/Footer';
import Pedidos from '../components/EditarPerfil/Pedidos';
import Mensagens from '../components/EditarPerfil/Mensagens';
import Carteira from '../components/EditarPerfil/Carteira/Carteira';
import Enderecos from '../components/EditarPerfil/Enderecos/Enderecos';
import Privacidade from '../components/EditarPerfil/Privacidade';
import FormSeguranca from '../components/EditarPerfil/Seguranca';
import Historico from '../components/EditarPerfil/Historico';

/*
  User profile editing page.
  - Dynamically renders the section based on navigation flag.
  - Ensures safe navigation: only allows valid flags, otherwise redirects to profile.
  - Integrates components for each profile functionality (orders, messages, wallet, etc).
*/

export default function EditProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const flag = location.state?.flag || '';

  useEffect(() => {
    // Allows access only to valid flags, otherwise redirects to profile
    const validFlags = [
      'pedidos',
      'mensagens',
      'carteira',
      'seguranca',
      'enderecos',
      'privacidade',
      'historico',
    ];
    if (!flag || !validFlags.includes(flag)) {
      navigate(ROUTES.PERFIL);
    }
  }, [flag, navigate]);

  return (
    <>
      <Header />
      <main className="editarperfil-body-content">
        <div className="editarperfil-cards-grid">
          {/* Renders component based on selected flag */}
          {flag === 'pedidos' && <Pedidos onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'mensagens' && <Mensagens onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'carteira' && <Carteira onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'seguranca' && <FormSeguranca onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'enderecos' && <Enderecos onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'privacidade' && <Privacidade onVoltar={() => navigate(ROUTES.PERFIL)} />}
          {flag === 'historico' && <Historico onVoltar={() => navigate(ROUTES.PERFIL)} />}
        </div>
      </main>
      <Footer />
    </>
  );
}