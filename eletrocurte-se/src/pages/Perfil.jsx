import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/Perfil.css';
import Footer from '../components/Footer';

/*
  Página de Perfil do usuário.
  - Exibe saudação personalizada e atalhos para todas as funcionalidades do perfil.
  - Cada card leva à respectiva área de edição via navegação programática.
  - Layout responsivo e acessível, alinhado ao padrão visual do projeto.
*/

export default function Perfil() {
  const navigate = useNavigate();
  const nomeUsuario = localStorage.getItem('nomeUsuario') || "Usuário"; // Busca nome salvo

  // Navega para a área de edição correspondente ao card clicado
  function handleCardClick(flag) {
    navigate(ROUTES.EDITAR_PERFIL, { state: { flag } });
  }

  return (
    <>
      <Header />
      <main className="body-content">
        <br />
        {/* Saudação personalizada */}
        <h2>Olá, <span id="nome-usuario">{nomeUsuario}</span></h2>

        {/* Grade de cartões de funcionalidades do perfil */}
        <div className="cards-grid">
          {/* Cada card representa uma funcionalidade do perfil */}
          <div className="card" onClick={() => handleCardClick('pedidos')} tabIndex={0} role="button">
            <i className="fas fa-search fa-2x"></i>
            <h3>Pedidos</h3>
            <p>Acompanhe o status dos seus produtos</p>
          </div>
          <div className="card" onClick={() => handleCardClick('mensagens')} tabIndex={0} role="button">
            <i className="fas fa-envelope fa-2x"></i>
            <h3>Mensagens</h3>
            <p>Veja suas mensagens e novidades</p>
          </div>
          <div className="card" onClick={() => handleCardClick('carteira')} tabIndex={0} role="button">
            <i className="fas fa-wallet fa-2x"></i>
            <h3>Carteira</h3>
            <p>Gerencie seu saldo e contas</p>
          </div>
          <div className="card" onClick={() => handleCardClick('seguranca')} tabIndex={0} role="button">
            <i className="fas fa-shield-alt fa-2x"></i>
            <h3>Segurança</h3>
            <p>Atualize senha, e-mail e CPF</p>
          </div>
          <div className="card" onClick={() => handleCardClick('enderecos')} tabIndex={0} role="button">
            <i className="fas fa-map-marker-alt fa-2x"></i>
            <h3>Endereços</h3>
            <p>Administre seus locais de entrega</p>
          </div>
          <div className="card" onClick={() => handleCardClick('privacidade')} tabIndex={0} role="button">
            <i className="fas fa-user-secret fa-2x"></i>
            <h3>Privacidade</h3>
            <p>Configurações de segurança e dados</p>
          </div>
          <div className="card wide-card" onClick={() => handleCardClick('historico')} tabIndex={0} role="button">
            <i className="fas fa-history fa-2x"></i>
            <h3>Histórico</h3>
            <p>Visualize suas compras e produtos</p>
          </div>
        </div>
      </main>
      {/* Rodapé padrão */}
      <Footer />
    </>
  );
}