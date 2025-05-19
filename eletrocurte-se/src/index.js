import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';
import './styles/Login.css';
import './styles/Apresentacao.css';
import './styles/EditarPerfil.css';
import './styles/HistoricoCompras.css';
import './styles/HistoricoProdutos.css';
import './styles/Perfil.css';
import './styles/TermosCondicoes.css';
import './styles/Header.css';
import './styles/HeaderLogs.css';
import './styles/EfeitoEletrico.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);