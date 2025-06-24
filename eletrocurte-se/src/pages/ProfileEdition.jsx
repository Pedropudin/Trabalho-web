import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ROUTES from '../routes';
import Header from '../components/Header';
import '../styles/ProfileEdition.css';
import Footer from '../components/Footer'; 
import Orders from '../components/ProfileEdition/Orders';
import Wallet from '../components/ProfileEdition/Card/Wallet';
import Security from '../components/ProfileEdition/Security';
import Address from '../components/ProfileEdition/Address/Addresses';
import Privacy from '../components/ProfileEdition/Privacy';
import History from '../components/ProfileEdition/History';

/*
  User profile editing page.
  - Dynamically renders the section based on navigation flag.
  - Ensures safe navigation: only allows valid flags, otherwise redirects to profile.
  - Integrates components for each profile functionality (orders, messages, wallet, etc).
*/

export default function ProfileEdition() {
  const location = useLocation();
  const navigate = useNavigate();
  const flag = location.state?.flag || null;

  useEffect(() => {
    // Allows access only to valid flags, otherwise redirects to profile
    const validFlags = [
      'orders',
      'wallet',
      'security',
      'addresses',
      'privacy',
      'history',
    ];
    if (!flag || !validFlags.includes(flag)) {
      navigate(ROUTES.PROFILE);
    }
  }, [flag, navigate]);

  const handleVoltar = () => {
    console.log("handleVoltar called"); // Debug purpose
    navigate(ROUTES.PROFILE);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main className="editarperfil-body-content" style={{ flex: 1 }}>
        <div className="editarperfil-cards-grid">
          {/* Renders component based on selected flag */}
          {flag === 'orders' && <Orders onVoltar={handleVoltar} />}
          {flag === 'wallet' && <Wallet onBack={handleVoltar} />}
          {flag === 'security' && <Security onBack={handleVoltar} />}
          {flag === 'addresses' && <Address onVoltar={handleVoltar} />}
          {flag === 'privacy' && <Privacy onVoltar={handleVoltar} />}
          {flag === 'history' && <History onVoltar={handleVoltar} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}