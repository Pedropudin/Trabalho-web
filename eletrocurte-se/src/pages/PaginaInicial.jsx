import React, { useState, useEffect } from 'react';
import { ScrollRestoration, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../styles/PaginaInicial.css';
import ROUTES from '../routes';
import ProductCard from '../components/Produtos/ProductCard';
import ProductDetailsModal from '../components/Produtos/ProductDetailsModal';

/*
  Página inicial do portal Eletrocurte-se.
  - Banner de boas-vindas, produtos em destaque e chamada para ação.
  - Integração com autenticação, navegação e feedback visual.
  - Layout responsivo com Material-UI e alinhamento ao padrão visual do projeto.
*/

const PaginaInicial = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [produtosHistorico, setProdutosHistorico] = useState([]);
    // Estado para modal de detalhes do produto
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Verifica autenticação ao carregar a página
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    useEffect(() => {
        // Busca produtos em destaque do histórico
        fetch(process.env.PUBLIC_URL + '/data/products.json')
            .then(res => res.json())
            .then(data => setProdutosHistorico(data.produtosHistorico || []));
    }, []);

    // Handlers para funcionalidades restritas e navegação
    function handleRestrito(e) {
        if (!isLoggedIn) {
            e.preventDefault();
            setMensagem('Faça login para acessar esta funcionalidade!');
            setTimeout(() => setMensagem(''), 3500);
        }
    }

    function handleComeceAgora(e) {
        e.preventDefault();
        if (isLoggedIn) {
            navigate(ROUTES.PERFIL);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }

    function handleProfile() {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate(ROUTES.PERFIL);
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
            setMensagem('Você já está deslogado!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        setIsLoggedIn(false);
        setMensagem('Logout realizado com sucesso!');
        setTimeout(() => setMensagem(''), 3500);
        navigate(ROUTES.LOGOUT, { replace: true });
    }

    function handleSearchChange(e) {
        if (!isLoggedIn) {
            setMensagem('Faça login para pesquisar produtos!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
    }

    function handleCategoryClick(cat) {
        if (!isLoggedIn) {
            setMensagem('Faça login para filtrar por categoria!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
    }

    // Handlers para modal de detalhes do produto
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
                    setMensagem('Faça login para pesquisar produtos!');
                    setTimeout(() => setMensagem(''), 3500);
                }}
                onLogoClick={undefined} // Desabilita o redirecionamento na página inicial
            />
            {/* Mensagem amigável para funcionalidades restritas */}
            {mensagem && (
                <div className="mensagem show info" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#2196F3', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold' }}>{mensagem}</div>
            )}
            <Box className="landing-container" sx={{ background: '#f5fafd', minHeight: '100vh', pb: 4 }}>
                {/* Banner principal com chamada para ação */}
                {!isLoggedIn && (
                  <Paper elevation={3} className="banner" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(90deg, #1565c0 80%, #5e92f3 100%)', color: '#fff', p: { xs: 2, md: 6 }, gap: 4, flexWrap: 'wrap', mb: 4 }}>
                      <Box className="banner-content" sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: { xs: 'center', md: 'flex-start' }, minWidth: 220 }}>
                          <Typography variant="h3" component="h1" sx={{ color: '#fff', fontWeight: 700, mb: 1, fontSize: { xs: '2rem', md: '2.5rem' } }}>
                              Bem-vindo ao Eletrocurte-se
                          </Typography>
                          <Typography variant="subtitle1" sx={{ color: '#e3f2fd', mb: 2 }}>
                              Os melhores eletrônicos, ofertas e novidades para você!
                          </Typography>
                          <Button onClick={handleComeceAgora} variant="contained" sx={{ background: '#ffb300', color: '#222', fontWeight: 700, borderRadius: 2, px: 4, py: 1.5, '&:hover': { background: '#ffd54f', color: '#004d66' } }}>
                              Comece agora
                          </Button>
                      </Box>
                  </Paper>
                )}
                {/* Produtos em destaque */}
                <Box className="produtos-destaque" sx={{ maxWidth: 1200, mx: 'auto', px: 2, mb: 6 }}>
                    <Typography variant="h4" sx={{ color: '#004d66', mb: 5, }}>Produtos em destaque</Typography>
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
                                        Nenhum produto disponível no momento.
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
                {/* Chamada para ação extra: newsletter para logados */}
                {isLoggedIn && (
                    <Box className="cta-extra" sx={{ maxWidth: 600, mx: 'auto', background: '#e3f2fd', borderRadius: 3, boxShadow: 2, p: { xs: 2, md: 4 }, textAlign: 'center', mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#004d66', mb: 2 }}>Receba ofertas exclusivas!</Typography>
                        <Box component="form" className="newsletter-form" sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <input type="email" placeholder="Seu e-mail" required style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #b0bec5', fontSize: '1rem', flex: 1, minWidth: 0 }} />
                            <Button type="submit" variant="contained" sx={{ background: '#ffb300', color: '#222', borderRadius: 1, px: 3, fontWeight: 500, '&:hover': { background: '#ffd54f' } }}>
                                Quero receber
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
            {/* Modal de detalhes do produto */}
            <ProductDetailsModal open={modalOpen} onClose={handleModalClose} product={selectedProduct} />
            <ScrollToTop />
            <Footer />
        </>
    );
};

export default PaginaInicial;