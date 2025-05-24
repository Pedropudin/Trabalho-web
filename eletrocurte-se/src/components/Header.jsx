import React, { useState } from 'react';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import '../styles/Header.css';

// Animação pulse para o badge do carrinho
const pulseKeyframes = `
@keyframes pulse {
  0% { transform: scale(1);}
  100% { transform: scale(1.15);}
}
`;

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

const SearchWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 0,
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    order: 3,
    width: '100%',
    margin: `${theme.spacing(1)} 0`,
  },
}));

// Barra de pesquisa dinâmica, proporcional e sem efeito de foco
const Search = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  padding: '12px 18px',
  flex: 1,
  minWidth: 0,
  maxWidth: 700,
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)',
  transition: 'box-shadow 0.2s, border 0.2s',
  border: '2px solid transparent',
  // Efeito de foco removido
  [theme.breakpoints.down('md')]: {
    maxWidth: 450,
    padding: '10px 12px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
    padding: '8px 8px',
  },
}));

const CategoryBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#003d52',
  padding: '8px',
  gap: '10px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '0',
  },
}));

// Sem destaque azul na seção ativa
const CategoryLink = styled('a', {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: '#fff',
  textDecoration: 'none',
  fontSize: 16,
  padding: '8px 16px',
  borderRadius: 5,
  fontWeight: active ? 'bold' : 'normal',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.3s, font-weight 0.3s, box-shadow 0.2s',
  '&:hover': {
    backgroundColor: '#007b99',
    boxShadow: '0 2px 8px 0 rgba(0,188,212,0.10)',
  },
}));

function normalizeCartCount(count) {
  return count > 9 ? '9+' : count;
}

function Header({
  logoSrc = '/logo-com-borda.png',
  onLogoClick,
  onSearchChange,
  categories = ['Hardware', 'Periféricos', 'Computadores', 'Celulares'],
  onCategoryClick,
  onProfile,
  onCart,
  onLogout,
  cartCount = 3,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (onCategoryClick) onCategoryClick(cat);
  };

  return (
    <>
      <style>{pulseKeyframes}</style>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #004d66 80%, #007b99 100%)',
          color: '#fff',
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            minHeight: { xs: 90, sm: 90, md: 100 },
          }}
        >
          <Logo src={logoSrc} alt="Logo" onClick={onLogoClick} />
          <SearchWrapper>
            <Search>
              <InputBase
                placeholder="Pesquisar…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={onSearchChange}
                sx={{
                  width: '100%',
                  fontSize: { xs: 16, sm: 18 },
                  color: '#222',
                }}
              />
            </Search>
          </SearchWrapper>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
              minWidth: 0,
            }}
          >
            <IconButton
              color="inherit"
              onClick={onProfile}
              sx={{
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(0,123,153,0.15)' },
              }}
            >
              <AccountCircle />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={onCart}
              sx={{
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(0,123,153,0.15)' },
              }}
            >
              <Badge
                badgeContent={normalizeCartCount(cartCount)}
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: 'pulse 1s infinite alternate',
                    minWidth: 22,
                    fontSize: 14,
                    right: -3,
                    top: 6,
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={onLogout}
              sx={{
                transition: 'background 0.2s',
                '&:hover': { background: 'rgba(0,123,153,0.15)' },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
          {/* Menu mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleMenu} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={onProfile}>Perfil</MenuItem>
              <MenuItem onClick={onCart}>Carrinho</MenuItem>
              <MenuItem onClick={onLogout}>Sair</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
        {/* Barra de categorias */}
        <CategoryBar>
          {categories.map((cat) => (
            <CategoryLink
              key={cat}
              active={selectedCategory === cat ? 1 : 0}
              onClick={() => handleCategoryClick(cat)}
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