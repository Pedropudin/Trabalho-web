// -----------------------------------------------------------------------------
// UserRating.jsx
// Componente para avaliação de produtos pelo usuário.
// Permite selecionar produto, dar nota, comentar e enviar avaliação.
// Utiliza Material-UI Dialog, Rating e campos de texto.
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

function AvaliacaoModal({ open, onClose, produtosParaAvaliar, onAvaliar }) {
  // Estado da nota de estrelas
  const [nota, setNota] = useState(0);
  // Estado do comentário
  const [comentario, setComentario] = useState('');
  // Índice do produto selecionado
  const [produtoIdx, setProdutoIdx] = useState(0);
  // Mensagem de erro para validação
  const [erro, setErro] = useState('');

  // Envia avaliação se nota e comentário forem válidos
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

  // Fecha o modal e limpa erro
  const handleClose = () => {
    setErro('');
    onClose();
  };

  // Produto atualmente selecionado
  const produto = produtosParaAvaliar[produtoIdx] || {};

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Avaliar Produto</DialogTitle>
      <DialogContent>
        {/* Seleção do produto a ser avaliado */}
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
        {/* Exibe preço e data da compra */}
        <Box display="flex" flexDirection="column" alignItems="center" mt={2} mb={2}>
          {produto.preco && <span style={{ color: '#2e7d32', fontWeight: 500, fontSize: '1.1em' }}>{produto.preco}</span>}
          {produto.data && <span style={{ color: '#555', fontSize: '0.98em', marginTop: 2 }}>Data da compra: {produto.data}</span>}
        </Box>
        {/* Campo de avaliação por estrelas */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <span>Avaliação:</span>
          <Rating
            value={nota}
            onChange={(_, newValue) => setNota(newValue)}
          />
        </Box>
        {/* Campo de comentário */}
        <TextField
          label="Comentário"
          multiline
          rows={4}
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Mensagem de erro, se houver */}
        {erro && <Box color="#b71c1c" mb={1}>{erro}</Box>}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-start', pl: 2, pr: 2 }}>
        {/* Botão para enviar avaliação */}
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          sx={{ mr: 1 }}
        >
          Enviar
        </Button>
        {/* Botão para cancelar */}
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
  // Estado para abrir/fechar modal
  const [open, setOpen] = useState(false);

  const handleAvaliarClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <section>
      {/* Botão para abrir modal de avaliação */}
      <button 
        onClick={handleAvaliarClick} 
        disabled={open} 
        className="avaliacao-btn"
        type="button"
      >
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
      {/* Card de avaliação de produtos aguardando avaliação */}
      <AvaliacaoCard
        produtosAguardando={produtosAguardando}
        produtosParaAvaliar={produtosParaAvaliar}
        onAvaliar={onAvaliar}
      />
    </div>
  );
}

export default UserRating;