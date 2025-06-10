import React, { useState } from 'react';
import { Button, Typography, Stack, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

// History Component
// Displays options for the user to access their purchase and viewed product history
// Props:
// - onVoltar: function called when clicking to return to the profile
//
// Uses useNavigate from react-router-dom for route navigation
// Uses snackbar state for visual user feedback
// Uses Paper, Typography, Stack, Button, Snackbar, Alert from Material UI for layout and feedback
// Uses sx for spacing, centering, and rounded corners
//
// Logic:
// - handleClick: navigates to the desired route and displays a snackbar message
// - Paper centers and highlights the content
// - Stack arranges buttons vertically with spacing
// - Snackbar/Alert shows temporary messages to the user

export default function History({ onVoltar }) {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const handleClick = (route, msg) => {
    navigate(route);
    setSnackbar({ open: true, message: msg });
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        History
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleClick(ROUTES.PURCHASE_HISTORY, 'Accessing purchase history...')}
        >
          View Purchase History
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleClick(ROUTES.PRODUCT_HISTORY, 'Accessing viewed products history...')}
        >
          View Viewed Products History
        </Button>
        <Button
          variant="contained"
          onClick={onVoltar}
        >
          Back to Profile
        </Button>
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}