// -----------------------------------------------------------------------------
// Addresses.jsx
// User delivery address management component.
// Allows viewing, selecting, adding, and removing addresses, with persistence
// in localStorage and backend. Uses Material-UI for UI and dialogs. Integrated with AddressModal
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

export default function Addresses({ onVoltar }) {
  // Loads addresses from localStorage or initializes with examples.
  const userId = localStorage.getItem('userId');
  const addressKey = userId ? `address_${userId}` : 'address';
  const selectedAddressKey = userId ? `selectedAddress_${userId}` : 'selectedAddress';
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  // Controls display of the address registration modal.
  const [modalAberto, setModalAberto] = useState(false);
  // Controls the address removal confirmation dialog.
  const [dialogRemover, setDialogRemover] = useState({ open: false, id: null });
  // State for confirmation message when changing address.
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Fetch addresses from backend on mount
  useEffect(() => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
        .then(res => res.json())
        .then(user => {
          const backendAddresses = Array.isArray(user.address) ? user.address : [];
          setAddresses(backendAddresses);
          localStorage.setItem(addressKey, JSON.stringify(backendAddresses));
          const selAddr = user.selectedAddress || (backendAddresses[0]?.id || '');
          setSelectedAddress(selAddr);
          localStorage.setItem(selectedAddressKey, selAddr);
        });
    }
  }, [userId, addressKey, selectedAddressKey]);

  // Syncs addresses to localStorage and backend whenever addresses change.
  useEffect(() => {
    localStorage.setItem(addressKey, JSON.stringify(addresses));
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addresses })
      });
    }
  }, [addresses, addressKey, userId]);

  // Syncs selected address to localStorage and backend whenever it changes.
  useEffect(() => {
    localStorage.setItem(selectedAddressKey, selectedAddress);
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAddress })
      });
    }
  }, [selectedAddress, selectedAddressKey, userId]);

  // When changing the selected address, shows confirmation message and updates backend.
  const handleChangeAddress = (e) => {
    setSelectedAddress(e.target.value);
    setSnackbar({ open: true, message: 'Delivery location changed successfully!' });
    // Also update selectedAddress in backend
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAddress: e.target.value })
      });
    }
  };

  // Adds a new address to the list and selects it.
  const addAddress = (fullAddress) => {
    // fullAddress should be an object with street, number, complement, district, city, state, zipCode.
    const text = `${fullAddress.street || ''}, ${fullAddress.number || ''} ${fullAddress.complement ? '- ' + fullAddress.complement : ''} - ${fullAddress.district || ''}, ${fullAddress.city || ''}/${fullAddress.state || ''}`.replace(/\s+/g, ' ').trim();
    const newAddress = { id: `address${Date.now()}`, text, ...fullAddress };
    setAddresses([...addresses, newAddress]);
    setSelectedAddress(newAddress.id);
    // Updates backend with new address array and selectedAddress
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: [...addresses, newAddress], selectedAddress: newAddress.id })
      });
    }
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
    // Updates backend with new address array and selectedAddress
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: filtered, selectedAddress: filtered[0]?.id || '' })
      });
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
          onClick={onVoltar}
          sx={{ width: '100%' }}
        >
          Confirm and Back to Profile
        </Button>
      </div>
    </div>
  );
}