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
import Performance from './pages/Performance';
import Team from './pages/Team';
import Sales from './pages/Sales';
import Pending from './pages/Pending';
import AdminProductPage from './pages/AdminProductPage';
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
        <Route path={ROUTES.PRODUCT_PAGE} element={<ProductPage />} />
        <Route path={ROUTES.SEARCH_PAGE} element={<SearchPage />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.SECTOR_PAGE} element={<SectorPage />} />
        <Route path={ROUTES.PURCHASE_HISTORY} element={<PurchaseHistory />} />
        <Route path={ROUTES.PROFILE_EDITION} element={<ProfileEdition />} />
        <Route path={ROUTES.PRODUCT_HISTORY} element={<ProductsHistory />} />
        <Route path={ROUTES.TERMS_CONDITIONS} element={<TermsConditions />} />
        <Route path={ROUTES.PERFORMANCE} element={<Performance />} />
        <Route path={ROUTES.TEAM} element={<Team />} />
        <Route path={ROUTES.SALES} element={<Sales />} />
        <Route path={ROUTES.PENDING} element={<Pending />} />
        <Route path={ROUTES.ADMIN_PRODUCT_PAGE} element={<AdminProductPage />} />
        <Route path={ROUTES.HOME_PAGE} element={<HomePage />} />
      </Routes>
    </>
  );
}

// Main app with router
function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;