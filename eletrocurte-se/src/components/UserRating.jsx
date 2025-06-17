// -----------------------------------------------------------------------------
// UserRating.jsx
// Component for user product rating.
// Allows selecting a product, giving a rating, commenting, and submitting the review.
// Uses Material-UI Dialog, Rating, and text fields.
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function AvaliacaoModal({ open, onClose, produtosParaAvaliar, onAvaliar, produtoAvaliacaoIdx, setProdutoAvaliacaoIdx }) {
  // Star rating state
  const [nota, setNota] = useState(0);
  // Comment state
  const [comentario, setComentario] = useState('');
  // Error message for validation
  const [erro, setErro] = useState('');

  // Currently selected product
  const produto = produtosParaAvaliar[produtoAvaliacaoIdx] || {};

  // Reset nota/comentario ao abrir modal para novo produto
  React.useEffect(() => {
    if (open) {
      setNota(0);
      setComentario('');
      setErro('');
    }
  }, [open, produtoAvaliacaoIdx]);

  // Submit review if rating and comment are valid
  const handleSubmit = async () => {
    if (nota < 1) {
      setErro('Please select a star rating before submitting.');
      return;
    }
    if (comentario.trim() === '') {
      setErro('Please write a comment before submitting.');
      return;
    }
    // Send evaluation to backend
    const produto = produtosParaAvaliar[produtoAvaliacaoIdx];
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    if (produto && produto.id && nomeUsuario) {
      await fetch(`${process.env.REACT_APP_API_URL}/api/products/${produto.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: nomeUsuario,
          rating: nota,
          comment: comentario
        })
      });
    }
    onAvaliar(nota, comentario, produtoAvaliacaoIdx);
    setNota(0);
    setComentario('');
    setErro('');
    setProdutoAvaliacaoIdx(0); // reset to first product after review
    onClose();
  };

  // Close modal and clear error
  const handleClose = () => {
    setErro('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Rate Product</DialogTitle>
      <DialogContent>
        {/* Selected product image */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <img
            src={produto.img || '/logo-sem-borda.png'}
            alt={produto.nome || 'Product'}
            width={80}
            height={80}
            style={{ borderRadius: 12, boxShadow: '0 2px 8px #0002', background: '#fff', objectFit: 'cover' }}
          />
        </Box>
        {/* Product selection dropdown */}
        <TextField
          select
          label="Product"
          value={produtoAvaliacaoIdx}
          onChange={e => setProdutoAvaliacaoIdx(Number(e.target.value))}
          fullWidth
          margin="normal"
        >
          {produtosParaAvaliar.map((p, idx) => (
            <MenuItem key={p.nome + idx} value={idx}>
              <Box display="flex" alignItems="center" gap={1}>
                <img src={p.img || '/logo-sem-borda.png'} alt={p.nome} width={40} height={40} style={{ borderRadius: 8 }} />
                {p.nome}
              </Box>
            </MenuItem>
          ))}
        </TextField>
        {/* Displays price and purchase date */}
        <Box display="flex" flexDirection="column" alignItems="center" mt={2} mb={2}>
          {produto.preco && <span style={{ color: '#2e7d32', fontWeight: 500, fontSize: '1.1em' }}>{produto.preco}</span>}
          {produto.data && <span style={{ color: '#555', fontSize: '0.98em', marginTop: 2 }}>Purchase date: {produto.data}</span>}
        </Box>
        {/* Star rating field */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <span>Rating:</span>
          <Rating
            value={nota}
            onChange={(_, newValue) => setNota(newValue)}
          />
        </Box>
        {/* Comment field */}
        <TextField
          label="Comment"
          multiline
          rows={4}
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Error message, if any */}
        {erro && <Box color="#b71c1c" mb={1}>{erro}</Box>}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-start', pl: 2, pr: 2 }}>
        {/* Submit review button */}
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          sx={{ mr: 1 }}
        >
          Submit
        </Button>
        {/* Cancel button */}
        <Button 
          onClick={handleClose} 
          color="secondary"
          variant="outlined"
          sx={{ 
            borderColor: '#bbb', 
            color: '#555', 
            background: '#fafafa', 
            boxShadow: 'none',
            '&:hover': {
              borderColor: '#888',
              background: '#f0f0f0',
            }
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AvaliacaoCard({ produtosAguardando, produtosParaAvaliar, onAvaliar, produtoAvaliacaoIdx, setProdutoAvaliacaoIdx }) {
  // State for open/close modal
  const [open, setOpen] = useState(false);

  const handleAvaliarClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <section>
      {/* Button to open review modal */}
      <button 
        onClick={handleAvaliarClick} 
        disabled={open} 
        className="avaliacao-btn"
        type="button"
      >
        <i className="fas fa-star"></i> Review
      </button>
      <AvaliacaoModal
        open={open}
        onClose={handleClose}
        produtosParaAvaliar={produtosParaAvaliar}
        onAvaliar={onAvaliar}
        produtoAvaliacaoIdx={produtoAvaliacaoIdx}
        setProdutoAvaliacaoIdx={setProdutoAvaliacaoIdx}
      />
    </section>
  );
}

const UserRating = ({ produtosAguardando = 1, produtosParaAvaliar = [], onAvaliar = () => {}, produtoAvaliacaoIdx = 0, setProdutoAvaliacaoIdx = () => {} }) => {
  return (
    <div>
      {/* Product rating card for products awaiting review */}
      <AvaliacaoCard
        produtosAguardando={produtosAguardando}
        produtosParaAvaliar={produtosParaAvaliar.map(p => ({
          ...p,
          evaluation: p.evaluation ?? 0 // Garante nota zero por padrão
        }))}
        onAvaliar={onAvaliar}
        produtoAvaliacaoIdx={produtoAvaliacaoIdx}
        setProdutoAvaliacaoIdx={setProdutoAvaliacaoIdx}
      />
    </div>
  );
}

export default UserRating;