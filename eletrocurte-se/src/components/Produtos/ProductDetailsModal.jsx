// -----------------------------------------------------------------------------
// ProductDetailsModal.jsx
// Modal de detalhes do produto, exibido ao clicar em um card.
// Mostra imagem, nome, descrição, preço, categoria, marca e botão de compra.
// Utiliza Material-UI Dialog para exibição responsiva.
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ROUTES from '../../routes';

const ProductDetailsModal = ({ open, onClose, product }) => {
  const navigate = useNavigate();
  // Novo estado para mostrar o pop-up de contagem do carrinho
  const [cartCountPopup, setCartCountPopup] = useState(null);

  // Se não houver produto, não renderiza nada
  if (!product) return null;

  // Busca comentário do usuário logado, se houver
  let comentarioUsuario = undefined;
  if (product.id && localStorage.getItem('nomeUsuario')) {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const avaliacoes = JSON.parse(localStorage.getItem(`avaliacoes_${nomeUsuario}`) || '{}');
    if (avaliacoes[product.id] && avaliacoes[product.id].comentario) {
      comentarioUsuario = avaliacoes[product.id].comentario;
    }
  }

  // Função para adicionar ao carrinho e ir para o checkout
  function handleComprar() {
    if (!product) return;
    // Adiciona ao carrinho (se já existir, incrementa quantidade)
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const id = product.id || product.ID || product.Id;
    const name = product.nome || product.name;
    const price = parseFloat(product.preco?.replace(',', '.') || product.price);
    const image = product.img || product.imagem || product.image;
    const estoque = product.estoque ?? product.inStock ?? 1;
    let updatedCart;
    const existing = cart.find(item => String(item.id) === String(id));
    if (existing) {
      if ((existing.quantity + 1) > estoque) {
        toast.error("Número máximo de produtos atingido. Erro: Falta de estoque!");
        return;
      }
      updatedCart = cart.map(item =>
        String(item.id) === String(id)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id,
          name,
          price,
          image,
          quantity: 1
        }
      ];
    }
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success('Produto colocado no carrinho com sucesso!');
    // Dispara evento customizado para atualização global do carrinho
    window.dispatchEvent(new Event('cartUpdated'));
    // Mostra o pop-up com a contagem de produtos no carrinho
    const totalCount = updatedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCountPopup(totalCount);
    setTimeout(() => setCartCountPopup(null), 2000);
    onClose && onClose();
    navigate(ROUTES.CHECKOUT);
  }

  return (
    <>
      {/* Pop-up de contagem do carrinho */}
      {cartCountPopup !== null && (
        <div style={{
          position: 'fixed',
          top: 30,
          right: 30,
          zIndex: 2000,
          background: '#007b99',
          color: '#fff',
          padding: '16px 28px',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 18,
          boxShadow: '0 4px 16px rgba(0,0,0,0.13)'
        }}>
          {cartCountPopup} produto{cartCountPopup > 1 ? 's' : ''} no carrinho
        </div>
      )}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {/* Título do modal com nome do produto */}
        <DialogTitle>{product.nome || product.name || 'Detalhes do Produto'}</DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
            {/* Imagem do produto e botão Comprar */}
            {product.imagem || product.image || product.img ? (
              <Box flexShrink={0} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={220}>
                <img
                  src={product.imagem || product.image || product.img}
                  alt={product.nome || product.name}
                  style={{ width: 200, height: 200, objectFit: 'contain', background: '#fafafa', borderRadius: 8 }}
                />
                {/* Botão Comprar aparece apenas se showBuyButton for true */}
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
            ) : null}
            {/* Detalhes do produto: nome, descrição, preço, categoria, marca, data */}
            <Box display="flex" flexDirection="column" justifyContent="center" height={220} ml={{ xs: 0, md: 6 }} alignSelf="center" minWidth={220}>
              <Typography variant="h6" gutterBottom>
                {product.nome || product.name}
              </Typography>
              {product.descricao || product.description ? (
                <Typography variant="body1" gutterBottom>
                  {product.descricao || product.description}
                </Typography>
              ) : null}
              {product.detalhes || product.details ? (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.detalhes || product.details}
                </Typography>
              ) : null}
              {/* Comentário do usuário logado, se houver */}
              {comentarioUsuario && (
                <Typography variant="body2" color="secondary" gutterBottom sx={{ fontStyle: 'italic', mt: 1 }}>
                  “{comentarioUsuario}”
                </Typography>
              )}
              <Typography variant="subtitle1" color="primary" gutterBottom>
                  R$ {product.preco || product.price}
              </Typography>
              {/* Categoria, marca e data, se existirem */}
              {product.categoria || product.category ? (
                <Typography variant="body2" color="text.secondary">
                  Categoria: {product.categoria || product.category}
                </Typography>
              ) : null}
              {product.marca || product.brand ? (
                <Typography variant="body2" color="text.secondary">
                  Marca: {product.marca || product.brand}
                </Typography>
              ) : null}
              {product.data ? (
                <Typography variant="body2" color="text.secondary">
                  Data: {product.data}
                </Typography>
              ) : null}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {/* Botão para fechar o modal */}
          <Button onClick={onClose} color="primary" variant="contained">Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetailsModal;
