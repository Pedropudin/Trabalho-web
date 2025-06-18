import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Modal,
  TextField, Select, MenuItem, InputLabel,
  FormControl, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RegisterCard from './RegisterCard';

// Inline style object for the modal's main Box
// Defines centering, max width, background color, border radius, shadow, padding, and flexible layout
const style = {
  // Inline CSS for the modal's main Box
  // position, top, left, transform: center the modal on the screen
  // width, maxWidth: control size
  // bgcolor: theme background color
  // borderRadius: rounded corners
  // boxShadow: shadow for highlight
  // p: internal padding
  // outline: removes focus border
  // display, flexDirection, gap: flexible column layout with spacing
  position: 'absolute',
  top: '56%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '95vw',
  maxWidth: 480,
  minWidth: 300,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  boxSizing: 'border-box',
};

// WalletModal component
// Props:
// - cards: array of registered cards
// - setCards: function to update cards
// - validatedCards: cards with updated balance
// - onClose: function to close the modal

export default function WalletModal({ cartoes, setCartoes, cartoesValidados, onClose }) {
  const safeCards = Array.isArray(cartoes) ? cartoes : [];
  const safeValidatedCards = Array.isArray(cartoesValidados) ? cartoesValidados : [];

  const [amountToAdd, setAmountToAdd] = useState('');

  // State for the selected card for charging
  const [selectedCard, setSelectedCard] = useState(safeCards[0]?.last4 || '');

  // Feedback message (success or error)
  const [message, setMessage] = useState('');

  // Step controls whether adding balance or registering a new card
  const [step, setStep] = useState('add');

  // State for form error message
  const [formError, setFormError] = useState('');

  // Side effect to lock body scroll while the modal is open
  useEffect(() => {
    document.body.classList.add('wallet-modal-open');
    return () => {
      document.body.classList.remove('wallet-modal-open');
    };
  }, []);

  // Function to add balance to the selected card
  // Validates value, card, and updates the cards array
  async function handleAddBalance(e) {
    e.preventDefault();
    setFormError('');

    // Validation: amount cannot be empty
    if (!amountToAdd) {
      setFormError('Please enter the amount to add.');
      return;
    }

    // Validation: amount must be a positive number
    const value = parseFloat(amountToAdd.replace(',', '.'));
    if (isNaN(value) || value <= 0) {
      setFormError('Please enter a valid amount greater than zero.');
      return;
    }

    // Validation: a card must be selected
    if (!selectedCard) {
      setFormError('Please select a card for charging before adding balance.');
      return;
    }

    // Atualiza saldo no backend
    const userId = localStorage.getItem('userId');
    let updatedCards = [];
    if (userId) {
      try {
        // Busca usuário atual
        const resUser = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`);
        const user = await resUser.json();
        const cardsArr = Array.isArray(user.card) ? user.card : [];
        // Atualiza saldo do cartão selecionado
        const newCards = cardsArr.map(c =>
          c.last4 === selectedCard
            ? { ...c, balance: (c.balance ?? 0) + value }
            : c
        );
        // Salva no backend
        await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ card: newCards })
        });
        updatedCards = newCards;
        setCartoes(newCards);
        localStorage.setItem('walletCards', JSON.stringify(newCards));
      } catch {
        setFormError('Error updating card balance. Try again.');
        return;
      }
    } else {
      // Atualiza apenas localmente
      updatedCards = cartoes.map(c =>
        c.last4 === selectedCard
          ? { ...c, balance: (c.balance ?? 0) + value }
          : c
      );
      setCartoes(updatedCards);
      localStorage.setItem('walletCards', JSON.stringify(updatedCards));
    }

    // Success message and automatic modal close
    setMessage('Balance added successfully!');
    setAmountToAdd('');
    setTimeout(() => {
      setMessage('');
      onClose();
    }, 1200);
  }

  // Function to delete a card from the list
  // Asks for user confirmation before removal
  function handleDeleteCard(last4) {
    const confirmDelete = window.confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      setCartoes(prev => prev.filter(c => c.last4 !== last4));
      // If the deleted card was selected, select another (or none)
      if (selectedCard === last4) {
        const remaining = cartoes.filter(c => c.last4 !== last4);
        setSelectedCard(remaining[0]?.last4 || '');
      }
    }
  }

  // Get the balance of the currently selected card
  const selectedBalance = safeValidatedCards.find(c => c.last4 === selectedCard)?.balance ?? 0;

  return (
    // Material UI Modal with high z-index to overlay the interface
    <Modal open onClose={onClose} aria-labelledby="wallet-modal-title" sx={{ zIndex: 1300 }}>
      {/* Main Box with inline style defined above */}
      <Box sx={style}>
        {/* Button to close the modal (top right corner) */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
          }}
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>

        {/* Modal title */}
        <Typography
          id="wallet-modal-title"
          variant="h5"
          component="h2"
          align="center"
          fontWeight={600}
          mb={2}
        >
          {/* variant="h5": medium title
              align="center": center text
              fontWeight={600}: bold
              mb={2}: bottom margin */}
          Wallet
        </Typography>

        {/* Displays selected card balance */}
        <Typography align="center" fontSize={18} mb={2}>
          {/* align="center": center text
              fontSize={18}: font size
              mb={2}: bottom margin */}
          Available balance: <b>${selectedBalance.toFixed(2)}</b>
        </Typography>

        {/* Step to add balance */}
        {step === 'add' && (
          <>
            {/* Form to add balance */}
            <Box component="form" onSubmit={handleAddBalance} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* display: flex, flexDirection: 'column': vertical layout
                  gap: spacing between fields */}
              {/* Field for the amount to add */}
              <TextField
                label="Add Money"
                type="number"
                value={amountToAdd}
                onChange={e => {
                  // Prevents negative values and invalid characters
                  const v = e.target.value;
                  if (v === '' || /^\d*\.?\d*$/.test(v)) {
                    setAmountToAdd(v);
                  }
                }}
                placeholder="Amount in USD"
                fullWidth
                error={!!formError && (!amountToAdd || parseFloat(amountToAdd) <= 0)}
              />

              {/* Select to choose the payment card */}
              <FormControl fullWidth required error={!!formError && !selectedCard}>
                <InputLabel id="card-label">Payment Card</InputLabel>
                <Select
                  labelId="card-label"
                  value={selectedCard}
                  label="Payment Card"
                  onChange={e => setSelectedCard(e.target.value)}
                >
                  {/* List of available cards */}
                  {safeValidatedCards.map(c => (
                    <MenuItem key={c.last4} value={c.last4}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box>{c.brand} **** {c.last4} (${Number(c.balance ?? 0).toFixed(2)})</Box>
                        {/* Button to delete card (trash icon) */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCard(c.last4);
                          }}
                          size="small"
                          edge="end"
                          aria-label="Delete card"
                        >
                        </IconButton>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Displays form error message, if any */}
              {formError && (
                <Typography color="error" align="center" fontSize={14} mt={1}>
                  {formError}
                </Typography>
              )}

              {/* Button to submit the form and add balance */}
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                {/* mt: top margin */}
                Add Balance
              </Button>
            </Box>

            {/* Button to switch to new card registration step */}
            <Button
              variant="text"
              color="primary"
              sx={{ mt: 1, fontSize: 14, alignSelf: 'center' }}
              onClick={() => setStep('newCard')}
            >
              {/* mt: top margin, fontSize: size, alignSelf: centers button */}
              + Register New Card
            </Button>
          </>
        )}

        {/* New card registration step */}
        {step === 'newCard' && (
           <RegisterCard
             onSalvar={async (savedCard) => {
               const last4 = (savedCard.number || '').replace(/\D/g, '').slice(-4);
               if ((Array.isArray(cartoes) ? cartoes : []).some(c => c.last4 === last4)) {
                 setMessage('A card with these final digits is already registered.');
                 setTimeout(() => setMessage(''), 1800);
                 setStep('add');
                 return;
               }
               // Salva no backend
               const userId = localStorage.getItem('userId');
               if (userId) {
                 await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/cards`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ ...savedCard, last4 })
                 });
               }
               setCartoes(cs => [
                 ...cs,
                 {
                   ...savedCard,
                   last4,
                   balance: 0
                 }
               ]);
               setSelectedCard(last4);
               setMessage('Card registered!');
               setStep('add');
               setTimeout(() => setMessage(''), 1200);
             }}
             onCancelar={() => setStep('add')}
             setCartoes={setCartoes}
           />
        )}

        {/* Success feedback message displayed at the bottom of the modal */}
        {message && (
          <Typography color="success.main" align="center" mt={2}>
            {/* color: theme success color
                mt: top margin */}
            {message}
          </Typography>
        )}
      </Box>
    </Modal>
  );
}