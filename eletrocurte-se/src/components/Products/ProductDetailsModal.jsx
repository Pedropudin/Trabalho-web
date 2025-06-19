// -----------------------------------------------------------------------------
// ProductDetailsModal.jsx
// Modal to display product details with purchase option.
// Uses Material-UI Dialog and shows messages if user is not logged in.
// Shows updated cart count after addition.
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ROUTES from '../../routes';
import Rating from '@mui/material/Rating';

const ProductDetailsModal = ({ open, onClose, product }) => {
  const navigate = useNavigate();
  const [cartCountPopup, setCartCountPopup] = useState(null);
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [, setValidUsernames] = useState([]);

  // Always call useEffect, never conditionally
  React.useEffect(() => {
    // Fetches all users to validate names
    fetch(process.env.REACT_APP_API_URL + '/api/users')
      .then(res => res.json())
      .then(users => setValidUsernames(users.map(u => u.firstName).filter(Boolean)))
      .catch(() => setValidUsernames([]));
  }, []);

  React.useEffect(() => {
    if (product && product.id) {
      fetch(`${process.env.REACT_APP_API_URL}/api/products/${product.id}/reviews`)
        .then(res => res.json())
        .then(data => setReviews(Array.isArray(data) ? data : []))
        .catch(() => setReviews([]));
    } else {
      setReviews([]);
    }
  }, [product]);

  if (!product) return null;
  
  // Filter reviews to only show those with valid usernames
  const filteredReviews = reviews; // Show all reviews
  // Calculates the average rating of the reviews
  const avgRating = filteredReviews.length
    ? Math.floor(filteredReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / filteredReviews.length)
    : 0;

  // User rating (if logged in)
  const nomeUsuario = localStorage.getItem('nomeUsuario');
  // Shows only the review of the logged-in user as "Your review"
  const userReview = filteredReviews.find(r => r.username === nomeUsuario);

  // Comments to display (max. 5, expandable)
  const visibleReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 5);

  const handleComprar = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');
    const cartKey = userId ? `cart_${userId}` : 'cart';
    if (!isLoggedIn) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 2500);
      return;
    }

    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const id = product.id;
    const name = product.name;
    const price = parseFloat(String(product.price).replace(',', '.'));
    const image = product.image;
    const stock = product.inStock ?? 1;

    const existing = cart.find(item => String(item.id) === String(id));
    let updatedCart;

    if (existing) {
      if ((existing.quantity + 1) > stock) {
        toast.error("Insufficient stock!");
        return;
      }
      updatedCart = cart.map(item =>
        String(item.id) === String(id) ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { id, name, price, image, quantity: 1 }];
    }

    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    toast.success('Product added to cart!');
    window.dispatchEvent(new Event('cartUpdated'));
    window.forceCartUpdate && window.forceCartUpdate();

    const totalCount = updatedCart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
    setCartCountPopup(totalCount);

    setTimeout(() => {
      setCartCountPopup(null);
      onClose && onClose();
      navigate(ROUTES.CHECKOUT);
    }, 900);
  };

  return (
    <>
      {cartCountPopup !== null && (
        <Box
          sx={{
            position: 'fixed',
            top: 30,
            right: 30,
            zIndex: 2000,
            bgcolor: '#007b99',
            color: '#fff',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 700,
            fontSize: 18,
            boxShadow: '0 4px 16px rgba(0,0,0,0.13)'
          }}
        >
          {cartCountPopup} product{cartCountPopup > 1 ? 's' : ''} in cart
        </Box>
      )}

      {showLoginMsg && (
        <Box
          className="mensagem show info"
          sx={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            bgcolor: '#2196F3',
            color: '#fff',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            userSelect: 'none'
          }}
        >
          Please log in to purchase the product.
        </Box>
      )}

      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{product.name || 'Product Details'}</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={{ xs: 2, md: 6 }}
            alignItems="stretch"
            justifyContent="flex-start"
          >
            {/* Left: Image and Buy button */}
            <Box
              flexShrink={0}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start"
              height={{ xs: 180, md: 260 }}
              minWidth={{ xs: '100%', md: 240 }}
              maxWidth={{ xs: '100%', md: 260 }}
              sx={{
                background: '#fafbfc',
                borderRadius: 2,
                p: { xs: 1, md: 2 },
                mb: { xs: 2, md: 0 }
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: 200, height: 200, objectFit: 'contain', background: '#fafafa', borderRadius: 8 }}
              />
              {product.showBuyButton === true && (
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ mt: 2, width: 160, fontWeight: 700, fontSize: 17 }}
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleComprar}
                >
                  Buy
                </Button>
              )}
            </Box>
            {/* Right: Info and Reviews */}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              flex={1}
              minWidth={0}
              sx={{
                pl: { xs: 0, md: 2 },
                pt: { xs: 0, md: 1 }
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                {product.name}
              </Typography>
              {/* Evaluation media */}
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Rating value={avgRating} readOnly precision={1} />
                <Typography variant="body2" color="text.secondary">
                  {avgRating > 0 ? `${avgRating}/5` : 'No ratings yet'}
                  {filteredReviews.length > 0 && ` (${filteredReviews.length} review${filteredReviews.length > 1 ? 's' : ''})`}
                </Typography>
              </Box>
              {/* User comment highlight */}
              {userReview && (
                <Box sx={{ background: '#fffde7', borderRadius: 2, p: 1, mb: 1, width: '100%' }}>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                    Your review:
                  </Typography>
                  <Rating value={Number(userReview.rating)} readOnly size="small" />
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    “{userReview.comment}”
                  </Typography>
                </Box>
              )}
              {/* List of public comments */}
              {visibleReviews.length > 0 && (
                <Box mt={2} sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Recent reviews
                  </Typography>
                  {visibleReviews.map((r, idx) => (
                    <Box
                      key={r.username + idx}
                      sx={{
                        mb: 1.5,
                        p: 1,
                        borderRadius: 1,
                        background: '#f7f7f7',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 90 }}>
                        <Rating value={Number(r.rating)} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          @{r.username || 'User'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontStyle: 'italic', ml: 1, mt: 0.5, flex: 1 }}>
                        {r.comment}
                      </Typography>
                    </Box>
                  ))}
                  {reviews.length > 5 && !showAllReviews && (
                    <Button size="small" onClick={() => setShowAllReviews(true)} sx={{ mt: 1 }}>
                      Show all reviews
                    </Button>
                  )}
                  {showAllReviews && reviews.length > 5 && (
                    <Button size="small" onClick={() => setShowAllReviews(false)} sx={{ mt: 1 }}>
                      Show less
                    </Button>
                  )}
                </Box>
              )}
              <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
                {typeof product.price === 'number'
                  ? `R$${Number(product.price).toFixed(2).replace('.', ',')}`
                  : product.price}
              </Typography>
              {product.category && (
                <Typography variant="body2" color="text.secondary">
                  Category: {product.category}
                </Typography>
              )}
              {product.brand && (
                <Typography variant="body2" color="text.secondary">
                  Brand: {product.brand}
                </Typography>
              )}
              {product.data && (
                <Typography variant="body2" color="text.secondary">
                  Date: {product.data}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetailsModal;