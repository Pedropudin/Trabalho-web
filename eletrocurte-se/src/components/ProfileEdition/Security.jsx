import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, Button, Typography, Paper, TextField, Snackbar } from '@mui/material';

// FormSecurity Component
// Allows the user to update and validate email, password, CPF, and phone number
// Props:
// - onBack: function called when clicking to return to the profile
//
// States:
// - form: object with fields email, password, cpf, phone
// - message: feedback message
// - messageType: type of feedback (info, error, success)
// - validating: controls asynchronous validation state
// - snackbar: controls visual feedback
//
// Functions:
// - extractDomain: extracts email domain
// - checkEmailDomain: validates email domain via DNS
// - validateAllFields: validates all form fields
// - handleSubmit: runs validation and feedback
//
// Logic:
// - Validation of email, CPF, phone format and strong password
// - DNS-based email domain validation
// - Visual feedback using Snackbar/Alert
// - Layout with Paper, Typography, TextField, Button
// - Inline CSS (sx) for spacing, width, centering

const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Regex for strong password

// Extract email domain for DNS validation
function extractDomain(email) {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : '';
}

export default function Security({ onBack }) {
  const [form, setForm] = useState({ email: '', password: '', cpf: '', phone: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [validating, setValidating] = useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage('');
    setMessageType('info');
  };

  async function checkEmailDomain(domain) {
    try {
      const url = `https://dns.google/resolve?name=${domain}&type=MX`;
      const res = await fetch(url);
      if (!res.ok) return false;
      const data = await res.json();
      return data.Answer && data.Answer.length > 0;
    } catch {
      return false;
    }
  }

  const validateAllFields = () => {
    if (!form.cpf || !form.email || !form.password || !form.phone) {
      return { valid: false, message: 'Please fill out all fields.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return { valid: false, message: 'Invalid email.' };
    }
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) {
      return { valid: false, message: 'Invalid CPF. Use format 000.000.000-00.' };
    }
    if (!strongPassword.test(form.password)) {
      return {
        valid: false,
        message:
          'Weak password. It must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.',
      };
    }
    if (!/^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$/.test(form.phone)) {
      return { valid: false, message: 'Invalid phone number. Use format (00) 00000-0000.' };
    }
    return { valid: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateAllFields();
    if (!validation.valid) {
      setMessage(validation.message);
      setMessageType('error');
      setSnackbar(true);
      return;
    }
    setValidating(true);
    const domain = extractDomain(form.email);
    const isDomainValid = await checkEmailDomain(domain);
    setValidating(false);
    if (!isDomainValid) {
      setMessage('The email domain does not exist or has no valid MX records.');
      setMessageType('error');
      setSnackbar(true);
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          cpf: form.cpf,
          phone: form.phone,
        }),
      });
      setMessage('Changes saved successfully!');
      setMessageType('success');
      setSnackbar(true);
    } catch {
      setMessage('Failed to save changes to the server.');
      setMessageType('error');
      setSnackbar(true);
    }
  };

  useEffect(() => {
    if (messageType === 'success') {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('info');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageType]);

  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 420, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" align="center" fontWeight={700} mb={2}>
        Security
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={validating}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={validating}
          helperText="Minimum 8 characters, including uppercase, lowercase, numbers, and special characters."
        />
        <TextField
          label="CPF"
          type="text"
          name="cpf"
          value={form.cpf}
          onChange={(e) => {
            let raw = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (raw.length > 9) {
              raw = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_, p1, p2, p3, p4) => `${p1}.${p2}.${p3}-${p4}`);
            } else if (raw.length > 6) {
              raw = raw.replace(/(\d{3})(\d{3})(\d{0,3})/, (_, p1, p2, p3) => `${p1}.${p2}.${p3}`);
            } else if (raw.length > 3) {
              raw = raw.replace(/(\d{3})(\d{0,3})/, (_, p1, p2) => `${p1}.${p2}`);
            }
            handleChange({ target: { name: 'cpf', value: raw } });
          }}
          fullWidth
          margin="normal"
          disabled={validating}
          placeholder="000.000.000-00"
        />
        <TextField
          label="Phone"
          type="text"
          name="phone"
          value={form.phone}
          onChange={e => {
            let raw = e.target.value.replace(/\D/g, '').slice(0, 11);
            if (raw.length > 6) {
              raw = raw.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            } else if (raw.length > 2) {
              raw = raw.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            }
            handleChange({ target: { name: 'phone', value: raw.trim() } });
          }}
          fullWidth
          margin="normal"
          disabled={validating}
          placeholder="(00) 00000-0000"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={validating} sx={{ mt: 2 }}>
          {validating ? 'Validating...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outlined" color="inherit" fullWidth onClick={onBack} sx={{ mt: 2 }} disabled={validating}>
          Back to Profile
        </Button>
      </form>
      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={messageType} sx={{ width: '100%' }}>
          <AlertTitle>
            {messageType === 'success' ? 'Success' : messageType === 'warning' ? 'Warning' : 'Error'}
          </AlertTitle>
          {message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}