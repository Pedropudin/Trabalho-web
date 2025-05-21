import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/Perfil.css';
import Footer from '../components/Footer';

/*
  Página de Perfil do usuário.
  Exibe informações básicas e atalhos para funcionalidades do perfil.
*/

export default function Perfil() {
  const navigate = useNavigate();
  const nomeUsuario = "João Silva"; // Substitua por dados reais do usuário

  // Função para navegação dos cards (pode ser expandida)
  function handleCardClick(url) {
    navigate(url);
  }

  return (
    <>
      <Header />
      <main className="body-content">
        <br />
        {/* Saudação personalizada ao usuário */}
        <h2>Olá, <span id="nome-usuario">{nomeUsuario}</span></h2>

        {/* Grade de cartões com funcionalidades */}
        <div className="cards-grid">
          {/* Card: Pedidos */}
          <div className="card" onClick={() => handleCardClick('/pages/EditarPerfil')} tabIndex={0} role="button">
            <i className="fas fa-search fa-2x"></i>
            <h3>Pedidos</h3>
            <p>Acompanhe o status dos seus produtos</p>
          </div>

          {/* Card: Mensagens */}
          <div className="card" onClick={() => handleCardClick('/pages/EditarPerfil')} tabIndex={0} role="button">
            <i className="fas fa-envelope fa-2x"></i>
            <h3>Mensagens</h3>
            <p>Veja suas mensagens e novidades</p>
          </div>

          {/* Card: Carteira */}
          <div className="card" onClick={() => handleCardClick('/pages/EditarPerfil')} tabIndex={0} role="button">
            <i className="fas fa-wallet fa-2x"></i>
            <h3>Carteira</h3>
            <p>Gerencie seu saldo e contas</p>
          </div>

          {/* Card: Segurança */}
          <div className="card" onClick={() => handleCardClick('/pages/EditarPerfil')} tabIndex={0} role="button">
            <i className="fas fa-shield-alt fa-2x"></i>
            <h3>Segurança</h3>
            <p>Atualize senha, e-mail e CPF</p>
          </div>

          {/* Card: Endereços */}
          <div className="card" onClick={() => handleCardClick('/pages/EditarPerfil')} tabIndex={0} role="button">
            <i className="fas fa-map-marker-alt fa-2x"></i>
            <h3>Endereços</h3>
            <p>Administre seus locais de entrega</p>
          </div>

          {/* Card: Privacidade */}
          <div className="card" onClick={() => handleCardClick('/pages/EditarPerfil')} tabIndex={0} role="button">
            <i className="fas fa-user-secret fa-2x"></i>
            <h3>Privacidade</h3>
            <p>Configurações de segurança e dados</p>
          </div>

          {/* Card: Histórico de compras (mais largo) */}
          <div className="card wide-card" onClick={() => handleCardClick('/pages/EditarPerfil')} tabIndex={0} role="button">
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