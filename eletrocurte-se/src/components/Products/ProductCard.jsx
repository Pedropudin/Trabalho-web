// -----------------------------------------------------------------------------
// ProductCard.jsx
// Reusable product card for display in lists and grids.
// Shows image, name, price, stock, rating, and product details.
// Integration with Material-UI for responsive layout and styling.
// Shows login message if unauthenticated user tries to access details.
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

const CARD_WIDTH = 260;
const CARD_HEIGHT = 420; // Increased height for more text space
const IMG_HEIGHT = 90;   // Reduced image height to free space

const ProductCard = ({ product, onClick, isLoggedIn, pageType, showBuyButton = false, onBuy }) => {
  // State to handle image load error
  const [imgError, setImgError] = useState(false);
  // State to display login required message
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  // State to store product reviews
  const [reviews, setReviews] = useState([]);
  // Select product image source
  const imageSrc = !imgError ? (product.image || product.img || product.imagem) : null;
  // Check if on home page and user is not logged in
  const isHomeNotLogged = pageType === 'home' && !isLoggedIn;

  // Fetch public reviews on component mount
  React.useEffect(() => {
    if (product && product.id) {
      fetch(`${process.env.REACT_APP_API_URL}/api/products/${product.id}/reviews`)
        .then(res => res.json())
        .then(data => setReviews(Array.isArray(data) ? data : []))
        .catch(() => setReviews([]));
    }
  }, [product]);

  // Calculates integer average rating
  const avgRating = reviews.length
    ? Math.floor(reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length)
    : 0;

  // Handles card click: requires login on home, otherwise calls onClick
  const handleCardClick = (e) => {
    if (isHomeNotLogged) {
      e.preventDefault();
      e.stopPropagation();
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 2500);
      return;
    }
    // Atualiza visualized/visualizedDate no backend ao visualizar
    if (product && product.id) {
      const userId = localStorage.getItem('userId');
      fetch(`${process.env.REACT_APP_API_URL}/api/products/${product.id}/visualize`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visualized: true,
          visualizedDate: new Date().toISOString(),
          userId // <-- Adiciona userId para salvar no histórico do usuário
        })
      }).catch(() => {});
    }
    if (onClick) onClick(product);
  };

  // Shows floating message if user is not logged in
  React.useEffect(() => {
    // Remova todo este bloco para evitar mensagem duplicada
    // if (showLoginMsg) {
    //   const msgDiv = document.createElement('div');
    //   msgDiv.className = 'message show info';
    //   msgDiv.style.position = 'fixed';
    //   msgDiv.style.top = '20px';
    //   msgDiv.style.left = '50%';
    //   msgDiv.style.transform = 'translateX(-50%)';
    //   msgDiv.style.zIndex = 9999;
    //   msgDiv.style.background = '#2196F3';
    //   msgDiv.style.color = '#fff';
    //   msgDiv.style.padding = '12px 24px';
    //   msgDiv.style.borderRadius = '8px';
    //   msgDiv.style.fontWeight = 'bold';
    //   msgDiv.textContent = 'Please log in to view product specifications.';
    //   document.body.appendChild(msgDiv);
    //   const timeout = setTimeout(() => {
    //     msgDiv.remove();
    //   }, 2500);
    //   return () => {
    //     clearTimeout(timeout);
    //     msgDiv.remove();
    //   };
    // }
  }, [showLoginMsg]);

  return (
    <Card
      // Material-UI Card with responsive styling
      sx={{
        width: { xs: '95vw', sm: CARD_WIDTH },
        maxWidth: CARD_WIDTH,
        minWidth: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        background: '#fff',
        m: '0 auto',
        position: 'relative',
      }}
      className="product-card"
    >
      <CardActionArea
        // Clickable area of the card, customized to not change color on focus/hover
        onClick={handleCardClick}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          flex: 1,
          background: '#fff',
          p: 0,
          boxShadow: 'none',
          '&:hover': { background: '#fff' },
          '&:focus': { background: '#fff' },
          cursor: 'pointer',
        }}
        tabIndex={0}
      >
        {/* Product image or unavailable message */}
        <Box sx={{
          height: IMG_HEIGHT,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff',
          mb: 1
        }}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name || product.nome}
              style={{
                maxHeight: IMG_HEIGHT,
                maxWidth: '80%',
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block',
                borderRadius: 8,
                background: '#fff'
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">Image unavailable</Typography>
          )}
        </Box>
        <CardContent sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          p: 2,
          gap: 0.5
        }}>
          {/* Product name */}
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              fontSize: '1.08rem',
              textAlign: 'center',
              minHeight: 44,
              fontWeight: 600,
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              wordBreak: 'break-word',
              mb: 1
            }}
          >
            {product.name || product.nome}
          </Typography>
          {/* Price and installment */}
          <Box mt={1} mb={0} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
              {typeof product.price === 'number'
                ? `R$ ${product.price.toFixed(2).replace('.', ',')}`
                : typeof product.preco === 'string' && product.preco.startsWith('R$')
                  ? product.preco
                  : `R$ ${product.preco || product.price}`}
            </Typography>
            {product.parcelamento && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                or {product.parcelamento}
              </Typography>
            )}
          </Box>
          {/* Product rating */}
          <Box mt={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Rating value={avgRating} precision={1} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              {avgRating > 0 ? `${avgRating}/5` : 'No ratings'}
              {reviews.length > 0 && ` (${reviews.length})`}
            </Typography>
          </Box>
          {/* Stock */}
          <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            {product.inStock !== undefined ? (
              <Typography variant="caption" color={product.inStock > 0 ? 'success.main' : 'error.main'}>
                {product.inStock > 0 ? `In stock: ${product.inStock}` : 'Unavailable'}
              </Typography>
            ) : product.estoque !== undefined ? (
              <Typography variant="caption" color={product.estoque > 0 ? 'success.main' : 'error.main'}>
                {product.estoque > 0 ? `In stock: ${product.estoque}` : 'Unavailable'}
              </Typography>
            ) : null}
          </Box>
          {/* Additional details: brand, model, color, voltage, warranty */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            width: '100%'
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
              {product.brand || product.marca ? `Brand: ${product.brand || product.marca}` : ''} {product.model || product.modelo ? `| Model: ${product.model || product.modelo}` : ''}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
              {product.color || product.cor ? `Color: ${product.color || product.cor}` : ''} {product.voltage || product.voltagem ? `| Voltage: ${product.voltage || product.voltagem}` : ''}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center', wordBreak: 'break-word' }}>
              {product.warranty || product.garantia ? `Warranty: ${product.warranty || product.garantia}` : ''}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      {/* Buy button appears if showBuyButton is true */}
      {showBuyButton && (product.inStock > 0 || product.estoque > 0) && (
        <button
          className="product-display-purchase-button"
          style={{ margin: 12, width: "90%" }}
          onClick={e => {
            e.stopPropagation();
            if (onBuy) onBuy(product);
          }}
        >
          Add to cart
        </button>
      )}
    </Card>
  );
};

export default ProductCard;