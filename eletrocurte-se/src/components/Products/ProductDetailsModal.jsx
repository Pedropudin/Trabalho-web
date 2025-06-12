// -----------------------------------------------------------------------------
// ProductDetailsModal.jsx
// Modal para exibir detalhes do produto com opção de compra.
// Usa Material-UI Dialog e mostra mensagens se usuário não estiver logado.
// Exibe contagem atualizada do carrinho após adição.
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

const ProductDetailsModal = ({ open, onClose, product }) => {
  const navigate = useNavigate();
  const [cartCountPopup, setCartCountPopup] = useState(null);
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  if (!product) return null;

  // Comentário do usuário logado (exemplo simplificado)
  const nomeUsuario = localStorage.getItem('nomeUsuario');
  const avaliacoes = nomeUsuario ? JSON.parse(localStorage.getItem(`avaliacoes_${nomeUsuario}`) || '{}') : {};
  const comentarioUsuario = product.id && avaliacoes[product.id]?.comentario;

  const handleComprar = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 2500);
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const id = product.id || product.ID || product.Id;
    const name = product.nome || product.name;
    const price = parseFloat(String(product.preco || product.price).replace(',', '.'));
    const image = product.img || product.imagem || product.image;
    const estoque = product.estoque ?? product.inStock ?? 1;

    const existing = cart.find(item => String(item.id) === String(id));
    let updatedCart;

    if (existing) {
      if ((existing.quantity + 1) > estoque) {
        toast.error("Estoque insuficiente!");
        return;
      }
      updatedCart = cart.map(item =>
        String(item.id) === String(id) ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { id, name, price, image, quantity: 1 }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Produto adicionado ao carrinho!');
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
          {cartCountPopup} produto{cartCountPopup > 1 ? 's' : ''} no carrinho
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
          Faça login para comprar o produto.
        </Box>
      )}

      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{product.nome || product.name || 'Detalhes do Produto'}</DialogTitle>
        <Divider />
        <DialogContent>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={3}
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            {(product.imagem || product.image || product.img) && (
              <Box
                flexShrink={0}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height={220}
              >
                <img
                  src={product.imagem || product.image || product.img}
                  alt={product.nome || product.name}
                  style={{ width: 200, height: 200, objectFit: 'contain', background: '#fafafa', borderRadius: 8 }}
                />
                {product.showBuyButton === true && (
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ mt: 2 }}
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleComprar}
                  >
                    Comprar
                  </Button>
                )}
              </Box>
            )}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              height={220}
              ml={{ xs: 0, md: 6 }}
              alignSelf="center"
              minWidth={220}
            >
              <Typography variant="h6" gutterBottom>
                {product.nome || product.name}
              </Typography>
              {(product.descricao || product.description) && (
                <Typography variant="body1" gutterBottom>
                  {product.descricao || product.description}
                </Typography>
              )}
              {(product.detalhes || product.details) && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.detalhes || product.details}
                </Typography>
              )}
              {comentarioUsuario && (
                <Typography variant="body2" color="secondary" gutterBottom sx={{ fontStyle: 'italic', mt: 1 }}>
                  “{comentarioUsuario}”
                </Typography>
              )}
              <Typography variant="subtitle1" color="primary" gutterBottom>
                R$ {product.preco || product.price}
              </Typography>
              {(product.categoria || product.category) && (
                <Typography variant="body2" color="text.secondary">
                  Categoria: {product.categoria || product.category}
                </Typography>
              )}
              {(product.marca || product.brand) && (
                <Typography variant="body2" color="text.secondary">
                  Marca: {product.marca || product.brand}
                </Typography>
              )}
              {product.data && (
                <Typography variant="body2" color="text.secondary">
                  Data: {product.data}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetailsModal;