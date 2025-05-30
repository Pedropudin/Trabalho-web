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
  Página de edição de perfil do usuário.
  - Renderiza dinamicamente a seção de acordo com o flag de navegação.
  - Garante navegação segura: só permite flags válidos, senão redireciona para perfil.
  - Integra componentes de cada funcionalidade do perfil (pedidos, mensagens, carteira, etc).
*/

export default function EditarPerfil() {
  const location = useLocation();
  const navigate = useNavigate();
  const flag = location.state?.flag || '';

  useEffect(() => {
    // Permite acesso apenas a flags válidos, senão volta para perfil
    const flagsSecundarias = [
      'pedidos',
      'mensagens',
      'carteira',
      'seguranca',
      'enderecos',
      'privacidade',
      'historico',
    ];
    if (!flag || !flagsSecundarias.includes(flag)) {
      navigate(ROUTES.PERFIL);
    }
  }, [flag, navigate]);

  return (
    <>
      <Header />
      <main className="editarperfil-body-content">
        <div className="editarperfil-cards-grid">
          {/* Renderiza componente conforme flag selecionado */}
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