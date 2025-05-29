import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Páginas
import Apresentacao from './pages/Apresentacao';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import HistoricoCompras from './pages/HistoricoCompras';
import HistoricoProdutos from './pages/HistoricoProdutos';
import TermosCondicoes from './pages/TermosCondicoes';
import PaginaProduto from './pages/PaginaProduto';
import PaginaPesquisa from './pages/PaginaPesquisa';
import PaginaSetor from './pages/PaginaSetor';
import Checkout from './pages/Checkout';
import Logout from './pages/Logout';
import EditarPerfil from './pages/EditarPerfil';
import Desempenho from './pages/Desempenho';
import Pendencias from './pages/Pendencias';
import PaginaInicial from './pages/PaginaInicial';

// Rotas centralizadas
import ROUTES from './routes';

// Componente que define as rotas e o controle de visibilidade
function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.APRESENTACAO} element={<Apresentacao />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.PERFIL} element={<Perfil />} />
        <Route path={ROUTES.LOGOUT} element={<Logout />} />
        <Route path={ROUTES.PAG_PRODUTO} element={<PaginaProduto />} />
        <Route path={ROUTES.PAG_PESQUISA} element={<PaginaPesquisa />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.PAG_SETOR} element={<PaginaSetor />} />
        <Route path={ROUTES.HIST_COMPRAS} element={<HistoricoCompras />} />
        <Route path={ROUTES.EDITAR_PERFIL} element={<EditarPerfil />} />
        <Route path={ROUTES.HIST_PRODUTOS} element={<HistoricoProdutos />} />
        <Route path={ROUTES.TERMOS} element={<TermosCondicoes />} />
        <Route path={ROUTES.LOGOUT} element={<Logout />} />
        <Route path={ROUTES.DESEMPENHO} element={<Desempenho />} />
        <Route path={ROUTES.PENDENCIAS} element={<Pendencias />} />
        <Route path={ROUTES.PAGINA_INICIAL} element={<PaginaInicial />} />
      </Routes>
    </>
  );
}

// App principal com o roteador
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;