import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Presentation from './pages/Presentation';
import Login from './pages/Login';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import SectorPage from './pages/SectorPage';
import Profile from './pages/Profile';
import PurchaseHistory from './pages/PurchaseHistory';
import ProductsHistory from './pages/ProductsHistory';
import TermsConditions from './pages/TermsConditions';
import Checkout from './pages/Checkout';
import Logout from './pages/Logout';
import ProfileEdition from './pages/ProfileEdition';
import Desempenho from './pages/Desempenho';
import Time from './pages/Time';
import Vendas from './pages/Vendas';
import Pendencias from './pages/Pendencias';
import PaginaProdutoAdmin from './pages/PaginaProdutoAdmin';
import HomePage from './pages/HomePage';

// Centralized routes
import ROUTES from './routes';

// Component that defines the routes and visibility control
function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.PRESENTATION} element={<Presentation />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.PROFILE} element={<Profile />} />
        <Route path={ROUTES.LOGOUT} element={<Logout />} />
        <Route path={ROUTES.PAG_PRODUTO} element={<ProductPage />} />
        <Route path={ROUTES.PAG_PESQUISA} element={<SearchPage />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.PAG_SETOR} element={<SectorPage />} />
        <Route path={ROUTES.PURCHASE_HISTORY} element={<PurchaseHistory />} />
        <Route path={ROUTES.PROFILE_EDITION} element={<ProfileEdition />} />
        <Route path={ROUTES.PRODUCT_HISTORY} element={<ProductsHistory />} />
        <Route path={ROUTES.TERMS_CONDITIONS} element={<TermsConditions />} />
        <Route path={ROUTES.DESEMPENHO} element={<Desempenho />} />
        <Route path={ROUTES.TIME} element={<Time />} />
        <Route path={ROUTES.VENDAS} element={<Vendas />} />
        <Route path={ROUTES.PENDENCIAS} element={<Pendencias />} />
        <Route path={ROUTES.PAG_PRODUTO_ADMIN} element={<PaginaProdutoAdmin />} />
        <Route path={ROUTES.HOME_PAGE} element={<HomePage />} />
      </Routes>
    </>
  );
}

// Main app with router
function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;