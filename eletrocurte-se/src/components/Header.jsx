// -----------------------------------------------------------------------------
// Header.jsx
// Main header of the Eletrocurte-se system.
// Displays logo, search bar, user menu, cart, logout, and categories.
// Responsive, uses Material-UI and styled-components for styling.
// Integration with animated badge, mobile menu, and customizable props.
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import ROUTES from '../routes';
import { useNavigate } from 'react-router-dom';
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

// Pulse animation for the cart badge
const pulseKeyframes = `
@keyframes pulse {
  0% { transform: scale(1);}
  100% { transform: scale(1.15);}
}
`;

// Styled logo with hover effect
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

// Wrapper to center the search bar
const SearchWrapper = styled(Box)(({ theme }) => ({
  flex: 1, // Takes up as much space as possible between logo and icons
  display: 'flex', // Horizontal flex layout
  justifyContent: 'center', // Centers the search bar
  alignItems: 'center', // Vertically aligns
  minWidth: 0, // Allows shrinking on small screens
  marginLeft: theme.spacing(2), // Left spacing
  marginRight: theme.spacing(2), // Right spacing
  [theme.breakpoints.down('sm')]: {
    order: 3, // Moves down in mobile layout
    width: '100%', // Takes full width
    margin: `${theme.spacing(1)} 0`, // Reduced vertical margin
  },
}));

// Styled search bar with no focus effect
const Search = styled('div')(({ theme }) => ({
  backgroundColor: '#fff', // White background
  borderRadius: 12, // Rounded corners
  display: 'flex', // Horizontal flex layout
  alignItems: 'center', // Vertically aligns
  padding: '12px 18px', // Default inner spacing
  flex: 1, // Takes up maximum space
  minWidth: 0, // Allows shrinking
  maxWidth: 700, // Max width on large screens
  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)', // Light shadow
  transition: 'box-shadow 0.2s, border 0.2s', // Smooth transition
  border: '2px solid transparent', // Invisible border (can be used for focus)

  [theme.breakpoints.down('md')]: {
    maxWidth: 450, // Reduced max width on tablets
    padding: '10px 12px', // Reduced padding
  },

  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    width: '100%',
    padding: '8px 8px', // Even smaller padding
  },
}));

// Horizontal category bar
const CategoryBar = styled(Box)(({ theme }) => ({
  display: 'flex', // Horizontal layout
  justifyContent: 'center', // Centers categories
  alignItems: 'center', // Vertically aligns
  backgroundColor: '#003d52', // Dark blue background
  padding: '8px', // Inner spacing
  gap: '10px', // Space between categories

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column', // Stacks categories vertically
    gap: '0', // Removes extra spacing
  },
}));

// Custom category link without blue highlight
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

// Normalizes the cart counter to show '9+' if needed
function normalizeCartCount(count) {
  return count > 9 ? '9+' : count;
}

function Header({
  // logoSrc: path to the logo image displayed in the header
  // onLogoClick: function called when clicking the logo
  // onSearchChange: callback for changes in the search field
  // categories: array of strings with names of the displayed categories
  // selectedCategoryIndex: index of the initially selected category
  // onCategoryClick: callback when clicking a category
  // useElementsMenu: array of booleans [profile, cart, logout] to show or not each icon
  // onProfile, onCart, onLogout: callbacks for icon actions
  // cartCount: number of items in the cart (badge)
  // searchDisabled: disables search field if true
  // onSearchDenied: callback called when trying to search with searchDisabled
  logoSrc = '/logo-com-borda.png',
  onLogoClick,
  onSearchChange,
  categories = ['Hardware', 'Peripherals', 'Computers', 'Phones'],
  selectedCategoryIndex = 0,
  onCategoryClick,
  adminContext = false,
  useElementsMenu = [true, true, true],
  onProfile,
  onCart,
  onLogout,
  cartCount, // ignored, will be calculated dynamically
  searchDisabled = false,
  onSearchDenied,
}) {
  // Mobile menu state
  const [anchorEl, setAnchorEl] = useState(null);
  // Currently selected category
  const [selectedCategory, setSelectedCategory] = useState(categories[selectedCategoryIndex] || '');
  const [categoryClassName, setCategoryClassName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchValue, setSearchValue] = React.useState('');
  const navigate = useNavigate();

  // if(adminContext) {
  //   setCategoryClassName("admin");
  // }

  useEffect(() => {
    setSelectedCategory(categories[selectedCategoryIndex] || '');
    if(adminContext) {
      setCategoryClassName("admin");
    }
  }, [selectedCategoryIndex, adminContext, categories]);
  // Calculates the number of items in the cart from localStorage
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

    // Allows instant update via window.forceCartUpdate()
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

  // Opens mobile menu
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  // Closes mobile menu
  const handleClose = () => setAnchorEl(null);

  // Centralizes authentication logic
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Selects category and triggers callback
  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    if (onCategoryClick) onCategoryClick(cat);
  };

  // Profile: if logged in go to profile, else go to login
  const handleProfileClick = () => {
    console.log("handleProfileClick called"); // Debug purpose
    if (onProfile) {
      onProfile();
    } else {
      if (isLoggedIn) {
        navigate(ROUTES.PROFILE);
      } else {
        navigate(ROUTES.LOGIN);
      }
    }
  };

  // Cart: only allows if logged in, else go to login
  // Handler for search field change
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearchChange) onSearchChange(e);
  };

  // Sends search bar content
  const handleSearchKeyDown = (e) => {
    const searchRealValue = searchValue.trim();
    if (searchDisabled) {
      if (onSearchDenied) onSearchDenied();
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter' && searchRealValue) {
      navigate(`/SearchPage/${encodeURIComponent(searchRealValue)}`);
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

  // Logo: uses prop or defaults to home
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate(ROUTES.HOME_PAGE);
    }
  };

  // Logout: uses prop or defaults
  const handleLogoutInternal = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    navigate(ROUTES.LOGOUT, { replace: true });
  };

  // Function to show message and ensure only one appears at a time
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
      {/* Pulse animation for cart badge */}
      <style>{pulseKeyframes}</style>
      {/* Warning message for categories */}
      {mensagemCategoria && (
        <div className="mensagem show info" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#2196F3', color: '#fff', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold' }}>
          {mensagemCategoria}
        </div>
      )}
      <AppBar
        position="static"
        sx={{
          // Header background gradient
          background: 'linear-gradient(90deg, #004d66 80%, #007b99 100%)',
          color: '#fff',
          boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex', // Horizontal flexible layout
            alignItems: 'center',
            gap: 2, // Space between elements
            flexWrap: isMobile ? 'wrap' : 'nowrap', // Wraps on mobile
            justifyContent: isMobile ? 'center' : 'flex-start',
            minHeight: { xs: 90, sm: 90, md: 100 }, // Responsive min height
          }}
        >
          {/* System logo */}
          <Logo src={logoSrc} alt="Logo" onClick={handleLogoClick} />
          {/* Centered search bar */}
          <SearchWrapper>
            <Search>
              <InputBase
                id="header-search"
                name="header-search"
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                sx={{
                  width: '100%',
                  fontSize: { xs: 16, sm: 18 },
                  color: '#222',
                  backgroundColor: '#fff',
                  cursor: 'text',
                }}
              />
            </Search>
          </SearchWrapper>
          {/* Desktop menu: profile, cart, logout */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' }, // Hidden on mobile
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
                '&:hover': { background: 'rgba(0,123,153,0.15)' },
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
          {/* Mobile menu: hamburger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={handleMenu} aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* Shows only the active options according to useElementsMenu */}
              {useElementsMenu[0] && (
                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <AccountCircle fontSize="small" />
                  </ListItemIcon>
                  Profile
                </MenuItem>
              )}
              {useElementsMenu[1] && (
                <MenuItem onClick={handleCartClick}>
                  <ListItemIcon>
                    <ShoppingCartIcon fontSize="small" />
                  </ListItemIcon>
                  Cart
                </MenuItem>
              )}
              {useElementsMenu[2] && (
                <MenuItem onClick={onLogout || handleLogoutInternal}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
        {/* Category bar */}
        <CategoryBar className={categoryClassName}>
          {categories.map((cat) => (
            <CategoryLink
              key={cat}
              active={selectedCategory === cat ? 1 : 0}
              to={ROUTES.SECTOR_PAGE.replace(
                ":name",
                cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
              )}
              onClick={e => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  showMensagemCategoria('Please log in to filter by category!');
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