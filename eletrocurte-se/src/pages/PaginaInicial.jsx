import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { produtosHistorico } from '../products';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../styles/PaginaInicial.css';
import ROUTES from '../routes';

const categorias = ['Hardware', 'Periféricos', 'Computadores', 'Celulares'];

const PaginaInicial = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }, []);

    // Handler para funcionalidades restritas
    function handleRestrito(e) {
        if (!isLoggedIn) {
            e.preventDefault();
            setMensagem('Faça login para acessar esta funcionalidade!');
            setTimeout(() => setMensagem(''), 3500);
        }
    }

    // Handler para botão "Comece agora"
    function handleComeceAgora(e) {
        e.preventDefault();
        if (isLoggedIn) {
            navigate(ROUTES.PERFIL);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }

    // Funções para Header
    function handleProfile() {
        if (isLoggedIn) {
            navigate(ROUTES.PERFIL);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }

    function handleCart() {
        if (isLoggedIn) {
            setMensagem('Funcionalidade de carrinho em breve!');
            setTimeout(() => setMensagem(''), 3500);
        } else {
            navigate(ROUTES.LOGIN);
        }
    }

    function handleLogout() {
        if (!isLoggedIn) return; // Não faz nada se não estiver logado
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setMensagem('Logout realizado com sucesso!');
        setTimeout(() => setMensagem(''), 3500);
        navigate(ROUTES.LOGOUT);
    }

    function handleSearchChange(e) {
        if (!isLoggedIn) {
            setMensagem('Faça login para pesquisar produtos!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
        // Aqui você pode implementar a lógica de pesquisa real
    }

    function handleCategoryClick(cat) {
        if (!isLoggedIn) {
            setMensagem('Faça login para filtrar por categoria!');
            setTimeout(() => setMensagem(''), 3500);
            return;
        }
        // Aqui você pode implementar a lógica de filtro real
    }

    return (
        <>
            <Header
                onProfile={handleProfile}
                onCart={handleCart}
                onLogout={handleLogout}
                onSearchChange={handleSearchChange}
                onCategoryClick={handleCategoryClick}
            />
            {/* Mensagem amigável para funcionalidades restritas */}
            {mensagem && (
                <div className="mensagem show info" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#2196F3', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold' }}>{mensagem}</div>
            )}
            <Box className="landing-container" sx={{ background: '#f5fafd', minHeight: '100vh', pb: 4 }}>
                {/* Banner principal */}
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

                {/* Produtos em destaque */}
                <Box className="produtos-destaque" sx={{ maxWidth: 1200, mx: 'auto', px: 2, mb: 6 }}>
                    <Typography variant="h5" sx={{ color: '#004d66', mb: 2 }}>Produtos em destaque</Typography>
                    <Grid 
                        container 
                        spacing={3} 
                        justifyContent="center" 
                        alignItems="stretch"
                        sx={{
                            margin: 0,
                            width: '100%',
                            flexWrap: 'wrap',
                        }}
                    >
                        {produtosHistorico.slice(0, 6).length === 0 ? (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center', width: '100%', maxWidth: 320 }}>
                                    <Typography variant="subtitle1" sx={{ color: '#888' }}>
                                        Nenhum produto disponível no momento.
                                    </Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            produtosHistorico.slice(0, 6).map((produto, idx) => (
                                <Grid 
                                    item 
                                    xs={12} sm={6} md={4} 
                                    key={produto.nome + idx}
                                    sx={{ display: 'flex', justifyContent: 'center' }}
                                >
                                    <Paper elevation={2} className="produto-card" sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: '0.2s', '&:hover': { boxShadow: 8, transform: 'scale(1.03)' }, width: '100%', maxWidth: 320 }}>
                                        <Box component="img" src={produto.img} alt={produto.nome} sx={{ width: 100, height: 100, objectFit: 'contain', mb: 2, borderRadius: 1, background: '#f5f5f5' }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>{produto.nome}</Typography>
                                        <Typography className="preco" sx={{ color: '#007b99', fontWeight: 700, mb: 2 }}>{produto.preco}</Typography>
                                        <Button variant="contained" sx={{ background: '#007b99', color: '#fff', borderRadius: 1, px: 3, py: 1, fontWeight: 500, '&:hover': { background: '#004d66' } }} onClick={handleRestrito}>
                                            Comprar
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>

                {/* Chamada para ação extra: só para logados */}
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
            <Footer />
        </>
    );
};

export default PaginaInicial;