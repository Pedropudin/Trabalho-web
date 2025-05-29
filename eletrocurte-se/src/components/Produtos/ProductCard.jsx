// -----------------------------------------------------------------------------
// ProductCard.jsx
// Card de produto reutilizável para exibição em listas e grids.
// Mostra imagem, nome, preço, estoque, avaliação e detalhes do produto.
// Integração com Material-UI para layout responsivo e estilização.
// Exibe mensagem de login se usuário não autenticado tentar acessar detalhes.
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';

const CARD_WIDTH = 260;
const CARD_HEIGHT = 370;
const IMG_HEIGHT = 140; // Ajuste para imagem não cortar

const ProductCard = ({ product, onClick, isLoggedIn, pageType }) => {
  // Estado para controlar erro de carregamento da imagem
  const [imgError, setImgError] = useState(false);
  // Estado para exibir mensagem de login obrigatório
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  // Seleciona a fonte da imagem do produto
  const imageSrc = !imgError ? (product.img || product.imagem || product.image) : null;
  // Verifica se está na home e usuário não está logado
  const isHomeNotLogged = pageType === 'home' && !isLoggedIn;

  // Lida com clique no card: exige login na home, senão chama onClick
  const handleCardClick = (e) => {
    if (isHomeNotLogged) {
      e.preventDefault();
      e.stopPropagation();
      setShowLoginMsg(true);
      setTimeout(() => setShowLoginMsg(false), 2500);
      return;
    }
    if (onClick) onClick(product);
  };

  // Exibe mensagem flutuante se usuário não estiver logado
  React.useEffect(() => {
    if (showLoginMsg) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'mensagem show info';
      msgDiv.style.position = 'fixed';
      msgDiv.style.top = '20px';
      msgDiv.style.left = '50%';
      msgDiv.style.transform = 'translateX(-50%)';
      msgDiv.style.zIndex = 9999;
      msgDiv.style.background = '#2196F3';
      msgDiv.style.color = '#fff';
      msgDiv.style.padding = '12px 24px';
      msgDiv.style.borderRadius = '8px';
      msgDiv.style.fontWeight = 'bold';
      msgDiv.textContent = 'Faça login para ver as especificações do produto.';
      document.body.appendChild(msgDiv);
      const timeout = setTimeout(() => {
        msgDiv.remove();
      }, 2500);
      return () => {
        clearTimeout(timeout);
        msgDiv.remove();
      };
    }
  }, [showLoginMsg]);

  return (
    <Card
      // Card do Material-UI com estilização responsiva
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
      className="produto-card"
    >
      <CardActionArea
        // Área clicável do card, customizada para não mudar cor ao focar/hover
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
        {/* Imagem do produto ou mensagem de indisponível */}
        <Box sx={{ height: IMG_HEIGHT, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', mb: 1 }}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.nome || product.name}
              style={{
                maxHeight: IMG_HEIGHT,
                maxWidth: '30%',
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block',
                borderRadius: 8,
                aspectRatio: '1.1/1', // Mantém proporção mais quadrada
              }}
              onError={() => setImgError(true)}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">Imagem indisponível</Typography>
          )}
        </Box>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', p: 2, gap: 0.5 }}>
          {/* Nome do produto */}
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
            {product.nome || product.name}
          </Typography>
          {/* Preço e parcelamento */}
          <Box mt={1} mb={0} sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
              {typeof product.preco === 'string' && product.preco.startsWith('R$')
                ? product.preco
                : `R$ ${product.preco || product.price}`}
            </Typography>
            {product.parcelamento && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                ou {product.parcelamento}
              </Typography>
            )}
          </Box>
          {/* Avaliação do produto */}
          <Box mt={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            {product.avaliacao !== undefined && (
              <>
                <Rating value={Number(product.avaliacao)} precision={1} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                  {product.avaliacao}
                </Typography>
              </>
            )}
          </Box>
          {/* Estoque */}
          <Box mt={1} sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
            {product.estoque !== undefined && (
              <Typography variant="caption" color={product.estoque > 0 ? 'success.main' : 'error.main'}>
                {product.estoque > 0 ? `Em estoque: ${product.estoque}` : 'Indisponível'}
              </Typography>
            )}
          </Box>
          {/* Detalhes adicionais: marca, modelo, cor, voltagem, garantia */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {product.marca && `Marca: ${product.marca}`} {product.modelo && `| Modelo: ${product.modelo}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {product.cor && `Cor: ${product.cor}`} {product.voltagem && `| Voltagem: ${product.voltagem}`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {product.garantia && `Garantia: ${product.garantia}`}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      {/* Botão Comprar removido do card. Agora só aparece no modal de detalhes. */}
    </Card>
  );
};

export default ProductCard;
