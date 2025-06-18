import React, { useEffect, useState } from 'react';
import {
  Paper, Typography, List, ListItem, ListItemText, Button, Snackbar, Alert, Checkbox, Box, TextField
} from '@mui/material';

export default function Messages({ onVoltar }) {
  const userId = localStorage.getItem('userId');
  const [messages, setMessages] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, msg: '', severity: 'info' });
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/messages`)
        .then(res => res.json())
        .then(data => {
          setMessages(Array.isArray(data) ? data : []);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  function markAsRead(idx) {
    if (!messages[idx]?.read) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/messages/${idx}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      }).then(() => {
        setMessages(msgs => msgs.map((m, i) => i === idx ? { ...m, read: true } : m));
      });
    }
  }

  function addMessage() {
    if (!newMessage.trim()) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newMessage, date: new Date(), important: false, read: false })
    }).then(res => res.json()).then(msgs => {
      setMessages(Array.isArray(msgs) ? msgs : []);
      setSnackbar({ open: true, msg: 'Message sent!', severity: 'success' });
      setNewMessage('');
    });
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" mb={2}>Messages</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a new message"
          size="small"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={addMessage}>Send</Button>
      </Box>
      <List>
        {loading && <Typography>Loading...</Typography>}
        {!loading && messages.length === 0 && <Typography>No messages.</Typography>}
        {messages.map((msg, idx) => (
          <ListItem key={idx} sx={{ bgcolor: msg.read ? '#f5f5f5' : '#fffde7', borderRadius: 2, mb: 1 }}>
            <Checkbox checked={!!msg.read} onChange={() => markAsRead(idx)} />
            <ListItemText
              primary={msg.text}
              secondary={msg.date ? new Date(msg.date).toLocaleString() : ''}
              sx={{ textDecoration: msg.read ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
      <Button variant="outlined" sx={{ mt: 2, width: '100%' }} onClick={onVoltar}>Back</Button>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.msg}</Alert>
      </Snackbar>
    </Paper>
  );
}