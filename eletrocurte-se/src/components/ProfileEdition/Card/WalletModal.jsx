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
  const [selectedCard, setSelectedCard] = useState(safeCards[0]?.final || '');

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
  function handleAddBalance(e) {
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

    // Update the balance of the selected card
    setCartoes(prev =>
      prev.map(c =>
        c.final === selectedCard
          ? { ...c, saldo: (c.saldo ?? 0) + value }
          : c
      )
    );

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
  function handleDeleteCard(final) {
    const confirmDelete = window.confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      setCartoes(prev => prev.filter(c => c.final !== final));
      // If the deleted card was selected, select another (or none)
      if (selectedCard === final) {
        const remaining = cartoes.filter(c => c.final !== final);
        setSelectedCard(remaining[0]?.final || '');
      }
    }
  }

  // Get the balance of the currently selected card
  const selectedBalance = safeValidatedCards.find(c => c.final === selectedCard)?.saldo ?? 0;

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
          Available balance: <b>{selectedBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b>
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
                placeholder="Amount in R$"
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
                    <MenuItem key={c.final} value={c.final}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Box>{c.bandeira} **** {c.final}</Box>
                        {/* Button to delete card (trash icon) */}
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCard(c.final);
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
             onSalvar={(savedCard) => {
               const final = savedCard.numero.slice(-4);
               // Prevents duplicate cards by number (last digits)
               if (cartoes.some(c => c.final === final)) {
                 setMessage('A card with these final digits is already registered.');
                 setTimeout(() => setMessage(''), 1800);
                 setStep('add');
                 return;
               }
               setCartoes(cs => [...cs, { ...savedCard, final, saldo: 0 }]);
               setSelectedCard(final);
               setMessage('Card registered!');
               setStep('add');
               setTimeout(() => setMessage(''), 1200);
             }}
             onCancelar={() => setStep('add')}
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