import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Button from '../components/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../styles/PaginaInicial.css';
import ROUTES from '../routes';
import ProductCard from '../components/Products/ProductCard';
import ProductDetailsModal from '../components/Products/ProductDetailsModal';

/*
  Home page of the Eletrocurte-se portal.
  - Welcome banner, featured products, and call-to-action.
  - Integrated with authentication, navigation, and visual feedback.
  - Responsive layout using Material-UI and aligned with project visual standards.
*/

const PaginaInicial = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [produtosHistorico, setProdutosHistorico] = useState([]);
    // State for product details modal
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Check authentication on page load
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    useEffect(() => {
        // Fetch featured products from history
        fetch(process.env.PUBLIC_URL + '/data/products.json')
            .then(res => res.json())
            .then(data => setProdutosHistorico(data.produtosHistorico || []));
    }, []);

    function handleComeceAgora(e) {
        e.preventDefault();
        if (isLoggedIn) {
            navigate(ROUTES.PERFIL);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }

    // Certifique-se de que, se passar onProfile, ele faz navigate(ROUTES.PROFILE)
    function handleProfile() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate(ROUTES.PROFILE);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }

    function handleCart() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate(ROUTES.CHECKOUT);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }

    function handleLogout() {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            setMensagem('You are already logged out!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        setMensagem('Successfully logged out!');
        setTimeout(() => setMensagem(''), 3500);
        navigate(ROUTES.LOGOUT, { replace: true });
    }

    function handleSearchChange(e) {
        if (!isLoggedIn) {
            setMensagem('Log in to search for products!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
    }

    function handleCategoryClick(cat) {
        if (!isLoggedIn) {
            setMensagem('Log in to filter by category!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
    }

    // Handlers for product detail modal
    const handleProductClick = (product) => {
        setSelectedProduct({ ...product, showBuyButton: true });
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <>
            <Header
                onProfile={handleProfile}
                onCart={handleCart}
                onLogout={handleLogout}
                onSearchChange={handleSearchChange}
                onCategoryClick={handleCategoryClick}
                searchDisabled={!isLoggedIn}
                onSearchDenied={() => {
                    setMensagem('Log in to search for products!');
                    setTimeout(() => setMensagem(''), 3500);
                }}
                onLogoClick={undefined}
            />
            {/* Friendly message for restricted features */}
            {mensagem && (
                <div className="mensagem show info" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#2196F3', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold' }}>{mensagem}</div>
            )}
            <Box className="landing-container" sx={{ background: '#f5fafd', minHeight: '100vh', pb: 4 }}>
                {/* Main banner with call-to-action */}
                {!isLoggedIn && (
                    <Paper elevation={3} className="banner" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg, #1565c0 80%, #5e92f3 100%)', color: '#fff', p: { xs: 2, md: 6 }, gap: 4, flexWrap: 'wrap', mb: 4 }}>
                        <Box className="banner-content" sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: { xs: 'center', md: 'flex-start' }, minWidth: 220 }}>
                            <Typography variant="h3" component="h1" sx={{ color: '#fff', fontWeight: 700, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                                Welcome to Eletrocurte-se
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: '#e3f2fd', mb: 2 }}>
                                The best electronics, deals and news for you!
                            </Typography>
                            <Button
                                text="Start now"
                                onClick={handleComeceAgora}
                                type={1}
                                style={{
                                    background: '#ffb300',
                                    color: '#222',
                                    fontWeight: 700,
                                    borderRadius: 8,
                                    padding: '12px 32px',
                                    fontSize: '1.1rem',
                                    marginTop: 8,
                                    boxShadow: '0 2px 8px #0002',
                                    border: 'none'
                                }}
                            />
                        </Box>
                    </Paper>
                )}
                {/* Featured products */}
                <Box className="produtos-destaque" sx={{ maxWidth: 1200, mx: 'auto', px: 2, mb: 6 }}>
                    <Typography variant="h4" sx={{ color: '#004d66', mb: 5, }}>Featured Products</Typography>
                    <Grid
                        container
                        columns={{ xs: 1, sm: 2, md: 3 }}
                        columnSpacing={3}
                        rowSpacing={3}
                        justifyContent="center"
                        alignItems="stretch"
                        sx={{ margin: 0, width: '100%', flexWrap: 'wrap' }}
                    >
                        {produtosHistorico.slice(0, 12).length === 0 ? (
                            <Grid sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center', width: '100%', maxWidth: 320 }}>
                                    <Typography variant="subtitle1" sx={{ color: '#888' }}>
                                        No products available at the moment.
                                    </Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            produtosHistorico.slice(0, 12).map((produto, idx) => (
                                <Grid key={produto.nome + idx} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <ProductCard 
                                        product={produto} 
                                        onClick={handleProductClick} 
                                        isLoggedIn={isLoggedIn}
                                        pageType="home"
                                        showBuyButton={true}
                                    />
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>
                {/* Extra call-to-action: newsletter for logged-in users */}
                {isLoggedIn && (
                    <Paper elevation={2} className="cta-extra" sx={{ maxWidth: 600, mx: 'auto', background: '#e3f2fd', borderRadius: 3, boxShadow: 2, p: { xs: 2, md: 4 }, textAlign: 'center', mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#004d66', mb: 2 }}>Receive exclusive offers!</Typography>
                        <form className="newsletter-form" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
                            <input type="email" placeholder="Your email" required style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #b0bec5', fontSize: '1rem', flex: 1, minWidth: 0 }} />
                            <Button
                                text="Subscribe"
                                type={1}
                                style={{
                                    background: '#ffb300',
                                    color: '#222',
                                    borderRadius: 6,
                                    padding: '10px 24px',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                    border: 'none'
                                }}
                            />
                        </form>
                    </Paper>
                )}
            </Box>
            {/* Product details modal */}
            <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
            <ScrollToTop />
            <Footer />
        </>
    );
};

export default PaginaInicial;