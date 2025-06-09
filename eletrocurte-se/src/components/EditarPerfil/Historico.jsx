import React, { useState } from 'react';
import { Button, Typography, Stack, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

// Historico Component
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

export default function Historico({ onVoltar }) {
  const navigate = useNavigate(); // Hook for route navigation
  const [snackbar, setSnackbar] = useState({ open: false, message: '' }); // State to control visual feedback

  // Function to navigate to a route and show a snackbar message
  const handleClick = (route, msg) => {
    navigate(route);
    setSnackbar({ open: true, message: msg });
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      {/* Paper: visual container with shadow and rounded corners
          elevation={4}: shadow level
          sx: padding, max width, centering, rounded border */}
      <Typography variant="h5" gutterBottom align="center">
        {/* Typography: large centered title
            variant="h5": large size
            gutterBottom: bottom margin
            align="center": center text */}
        History
      </Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {/* Stack: arranges buttons in a vertical column with spacing
            spacing={2}: space between items
            sx: mt=2 (top margin) */}
        <Button
          variant="outlined"
          onClick={() => handleClick(ROUTES.HIST_COMPRAS, 'Accessing purchase history...')}
        >
          {/* Button: action button
              variant="outlined": visible border, transparent background */}
          View Purchase History
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleClick(ROUTES.HIST_PRODUTOS, 'Accessing viewed products history...')}
        >
          View Viewed Products History
        </Button>
        <Button
          variant="contained"
          onClick={onVoltar}
        >
          {/* variant="contained": button with filled background (highlighted) */}
          Back to Profile
        </Button>
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {/* Snackbar: temporary visual feedback
            Alert: informational message */}
        <Alert severity="info" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}