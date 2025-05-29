import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductDetailsModal = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product.nome || product.name || 'Detalhes do Produto'}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
          {product.imagem || product.image || product.img ? (
            <Box flexShrink={0} display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={220}>
              <img
                src={product.imagem || product.image || product.img}
                alt={product.nome || product.name}
                style={{ width: 200, height: 200, objectFit: 'contain', background: '#fafafa', borderRadius: 8 }}
              />
              {/* Botão Comprar logo abaixo da imagem */}
              {product.showBuyButton === true && (
                <Button color="primary" variant="contained" sx={{ mt: 2 }} startIcon={<ShoppingCartIcon />}>
                  Comprar
                </Button>
              )}
            </Box>
          ) : null}
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
            <Typography variant="subtitle1" color="primary" gutterBottom>
                R$ {product.preco || product.price}
            </Typography>
            {/* Exibe outros campos relevantes, se existirem */}
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
        <Button onClick={onClose} color="primary" variant="contained">Fechar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailsModal;
