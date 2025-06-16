import React, { useState, useEffect } from 'react';
import { Switch, FormControlLabel, Typography, Button, Paper, Snackbar, Alert } from '@mui/material';

// Privacy Component
// Allows the user to configure privacy preferences (notifications and data sharing)
// Props:
// - onVoltar: function called when clicking to return to the profile
//
// States:
// - notificacoesEmail: controls email notification permission
// - compartilharDados: controls data sharing permission
// - snackbar: controls visual feedback
//
// Logic:
// - Preferences are saved to and read from localStorage
// - handleSalvar: displays feedback when saving preferences
// - Layout with Paper, Typography, Switch, FormControlLabel, Button, Snackbar/Alert
// - Inline CSS (sx) for spacing, width, and centering

export default function Privacy({ onVoltar }) {
  // Initial state reads preferences from localStorage
  const [notificacoesEmail, setNotificacoesEmail] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('preferenciasPrivacidade'));
    return prefs?.notificacoesEmail ?? true;
  });

  const [compartilharDados, setCompartilharDados] = useState(() => {
    const prefs = JSON.parse(localStorage.getItem('preferenciasPrivacidade'));
    return prefs?.compartilharDados ?? false;
  });

  const [snackbar, setSnackbar] = useState(false); // State for visual feedback

  // Update localStorage whenever preferences change
  useEffect(() => {
    localStorage.setItem(
      'preferenciasPrivacidade',
      JSON.stringify({
        notificacoesEmail,
        compartilharDados
      })
    );
  }, [notificacoesEmail, compartilharDados]);

  // Display feedback when saving preferences
  const handleSalvar = async () => {
    // Also saves to the backend
    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privacy: {
            notification: notificacoesEmail,
            sharedData: compartilharDados
          }
        })
      });
    } catch {}
    setSnackbar(true);
  };

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      {/* Paper: visual container with shadow and rounded borders
          elevation={4}: shadow level
          sx: padding, max width, centering, border radius */}
      <Typography variant="h5" gutterBottom align="center">
        {/* Typography: large centered title
            variant="h5": large size
            gutterBottom: bottom margin
            align="center": center text */}
        Privacy Settings
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={notificacoesEmail}
            onChange={() => setNotificacoesEmail((prev) => !prev)}
            sx={{mt:2}}
          />
        }
        label="Allow email notifications"
      />
      <FormControlLabel
        control={
          <Switch
            checked={compartilharDados}
            onChange={() => setCompartilharDados((prev) => !prev)}
            sx={{mt:2}}
          />
        }
        label="Share data with partners"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSalvar}
        sx={{ mt: 2 }}
        fullWidth
      >
        {/* Button: main action button
            variant="contained": filled background
            color="primary": main theme color
            sx: mt=2 (top margin)
            fullWidth: occupies full width */}
        Save Preferences
      </Button>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onVoltar}
        sx={{ mt: 2 }}
        fullWidth
      >
        {/* Button: secondary button
            variant="outlined": visible border, transparent background
            color="inherit": neutral color
            sx: mt=2 (top margin)
            fullWidth: occupies full width */}
        Confirm and return to Profile
      </Button>
      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Preferences saved successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
}