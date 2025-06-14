// -----------------------------------------------------------------------------
// Addresses.jsx
// User delivery address management component.
// Allows viewing, selecting, adding, and removing addresses, with persistence
// in localStorage. Uses Material-UI for UI and dialogs. Integrated with AdressModal
// for registering new addresses.
// -----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddressModal from './AddressModal';
import Alert from '@mui/material/Alert';

export default function Addresses({ onBack }) {
  // List of user addresses, persisted in localStorage.
  const [addresses, setAddresses] = useState(() => {
    // Fetches saved addresses or initializes with examples.
    const stored = localStorage.getItem('addresses');
    return stored ? JSON.parse(stored) : [
      {
        id: 'endereco1',
        texto: 'Rua das Flores, 123 - Centro, São Paulo/SP'
      },
      {
        id: 'endereco2',
        texto: 'Av. Brasil, 456 - Jardim, Rio de Janeiro/RJ'
      }
    ];
  });

  // ID of the currently selected delivery address.
  const [selectedAddress, setSelectedAddress] = useState(
    localStorage.getItem('selectedAddress') || 'address1'
  );

  // Controls display of the address registration modal.
  const [modalAberto, setModalAberto] = useState(false);
  // Controls the address removal confirmation dialog.
  const [dialogRemover, setDialogRemover] = useState({ open: false, id: null });
  // State for confirmation message when changing address
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Updates localStorage and backend whenever addresses change.
  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
    // Updates backend
    const userId = localStorage.getItem('userId');
    fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addresses })
    });
  }, [addresses]);

  // Updates localStorage and backend whenever the selected address changes.
  useEffect(() => {
    localStorage.setItem('selectedAddress', selectedAddress);
    // Updates backend
    const userId = localStorage.getItem('userId');
    fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedAddress })
    });
  }, [selectedAddress]);

  // When changing the selected address, shows confirmation message
  const handleChangeAddress = (e) => {
    setSelectedAddress(e.target.value);
    setSnackbar({ open: true, message: 'Delivery location changed successfully!' });
  };

  // Adds a new address to the list and selects it.
  const addAddress = (fullAddress) => {
    // Formats the address if it's an object (AdressModal return).
    const text = typeof fullAddress === 'object' && fullAddress !== null
      ? `${fullAddress.street || ''}, ${fullAddress.number || ''} ${fullAddress.complement ? '- ' + fullAddress.complement : ''} - ${fullAddress.district || ''}, ${fullAddress.city || ''}/${fullAddress.state || ''}`.replace(/\s+/g, ' ').trim()
      : fullAddress;
    const newAddress = { id: `address${Date.now()}`, text };
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress.id);
  };

  // Removes address by id and adjusts selection if necessary.
  const removeAddress = (id) => {
    const filtered = addresses.filter(e => e.id !== id);
    setAddresses(filtered);
    if (id === selectedAddress && filtered.length > 0) {
      setSelectedAddress(filtered[0].id);
    } else if (filtered.length === 0) {
      setSelectedAddress('');
    }
  };

  // Opens confirmation dialog to remove address.
  const handleRemoveClick = (id) => {
    setDialogRemover({ open: true, id });
  };

  // Confirms removal of the selected address in the dialog.
  const confirmarRemover = () => {
    removeAddress(dialogRemover.id);
    setDialogRemover({ open: false, id: null });
  };

  // Cancels removal dialog.
  const cancelarRemover = () => {
    setDialogRemover({ open: false, id: null });
  };

  return (
    <div className="editarperfil-card-form">
      {/* Section title */}
      <Typography variant="h5" gutterBottom>Delivery Addresses</Typography>
      {/* Address selection form using Material-UI */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Choose the delivery address</FormLabel>
        <RadioGroup
          value={selectedAddress}
          onChange={handleChangeAddress}
        >
          {/* List of addresses with removal option */}
          {addresses.map((address) => (
            <div key={address.id} style={{ display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                value={address.id}
                control={<Radio />}
                label={address.text}
              />
              {/* Button to remove address, with trash can icon */}
              <IconButton onClick={() => handleRemoveClick(address.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </div>
          ))}
        </RadioGroup>
      </FormControl>

      {/* Button to open new address registration modal */}
      <Button variant="outlined" sx={{ mt: 3, width: '100%' }} onClick={() => setModalAberto(true)}>
        Add New Address
      </Button>

      {/* Modal for new address registration */}
      <Dialog open={modalAberto} onClose={() => setModalAberto(false)}>
        <DialogTitle>New Address</DialogTitle>
        <DialogContent>
          {/* AddressModal component for registration form */}
          <AddressModal onSalvar={(endereco) => {
            addAddress(endereco);
            setModalAberto(false);
          }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAberto(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation dialog for address removal */}
      <Dialog open={dialogRemover.open} onClose={cancelarRemover}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove the registered address?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelarRemover} color="inherit">Cancel</Button>
          <Button onClick={confirmarRemover} color="error" variant="contained">Remove</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation snackbar when changing address */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Button to confirm selection and return to profile */}
      <div style={{ marginTop: '1rem' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onBack}
          sx={{ width: '100%' }}
        >
          Confirm and Back to Profile
        </Button>
      </div>
    </div>
  );
}