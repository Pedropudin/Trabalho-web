import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ROUTES from '../routes';
import '../styles/Profile.css';
import Footer from '../components/Footer';

/*
  User Profile Page.
  - Displays a personalized greeting and shortcuts to all profile features.
  - Each card navigates to the respective editing area via programmatic navigation.
  - Responsive and accessible layout aligned with the project's visual standards.
*/

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
        .then(res => res.json())
        .then(setUser)
        .catch(() => setUser(null));
    }
  }, []);

  // Navigates to the editing area corresponding to the clicked card
  function handleCardClick(flag) {
    navigate(ROUTES.PROFILE_EDITION, { state: { flag } });
  }

  return (
    <>
      <Header />
      <main className="body-content">
        <br />
        {/* Personalized greeting */}
        <h2>
          Hello, <span id="nome-usuario" data-testid="nome-usuario">
            {/* Mostra o nome do backend se disponível, senão fallback */}
            {user?.firstName
              ? user.firstName
              : localStorage.getItem('userName') ||
                localStorage.getItem('nomeUsuario') ||
                "User"}
          </span>
        </h2>
        {/* Grid of profile feature cards */}
        <div className="cards-grid">
          {/* Each card represents a profile feature */}
          <div className="card" onClick={() => handleCardClick('orders')} tabIndex={0} role="button">
            <i className="fas fa-search fa-2x"></i>
            <h3>Orders</h3>
            <p>Track the status of your products</p>
          </div>
          <div className="card" onClick={() => handleCardClick('messages')} tabIndex={0} role="button">
            <i className="fas fa-envelope fa-2x"></i>
            <h3>Messages</h3>
            <p>See your messages and news</p>
          </div>
          <div className="card" onClick={() => handleCardClick('wallet')} tabIndex={0} role="button">
            <i className="fas fa-wallet fa-2x"></i>
            <h3>Wallet</h3>
            <p>Manage your balance and accounts</p>
          </div>
          <div className="card" onClick={() => handleCardClick('security')} tabIndex={0} role="button">
            <i className="fas fa-shield-alt fa-2x"></i>
            <h3>Security</h3>
            <p>Update your password, email, and CPF</p>
          </div>
          <div className="card" onClick={() => handleCardClick('addresses')} tabIndex={0} role="button">
            <i className="fas fa-map-marker-alt fa-2x"></i>
            <h3>Addresses</h3>
            <p>Manage your delivery locations</p>
          </div>
          <div className="card" onClick={() => handleCardClick('privacy')} tabIndex={0} role="button">
            <i className="fas fa-user-secret fa-2x"></i>
            <h3>Privacy</h3>
            <p>Security and data settings</p>
          </div>
          <div className="card wide-card" onClick={() => handleCardClick('history')} tabIndex={0} role="button">
            <i className="fas fa-history fa-2x"></i>
            <h3>History</h3>
            <p>View your purchases and products</p>
          </div>
        </div>
      </main>
      {/* Standard footer */}
      <Footer />
    </>
  );
}