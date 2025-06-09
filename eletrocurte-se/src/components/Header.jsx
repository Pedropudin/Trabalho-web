// -----------------------------------------------------------------------------
// Header.jsx
// Cabeçalho principal do sistema Eletrocurte-se.
// Exibe logo, barra de pesquisa, menu de usuário, carrinho, logout e categorias.
// Responsivo, utiliza Material-UI e styled-components para estilização.
// Integração com badge animado, menu mobile e props customizáveis.
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import ROUTES from '../routes';
import {useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import '../styles/Header.css';

// Animação pulse para o badge do carrinho
const pulseKeyframes = `
@keyframes pulse {
  0% { transform: scale(1);}
  100% { transform: scale(1.15);}
}
`;

// Logo estilizado, com efeito de hover
const Logo = styled('img')(({ theme }) => ({
  width: 85,
  height: 85,
  borderRadius: '50%',
  marginRight: theme.spacing(2),
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'rotate(10deg) scale(1.05)',
    boxShadow: `0 0 10px ${alpha('#fff', 0.4)}`,
  },
}));

// Wrapper para centralizar barra de pesquisa
const SearchWrapper = styled(Box)(({ theme }) => ({
  flex: 1, // Ocupa o máximo de espaço possível entre logo e ícones
  display: 'flex', // Layout flexível horizontal
  justifyContent: 'center', // Centraliza a barra de pesquisa
  alignItems: 'center', // Alinha verticalmente
  minWidth: 0, // Permite encolher em telas pequenas
  marginLeft: theme.spacing(2), // Espaço à esquerda
  marginRight: theme.spacing(2), // Espaço à direita
  // theme.breakpoints.down('sm') aplica estilos para telas <= 600px (mobile)
  [theme.breakpoints.down('sm')]: {
    order: 3, // Move para baixo no layout mobile
    width: '100%', // Ocupa toda a largura
    margin: `${theme.spacing(1)} 0`, // Margem vertical reduzida
  },
}));

// Barra de pesquisa estilizada, sem efeito de foco
const Search = styled('div')(({ theme }) => ({
  backgroundColor: '#fff', // Fundo branco
  borderRadius: 12, // Cantos arredondados
  display: 'flex', // Layout flexível horizontal
  alignItems: 'center', // Alinha verticalmente
  padding: '12px 18px', // Espaçamento interno padrão
  flex: 1, // Ocupa o máximo de espaço possível
  minWidth: 0, // Permite encolher
  maxWidth: 700, // Largura máxima em telas grandes
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)', // Sombra leve
  transition: 'box-shadow 0.2s, border 0.2s', // Transição suave
  border: '2px solid transparent', // Borda invisível (pode ser usada para foco)

  // theme.breakpoints.down('md') aplica estilos para telas <= 900px (tablets)
  [theme.breakpoints.down('md')]: {
    maxWidth: 450, // Reduz largura máxima em tablets
    padding: '10px 12px', // Reduz padding
  },

  // theme.breakpoints.down('sm') aplica estilos para telas <= 600px (mobile)
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%', // Ocupa toda a largura
    width: '100%',
    padding: '8px 8px', // Padding ainda menor
  },
}));

// Barra de categorias horizontal
const CategoryBar = styled(Box)(({ theme }) => ({
  display: 'flex', // Layout horizontal
  justifyContent: 'center', // Centraliza categorias
  alignItems: 'center', // Alinha verticalmente
  backgroundColor: '#003d52', // Fundo azul escuro
  padding: '8px', // Espaçamento interno
  gap: '10px', // Espaço entre categorias

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column', // Empilha categorias verticalmente
    gap: '0', // Remove espaçamento extra
  },
}));

// Link de categoria customizado, sem destaque azul
const CategoryLink = styled(RouterLink, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: 'white',
  textDecoration: 'none',
  fontSize: 16,
  padding: '8px 16px',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: active ? 'bold' : 'normal',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  transition: 'background-color 0.3s, font-weight 0.3s, box-shadow 0.2s',
  '&:hover': {
    backgroundColor: '#007b99',
    boxShadow: '0 2px 8px 0 rgba(0,188,212,0.10)',
  },
}));

// Normaliza o contador do carrinho para exibir '9+' se necessário
function normalizeCartCount(count) {
  return count > 9 ? '9+' : count;
}

function Header({
  // logoSrc: caminho da imagem da logo exibida no cabeçalho
  // onLogoClick: função chamada ao clicar na logo
  // onSearchChange: callback para mudança no campo de pesquisa
  // categories: array de strings com nomes das categorias exibidas
  // selectedCategoryIndex: índice da categoria inicialmente selecionada
  // onCategoryClick: callback ao clicar em uma categoria
  // useElementsMenu: array de booleans [perfil, carrinho, logout] para exibir ou não cada ícone
  // onProfile, onCart, onLogout: callbacks para ações dos ícones
  // cartCount: número de itens no carrinho (badge)
  // searchDisabled: desabilita campo de pesquisa se true
  // onSearchDenied: callback chamado ao tentar pesquisar com searchDisabled
  logoSrc = '/logo-com-borda.png',
  onLogoClick,
  onSearchChange,
  categories = ['Hardware', 'Periféricos', 'Computadores', 'Celulares'],
  selectedCategoryIndex = 0,
  onCategoryClick,
  adminContext = false,
  useElementsMenu = [true, true, true],
  onProfile,
  onCart,
  onLogout,
  cartCount, // será ignorado, pois vamos calcular dinamicamente
  searchDisabled = false,
  onSearchDenied,
}) {
  // Estado do menu mobile
  const [anchorEl, setAnchorEl] = useState(null);
  // Categoria atualmente selecionada
  const [selectedCategory, setSelectedCategory] = useState(categories[selectedCategoryIndex] || '');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchValue, setSearchValue] = React.useState('');
  const navigate = useNavigate();

  // Calcula o número de itens no carrinho a partir do localStorage
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [mensagemCategoria, setMensagemCategoria] = useState('');
  const mensagemTimeoutRef = React.useRef(null);

  useEffect(() => {
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
      setCartItemsCount(total);
    }
    updateCartCount();

    // Permite atualização instantânea via window.forceCartUpdate()
    window.forceCartUpdate = updateCartCount;

    function handleStorage(e) {
      if (e.key === 'cart') updateCartCount();
    }
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      delete window.forceCartUpdate;
    };
  }, []);

  // Abre menu mobile
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  // Fecha menu mobile
  const handleClose = () => setAnchorEl(null);

  // Centraliza a lógica de autenticação
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Seleciona categoria e dispara callback
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (onCategoryClick) onCategoryClick(cat);
  };

  // Perfil: se logado vai para perfil, senão para login
  const handleProfileClick = () => {
    if (onProfile) {
      onProfile();
    } else {
      if (isLoggedIn) {
        navigate(ROUTES.PERFIL);
      } else {
        navigate(ROUTES.LOGIN);
      }
    }
  };

  // Carrinho: só permite se logado, senão vai para login
  // Handler para mudança no campo de pesquisa
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearchChange) onSearchChange(e);
  };

  //Envio de conteúdo da barra de pesquisa
  const handleSearchKeyDown = (e) => {
    const searchRealValue = searchValue.trim()
    if (searchDisabled) {
      if (onSearchDenied) onSearchDenied();
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter' && searchRealValue) {
      navigate(`/PaginaPesquisa/${encodeURIComponent(searchRealValue)}`);
    }
  };

  const handleCartClick = () => {
    if (onCart) {
      onCart();
    } else {
      if (isLoggedIn) {
        navigate(ROUTES.CHECKOUT);
      } else {
        navigate(ROUTES.LOGIN);
      }
    }
  };

  // Logo: usa prop ou padrão para home
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate(ROUTES.PAGINA_INICIAL);
    }
  };

  // Logout: usa prop ou padrão
  const handleLogoutInternal = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    navigate(ROUTES.LOGOUT, { replace: true });
  };

  // Função para exibir mensagem e garantir que só uma aparece por vez
  function showMensagemCategoria(msg) {
    setMensagemCategoria(msg);
    if (mensagemTimeoutRef.current) {
      clearTimeout(mensagemTimeoutRef.current);
    }
    mensagemTimeoutRef.current = setTimeout(() => {
      setMensagemCategoria('');
      mensagemTimeoutRef.current = null;
    }, 3500);
  }

  return (
    <>
      {/* Animação pulse para badge do carrinho */}
      <style>{pulseKeyframes}</style>
      {/* Mensagem de aviso para categorias */}
      {mensagemCategoria && (
        <div className="mensagem show info" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#2196F3', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold' }}>
          {mensagemCategoria}
        </div>
      )}
      <AppBar
        position="static"
        sx={{
          // Gradiente de fundo do cabeçalho
          background: 'linear-gradient(90deg, #004d66 80%, #007b99 100%)',
          color: '#fff',
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex', // Layout flexível horizontal
            alignItems: 'center',
            gap: 2, // Espaçamento entre elementos
            flexWrap: isMobile ? 'wrap' : 'nowrap', // Quebra linha no mobile
            justifyContent: isMobile ? 'center' : 'flex-start',
            minHeight: { xs: 90, sm: 90, md: 100 }, // Altura mínima responsiva
          }}
        >
          {/* Logo do sistema */}
          <Logo src={logoSrc} alt="Logo" onClick={handleLogoClick} />
          {/* Barra de pesquisa centralizada */}
          <SearchWrapper>
            <Search>
              <InputBase
                placeholder="Pesquisar…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                sx={{
                  width: '100%', // Ocupa toda a largura do Search
                  fontSize: { xs: 16, sm: 18 }, // Tamanho responsivo da fonte
                  color: '#222', // Cor do texto
                  backgroundColor: '#fff', // Fundo branco
                  cursor: 'text', // Cursor padrão de texto
                }}
              />
            </Search>
          </SearchWrapper>
          {/* Menu desktop: perfil, carrinho, logout */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' }, // Esconde no mobile
              alignItems: 'center',
              gap: 2,
              minWidth: 0,
            }}
          >
            { useElementsMenu[0] && <IconButton
              color="inherit"
              onClick={handleProfileClick}
              sx={{
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(0,123,153,0.15)' }, // Hover azul claro
              }}
            >
              <AccountCircle />
            </IconButton>}
            { useElementsMenu[1] && <IconButton
              color="inherit"
              onClick={handleCartClick}
              sx={{
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(0,123,153,0.15)' },
              }}
            >
              {cartItemsCount > 0 ? (
                <Badge
                  badgeContent={normalizeCartCount(cartItemsCount)}
                  color="secondary"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: 'pulse 1s infinite alternate', // Animação do badge
                      minWidth: 22, // Largura mínima do badge
                      fontSize: 14, // Tamanho da fonte do badge
                      right: -3, // Ajuste de posição
                      top: 6,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              ) : (
                <ShoppingCartIcon />
              )}
            </IconButton>}
            { useElementsMenu[2] && <IconButton
              color="inherit"
              onClick={onLogout || handleLogoutInternal}
              sx={{
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(0,123,153,0.15)' },
              }}
            >
              <LogoutIcon />
            </IconButton>}
          </Box>
          {/* Menu mobile: hambúrguer */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleMenu} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* Exibe apenas as opções ativas conforme useElementsMenu */}
              {useElementsMenu[0] && (
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Perfil
                </MenuItem>
              )}
              {useElementsMenu[1] && (
                <MenuItem onClick={handleCartClick}>
                  <ListItemIcon>
                    <ShoppingCartIcon fontSize="small" />
                  </ListItemIcon>
                  Carrinho
                </MenuItem>
              )}
              {useElementsMenu[2] && (
                <MenuItem onClick={onLogout || handleLogoutInternal}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
        {/* Barra de categorias */}
        <CategoryBar>
          {categories.map((cat) => (
            <CategoryLink
              key={cat}
              active={selectedCategory === cat ? 1 : 0}
              to={ROUTES.PAG_SETOR.replace(
                ":name",
                cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
              )}
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  showMensagemCategoria('Faça login para filtrar por categoria!');
                } else {
                  handleCategoryClick(cat);
                }
              }}
              style={!isLoggedIn ? { color: '#aaa', cursor: 'pointer' } : {}}
              tabIndex={0}
            >
              {cat}
            </CategoryLink>
          ))}
        </CategoryBar>
      </AppBar>
    </>
  );
}

export default Header;
