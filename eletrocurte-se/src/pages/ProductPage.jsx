import '../styles/ProductPage.css';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Paper, Stack, Box } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import ROUTES from "../routes.js";
import Rating from '@mui/material/Rating';

// Import dependencies and styles

/*
  Eletrocurte-se product page.
  - Displays the accessed product.
  - Displays the specifications and descriptions for the product. 
  - Two buttons: 'Add to Cart', which adds a product to the cart but stays on the page, and 'Buy', which adds the product to the cart and redirects to the cart page.
*/

export default function ProductPage() {
  // Variables
  const navigate = useNavigate();
  const { id } = useParams();  // Identifies the id from the URL
  const [productsLocal, setProductsLocal] = React.useState([]);

  // Fetch product data from the backend
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/api/products')
      .then(res => res.json())
      .then(data => setProductsLocal(data))
      .catch(() => setProductsLocal([])); 
  }, []);

  // Find the product based on the URL id
  const product = productsLocal.find(p => String(p.id) === String(id));

  // Manage product images
  const [mainImg, setMainImg] = useState();
  const [thumbs, setThumbs] = useState([]);

  useEffect(() => {
    if (product) {
      // Validate and set thumbnails
      if (Array.isArray(product.thumbs)) {
        const validThumbs = product.thumbs.filter(
          (thumb) => typeof thumb === "string" && thumb.trim() !== ""
        );
        setThumbs(validThumbs);
      } else {
        setThumbs([]); 
      }

      // Validate and set main image
      if (typeof product.image === "string" && product.image.trim() !== "") {
        setMainImg(product.image);
      } else {
        setMainImg(null);
      }
    }
  }, [product]);

  // Manage reviews
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [, setValidUsernames] = useState([]);

  useEffect(() => {
    // Fetch all users to validate names
    fetch(process.env.REACT_APP_API_URL + '/api/users')
      .then(res => res.json())
      .then(users => setValidUsernames(users.map(u => u.firstName).filter(Boolean)))
      .catch(() => setValidUsernames([]));
  }, []);

  useEffect(() => {
    if (product && product.id) {
      // Fetch reviews for the product
      fetch(`${process.env.REACT_APP_API_URL}/api/products/${product.id}/reviews`)
        .then(res => res.json())
        .then(data => setReviews(Array.isArray(data) ? data : []))
        .catch(() => setReviews([]));
    }
  }, [product]);

  // Filter and calculate average rating
  const filteredReviews = reviews; // Show all reviews
  const avgRating = filteredReviews.length
    ? Math.round(filteredReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / filteredReviews.length)
    : 0;

  // Get user-specific review
  const nomeUsuario = localStorage.getItem('nomeUsuario');
  const userReview = filteredReviews.find(r => r.username === nomeUsuario);
  const visibleReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 5);

  // Handle adding product to cart
  function handleAdicionarCarrinho(productId) {
    const userId = localStorage.getItem('userId');
    const cartKey = userId ? `cart_${userId}` : 'cart';
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const existing = cart.find(item => item.id === productId);
    const stock = product.inStock;

    if (existing) {
      // Check stock availability
      if (existing.quantity + 1 > stock) {
        toast.error("Maximum number of products reached. Error: Out of stock!");
        return;
      }
      // Update cart
      const updatedCart = cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      toast.success('Product successfully added to cart!');
      window.dispatchEvent(new Event('cartUpdated'));
      window.forceCartUpdate && window.forceCartUpdate();
    } else {
      // Add new product to cart
      const updatedCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        }
      ];
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
      toast.success('Product successfully added to cart!');
      window.dispatchEvent(new Event('cartUpdated'));
      window.forceCartUpdate && window.forceCartUpdate();
    }
  }

  // If no product is found, display a message
  if (!product) {
    return (
      <>
        <Header />
        <main className="main-content">
          <h2 style={{ margin: '2rem', textAlign: 'center' }}>Product not found.</h2>
        </main>
        <Footer />
      </>
    );
  }

  // Render the product page
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="products">
          <div className="item">
            {/* Product images */}
            <div className="item-images" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Paper
                elevation={2}
                sx={{
                  width: 320,
                  height: 320,
                  mb: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 10px 0 rgba(0,0,0,0.08)" // subtle shadow
                }}
              >
                <img
                  className="product-image"
                  src={mainImg}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", cursor: "pointer" }}
                />
              </Paper>
              <Stack direction="row" spacing={2}>
                {thumbs.map((thumbUrl, i) => (
                  <Paper
                    key={i}
                    elevation={mainImg === thumbUrl ? 3 : 1}
                    sx={{
                      border: mainImg === thumbUrl ? '0 solid #1976d2' : '0 solid #eee',
                      borderRadius: 2,
                      p: 0.5,
                      cursor: "pointer",
                      background: mainImg === thumbUrl ? "#e3f2fd" : "#fff",
                      boxShadow: "0 0 4px 0 rgba(0,0,0,0.07)" // even more subtle shadow
                    }}
                    onClick={() => {
                      if (mainImg !== thumbUrl) {
                        setThumbs(thumbs.map(t => t === thumbUrl ? mainImg : t));
                        setMainImg(thumbUrl);
                      }
                    }}
                  >
                    <img src={thumbUrl} alt={`Thumbnail of ${product.name}`} style={{ width: 56, height: 56, objectFit: "contain" }} />
                  </Paper>
                ))}
              </Stack>
            </div>
            {/* Product information */}
            <div className="item-information">
              <h1 className="product-name-product-page">{product.name}</h1>
              <p className="product-description">{product.description}</p>
              <h2 className="product-price">
                {Number.isFinite(Number(product.price))
                  ? `R$${Number(product.price).toFixed(2).replace('.', ',')}`
                  : "Price unavailable"}
              </h2>
              <p>
                {Number.isFinite(Number(product.price))
                  ? `Up to 10x of R$ ${(Number(product.price) / 12).toFixed(2).replace('.', ',')} without interest on credit card.`
                  : "Installment unavailable"}
              </p>
              <p>
                {product.inStock > 0 ? <span className="product-in-stock">In stock ({product.inStock})</span> : <span className="product-unavailable-product-page">Out of stock</span>}
              </p>
              <div className="product-buttons">
                {product.inStock <= 0 ? 
                  <>
                    <button className="product-purchase-button" onClick={() => toast.error("Product out of stock!")}>PRODUCT UNAVAILABLE</button>  
                    <Toaster/>
                    <button className="product-cart-button" onClick={() => navigate(ROUTES.HOME_PAGE)}>BACK TO HOME</button>              
                  </>
                : 
                  <>
                    <button className="product-purchase-button" onClick={function(){handleAdicionarCarrinho(product.id); navigate(ROUTES.CHECKOUT)}}>BUY</button>
                    <Toaster/>
                    <button className="product-cart-button" onClick={() => handleAdicionarCarrinho(product.id)}>
                      ADD TO CART
                    </button>              
                  </>
                }
              </div>
            </div>
          </div>
          {/* Product description and specifications */}
          <div className="item-description">
            <div className="text-description">
              <h2>Product Description</h2>
              <p>{product.fullDescription}</p>
            </div>
            <div className="text-specifications">
              <h2>Product Specifications</h2>
              <ul>
                {(Array.isArray(product.specifications) ? product.specifications : [])
                  .map((spec, i) => (
                    <li key={i}>{spec}</li>
                  ))}
              </ul>
            </div>
            {/* Public evaluations */}
            <div className="product-reviews-section" style={{ marginTop: 32 }}>
              <h2>Product Reviews</h2>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Rating value={avgRating} readOnly precision={1} />
                <span style={{ color: "#555" }}>
                  {avgRating > 0 ? `${avgRating}/5` : 'No ratings yet'}
                  {filteredReviews.length > 0 && ` (${filteredReviews.length} review${filteredReviews.length > 1 ? 's' : ''})`}
                </span>
              </Box>
              {userReview && (
                <Box sx={{ background: '#fffde7', borderRadius: 2, p: 1, mb: 1 }}>
                  <b>Your review:</b>
                  <Rating value={Number(userReview.rating)} readOnly size="small" />
                  <span style={{ fontStyle: 'italic' }}>“{userReview.comment}”</span>
                </Box>
              )}
              {visibleReviews.length > 0 && (
                <Box>
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
                        <span style={{ color: "#888", fontWeight: 500, fontSize: 13 }}>
                          @{r.username || 'User'}
                        </span>
                      </Box>
                      <span style={{ fontStyle: 'italic', marginLeft: 8, marginTop: 4, flex: 1 }}>{r.comment}</span>
                    </Box>
                  ))}
                  {reviews.length > 5 && !showAllReviews && (
                    <button onClick={() => setShowAllReviews(true)} style={{ marginTop: 8 }}>Show all reviews</button>
                  )}
                  {showAllReviews && reviews.length > 5 && (
                    <button onClick={() => setShowAllReviews(false)} style={{ marginTop: 8 }}>Show less</button>
                  )}
                </Box>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
