import '../styles/PaginaProduto.css';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom'; 
import { Paper, Stack } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import ROUTES from '../routes';

export default function PaginaProduto() {
  // Variables
  const navigate = useNavigate();
  const { id } = useParams();  // Identifies the id from the URL 
  const [produtosLocais, setProdutosLocais] = React.useState([]);

  // Reads product data directly from JSON
  useEffect(() => {
      // Always fetch from backend for consistency
      fetch(process.env.REACT_APP_API_URL + '/produtos')
          .then(res => res.json())
          .then(data => setProdutosLocais(data))
          .catch(() => setProdutosLocais([]));
  }, []);
  // Variables
  const product = produtosLocais.find(p => String(p.id) === String(id));

  // Image update after receiving data
  const [mainImg, setMainImg] = useState();
  const [thumbs, setThumbs] = useState([]);

  useEffect(() => {
    if (product) {
      setMainImg(product.img);
      setThumbs(product.thumbs || []);
    }
  }, [product]);


  //When clicking "add to cart"
  function handleAdicionarCarrinho(productId) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(item => item.id === productId);
    const stock = product.inStock;

    if (existing) {
      if (existing.quantity + 1 > stock) {
        toast.error("Número máximo de produtos atingido. Erro: Falta de estoque!");
        return;
      }
      const updatedCart = cart.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success('Produto colocado no carrinho com sucesso!');
      window.dispatchEvent(new Event('cartUpdated'));
      window.forceCartUpdate && window.forceCartUpdate();
    } else {
      const updatedCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.img,
          quantity: 1
        }
      ];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success('Produto colocado no carrinho com sucesso!');
      window.dispatchEvent(new Event('cartUpdated'));
      window.forceCartUpdate && window.forceCartUpdate();
    }
  }
  if (!product) {//If no product with this id is found, shows that the product was not found.
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

  return (//Otherwise, loads the page
    <>
      <Header />
      <main className="main-content">
        <div className="products">
          <div className="item">
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
                    <img src={thumbUrl} alt={`Miniatura de ${product.name}`} style={{ width: 56, height: 56, objectFit: "contain" }} />
                  </Paper>
                ))}
              </Stack>
            </div>
            <div className="item-information">
              <h1 className="product-name-product-page">{product.name}</h1>
              <p className="product-description">{product.description}</p>
              <h2 className="product-price">
                R${product.price.toFixed(2).replace('.', ',')}
              </h2>
              <p>
                Em até 10x de R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros no cartão de crédito.
              </p>
              <p>
                {product.inStock > 0 ? <span className="product-in-stock">Em estoque ({product.inStock})</span> : <span className="product-unavailable-product-page">Fora de estoque ({product.inStock})</span>}
              </p>
              <div className="product-buttons">
                {product.inStock <= 0 ? 
                  <>
                    <button className="product-purchase-button" onClick={() => toast.error("Produto fora de estoque!")}>PRODUTO INDISPONÍVEL</button>  
                    <Toaster/>
                    <button className="product-cart-button" onClick={() => navigate(ROUTES.PAG_PESQUISA)}>VOLTAR AO INÍCIO</button>              
                  </>
                : 
                  <>
                    <button className="product-purchase-button" onClick={function(){handleAdicionarCarrinho(product.id); navigate(ROUTES.CHECKOUT)}}>COMPRAR</button>
                    <Toaster/>
                    <button className="product-cart-button" onClick={() => handleAdicionarCarrinho(product.id)}>
                      ADICIONAR AO CARRINHO
                    </button>              
                  </>
                }
              </div>
            </div>
          </div>
          <div className="item-description">
            <div className="text-description">
              <h2>Descrição do Produto</h2>
              <p>{product.fullDescription}</p>
            </div>
            <div className="text-specifications">
              <h2>Especificações do Produto</h2>
              <ul>
                {product.specifications?.map((spec, i) => (
                  <li key={i}>{spec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
