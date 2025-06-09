import React, { useState, useMemo, useEffect } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import ModalCarteira from './ModalCarteira';
import CartoesList from './CartoesList';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import '../../../styles/EditarPerfil.css';

// Main Wallet component for the user
// - Manages balance and cards using localStorage
// - Allows adding balance and deleting cards
// - Uses ModalCarteira to add balance and CartoesList to list cards
// - Displays buttons to add balance and return to profile
// - Uses Material UI for layout and dialogs
// - Updates localStorage whenever balance or cards change
// - Confirms card deletion with a dialog

export default function Carteira({ onVoltar }) {
  // Initializes balance with localStorage, or 0 if empty
  const [saldo, setSaldo] = useState(() => {
    const saldoArmazenado = localStorage.getItem('carteiraSaldo');
    return saldoArmazenado ? parseFloat(saldoArmazenado) : 0;
  });

  // Initializes cards with localStorage, or with a default card
  const [cartoes, setCartoes] = useState(() => {
    const cartoesArmazenados = localStorage.getItem('carteiraCartoes');
    return cartoesArmazenados
      ? JSON.parse(cartoesArmazenados)
      : [{ bandeira: 'Visa', final: '1234', numero: '**** **** **** 1234' }];
  });

  const [modalAberto, setModalAberto] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartaoParaExcluir, setCartaoParaExcluir] = useState(null);

  const cartoesValidados = useMemo(() => {
    return cartoes.map(c => ({
      ...c,
      saldo: c.saldo ?? 0,
    }));
  }, [cartoes]);

  // Updates localStorage whenever balance changes
  useEffect(() => {
    localStorage.setItem('carteiraSaldo', saldo.toString());
  }, [saldo]);

  // Updates localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('carteiraCartoes', JSON.stringify(cartoes));
  }, [cartoes]);

  function handleExcluirCartao(final) {
    setCartaoParaExcluir(final);
    setDialogOpen(true);
  }

  function confirmarExclusao() {
    setCartoes(prev => prev.filter(c => c.final !== cartaoParaExcluir));
    setDialogOpen(false);
    setCartaoParaExcluir(null);
  }

  function cancelarExclusao() {
    setDialogOpen(false);
    setCartaoParaExcluir(null);
  }

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary" mb={2}>
        {/* variant="h4": large title */}
        {/* fontWeight={700}: bold text */}
        {/* color="primary": uses the theme's primary color */}
        {/* mb={2}: adds bottom margin for spacing */}
        Carteira
      </Typography>

      {/* New card component */}
      <CartoesList cartoes={cartoesValidados} onExcluir={handleExcluirCartao} />

      {modalAberto && (
        <ModalCarteira
          saldo={saldo}
          setSaldo={setSaldo}
          cartoes={cartoes}
          setCartoes={setCartoes}
          cartoesValidados={cartoesValidados}
          onClose={() => setModalAberto(false)}
        />
      )}

      {/* Extra space before buttons */}
      <div style={{ height: 24 }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 2, fontWeight: 600, fontSize: 16 }}
        onClick={() => setModalAberto(true)}
      >
        Adicionar saldo
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        fullWidth
        sx={{ mb: 2, fontWeight: 500, fontSize: 15 }}
        onClick={onVoltar}
      >
        Voltar ao Perfil
      </Button>

      <Dialog open={dialogOpen} onClose={cancelarExclusao}>
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <Typography>Tem certeza que deseja excluir o cartão selecionado?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarExclusao} color="inherit">Cancelar</Button>
          <Button onClick={confirmarExclusao} color="error" variant="contained">Excluir</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}