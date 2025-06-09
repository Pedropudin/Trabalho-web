import React, { useState, useMemo, useEffect } from 'react';
import { Button, Typography, Paper } from '@mui/material';
import WalletModal from './ModalCarteira'; // Você pode renomear o arquivo se quiser
import CardsList from './CartoesList';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import '../../../styles/EditarPerfil.css';

// Main Wallet component for the user
// - Manages balance and cards using localStorage
// - Allows adding balance and deleting cards
// - Uses WalletModal to add balance and CardsList to list cards
// - Displays buttons to add balance and return to profile
// - Uses Material UI for layout and dialogs
// - Updates localStorage whenever balance or cards change
// - Confirms card deletion with a dialog

export default function Wallet({ onBack }) {
  // Initializes balance with localStorage, or 0 if empty
  const [balance, setBalance] = useState(() => {
    const storedBalance = localStorage.getItem('walletBalance');
    return storedBalance ? parseFloat(storedBalance) : 0;
  });

  // Initializes cards with localStorage, or with a default card
  const [cards, setCards] = useState(() => {
    const storedCards = localStorage.getItem('walletCards');
    return storedCards
      ? JSON.parse(storedCards)
      : [{ brand: 'Visa', last4: '1234', number: '**** **** **** 1234' }];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  const validatedCards = useMemo(() => {
    return cards.map(c => ({
      ...c,
      balance: c.balance ?? 0,
    }));
  }, [cards]);

  // Updates localStorage whenever balance changes
  useEffect(() => {
    localStorage.setItem('walletBalance', balance.toString());
  }, [balance]);

  // Updates localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('walletCards', JSON.stringify(cards));
  }, [cards]);

  function handleDeleteCard(last4) {
    setCardToDelete(last4);
    setDialogOpen(true);
  }

  function confirmDeletion() {
    setCards(prev => prev.filter(c => c.last4 !== cardToDelete));
    setDialogOpen(false);
    setCardToDelete(null);
  }

  function cancelDeletion() {
    setDialogOpen(false);
    setCardToDelete(null);
  }

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h4" align="center" fontWeight={700} color="primary" mb={2}>
        {/* variant="h4": large title */}
        {/* fontWeight={700}: bold text */}
        {/* color="primary": uses the theme's primary color */}
        {/* mb={2}: adds bottom margin for spacing */}
        Wallet
      </Typography>

      {/* Cards list component */}
      <CardsList cards={validatedCards} onDelete={handleDeleteCard} />

      {modalOpen && (
        <WalletModal
          balance={balance}
          setBalance={setBalance}
          cards={cards}
          setCards={setCards}
          validatedCards={validatedCards}
          onClose={() => setModalOpen(false)}
        />
      )}

      {/* Extra space before buttons */}
      <div style={{ height: 24 }} />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mb: 2, fontWeight: 600, fontSize: 16 }}
        onClick={() => setModalOpen(true)}
      >
        Add Balance
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        fullWidth
        sx={{ mb: 2, fontWeight: 500, fontSize: 15 }}
        onClick={onBack}
      >
        Back to Profile
      </Button>

      <Dialog open={dialogOpen} onClose={cancelDeletion}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete the selected card?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeletion} color="inherit">Cancel</Button>
          <Button onClick={confirmDeletion} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}