import React, { useEffect, useState } from 'react';
import { Paper, Switch, FormControlLabel, Typography, Button, Snackbar, Alert } from '@mui/material';

// Privacy Component
// Allows the user to configure privacy preferences (notifications and data sharing)
// Props:
// - onVoltar: function called when clicking to return to the profile
//
// States:
// - privacy: object controlling notification, data sharing, and terms acceptance
// - snackbar: controls visual feedback
//
// Logic:
// - Preferences are saved to and read from localStorage
// - handleChange: updates state when toggling switches
// - handleSave: saves preferences to backend and shows feedback
// - Layout with Paper, Typography, Switch, FormControlLabel, Button, Snackbar/Alert
// - Inline CSS (sx) for spacing, width, and centering

export default function Privacy({ onVoltar }) {
  // Initial state reads preferences from localStorage
  const [privacy, setPrivacy] = useState({
    notification: false,
    sharedData: false,
    termsAccepted: false
  });

  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'info' }); // State for visual feedback

  // Fetch user data from backend on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
        .then(res => res.json())
        .then(user => setPrivacy(user.privacy || {}));
    }
  }, []);

  // Update state when toggling switches
  function handleChange(e) {
    setPrivacy({ ...privacy, [e.target.name]: e.target.checked });
  }

  // Save preferences to backend and show feedback
  function handleSave() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/privacy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy)
      }).then(() => {
        setSnackbar({ open: true, msg: 'Preferences updated!', severity: 'success' });
      });
    }
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Paper: visual container with shadow and rounded borders
          elevation={3}: shadow level
          sx: padding, max width, centering, border radius */}
      <Typography variant="h5" mb={2}>
        {/* Typography: large title
            variant="h5": large size
            mb={2}: bottom margin */}
        Privacy Preferences
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={privacy.notification}
            name="notification"
            onChange={handleChange}
          />
        }
        label="Receive notifications"
        sx={{ alignSelf: 'flex-start', mb: 1 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={privacy.sharedData}
            name="sharedData"
            onChange={handleChange}
          />
        }
        label="Share my data with partners"
        sx={{ alignSelf: 'flex-start', mb: 1 }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={privacy.termsAccepted}
            name="termsAccepted"
            disabled
          />
        }
        label="Accepted Terms and Conditions"
        sx={{ alignSelf: 'flex-start', mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, width: '100%' }}
        onClick={handleSave}
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
        sx={{ mt: 2, width: '100%' }}
        onClick={onVoltar}
      >
        {/* Button: secondary button
            variant="outlined": visible border, transparent background
            sx: mt=2 (top margin), ml=2 (left margin)
            fullWidth: occupies full width */}
        Back
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Preferences saved successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
}