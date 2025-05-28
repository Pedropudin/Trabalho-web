import React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ProductCard = ({ product, onClick }) => {
  return (
    <Card sx={{ maxWidth: 300, borderRadius: 3, boxShadow: 3 }}>
      <CardActionArea onClick={() => onClick(product)}>
        {product.imagem || product.image ? (
          <CardMedia
            component="img"
            height="180"
            image={product.imagem || product.image}
            alt={product.nome || product.name}
            sx={{ objectFit: 'contain', background: '#fafafa' }}
          />
        ) : null}
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.nome || product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product.descricao || product.description}
          </Typography>
          <Box mt={1}>
            <Typography variant="subtitle1" color="primary">
              R$ {product.preco || product.price}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard;
