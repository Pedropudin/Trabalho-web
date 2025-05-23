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

function AvaliacaoModal({ open, onClose, produtosParaAvaliar, onAvaliar }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [produtoIdx, setProdutoIdx] = useState(0);
  const [erro, setErro] = useState('');

  const handleSubmit = () => {
    if (nota < 1) {
      setErro('Por favor, selecione uma nota de estrelas para enviar.');
      return;
    }
    if (comentario.trim() === '') {
      setErro('Por favor, escreva um comentário antes de enviar.');
      return;
    }
    onAvaliar(nota, comentario, produtoIdx);
    setNota(0);
    setComentario('');
    setProdutoIdx(0);
    setErro('');
    onClose();
  };

  const handleClose = () => {
    setErro('');
    onClose();
  };

  const produto = produtosParaAvaliar[produtoIdx] || {};

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Avaliar Produto</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Produto"
          value={produtoIdx}
          onChange={e => setProdutoIdx(Number(e.target.value))}
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
        {/* Preço e data antes da avaliação, centralizados, com espaço abaixo */}
        <Box display="flex" flexDirection="column" alignItems="center" mt={2} mb={2}>
          {produto.preco && <span style={{ color: '#2e7d32', fontWeight: 500, fontSize: '1.1em' }}>{produto.preco}</span>}
          {produto.data && <span style={{ color: '#555', fontSize: '0.98em', marginTop: 2 }}>Data da compra: {produto.data}</span>}
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <span>Avaliação:</span>
          <Rating
            value={nota}
            onChange={(_, newValue) => setNota(newValue)}
          />
        </Box>
        <TextField
          label="Comentário"
          multiline
          rows={4}
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          fullWidth
          margin="normal"
        />
        {erro && <Box color="#b71c1c" mb={1}>{erro}</Box>}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-start', pl: 2, pr: 2 }}>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          sx={{ mr: 1 }}
        >
          Enviar
        </Button>
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
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function AvaliacaoCard({ produtosAguardando, produtosParaAvaliar, onAvaliar }) {
  const [open, setOpen] = useState(false);

  const handleAvaliarClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <section className="avaliacao">
      <button onClick={handleAvaliarClick} disabled={open}>
        <i className="fas fa-star"></i> Avaliar
      </button>
      <AvaliacaoModal
        open={open}
        onClose={handleClose}
        produtosParaAvaliar={produtosParaAvaliar}
        onAvaliar={onAvaliar}
      />
    </section>
  );
}

const UserRating = ({ produtosAguardando = 1, imagem = "/imagens/raquete_elétrica2.jpeg", produtosParaAvaliar = [], onAvaliar = () => {} }) => {
  return (
    <div>
      <AvaliacaoCard
        produtosAguardando={produtosAguardando}
        produtosParaAvaliar={produtosParaAvaliar}
        onAvaliar={onAvaliar}
      />
    </div>
  );
}

export default UserRating;