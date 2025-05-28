import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const ProductDetailsModal = ({ open, onClose, product }) => {
  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product.nome || product.name || 'Detalhes do Produto'}</DialogTitle>
      <Divider />
      <DialogContent>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          {product.imagem || product.image ? (
            <Box flexShrink={0}>
              <img
                src={product.imagem || product.image}
                alt={product.nome || product.name}
                style={{ maxWidth: 300, borderRadius: 8 }}
              />
            </Box>
          ) : null}
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {product.nome || product.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {product.descricao || product.description}
            </Typography>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              Preço: R$ {product.preco || product.price}
            </Typography>
            {/* Adicione mais campos conforme necessário */}
            {product.categoria && (
              <Typography variant="body2">Categoria: {product.categoria}</Typography>
            )}
            {product.marca && (
              <Typography variant="body2">Marca: {product.marca}</Typography>
            )}
            {/* Exemplo de renderização dinâmica de outros campos */}
            {Object.entries(product).map(([key, value]) => {
              if ([
                'nome', 'name', 'descricao', 'description', 'preco', 'price', 'imagem', 'image', 'categoria', 'marca'
              ].includes(key)) return null;
              return (
                <Typography key={key} variant="body2">
                  {key}: {String(value)}
                </Typography>
              );
            })}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDetailsModal;
