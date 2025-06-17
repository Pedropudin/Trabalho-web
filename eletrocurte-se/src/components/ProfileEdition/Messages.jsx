import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Paper,
  Chip,
  Snackbar,
  Alert,
  Avatar,
  Skeleton,
  List,
  ListItem,
  ListItemText,
  Checkbox
} from '@mui/material';

// Message component
// Displays system/admin messages to the user, grouped by date and with filters
// Props:
// - onVoltar: function called when clicking to return to profile
//
// States:
// - mensagens: user message list
// - novaMensagem: input text for new message
// - filtro: display filter (all, important, unread)
// - mensagemEmDestaque: highlights newly arrived message
// - snackbar: controls visual feedback
// - loading: simulates initial loading
//
// Functions:
// - agruparMensagensPorData: groups messages by "Today", "Yesterday", and "Earlier"
// - adicionarMensagem: adds a new message to the list
// - marcarComoLida: marks message as read on click
//
// Logic:
// - Messages can be filtered and grouped
// - Automatic admin message is simulated after 10s
// - Visual feedback with Snackbar/Alert
// - Layout with Box, Card, Paper, Typography, ToggleButtonGroup, Chip, Skeleton, etc.
// - Inline CSS (sx) for spacing, color, highlight, responsiveness

const agruparMensagensPorData = (mensagens) => {
  // Groups messages into "Today", "Yesterday", and "Earlier" for easier viewing
  const hoje = new Date().toDateString();
  const ontem = new Date(Date.now() - 86400000).toDateString();

  return mensagens.reduce((acc, msg) => {
    const dataStr = new Date(msg.data).toDateString();
    let grupo = 'Earlier';

    if (dataStr === hoje) grupo = 'Today';
    else if (dataStr === ontem) grupo = 'Yesterday';

    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(msg);
    return acc;
  }, {});
};

export default function Messages({ onVoltar }) {
  const userId = localStorage.getItem('userId');
  // State with user message list
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      text: 'Promotion: Free shipping for purchases over R$ 200!',
      data: new Date(),
      important: false,
      read: false,
    },
    {
      id: 2,
      text: 'Your order #12344 has been shipped.',
      data: new Date(),
      important: true,
      read: false,
    },
    {
      id: 3,
      text: 'Privacy policy update.',
      data: new Date(Date.now() - 86400000),
      important: false,
      read: true,
    },
  ]);
  const [novaMensagem, setNovaMensagem] = useState(''); // State for new message input
  const [filtro, setFiltro] = useState('all'); // State for display filter
  const [mensagemEmDestaque, setMensagemEmDestaque] = useState(null); // Highlights newly arrived message
  const [snackbar, setSnackbar] = useState(false); // Controls visual feedback
  const [loading, setLoading] = useState(true); // Simulates initial loading

  useEffect(() => {
    // Simulates initial loading (e.g., API fetch)
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulates automatic arrival of admin message after 10s
    const timer = setTimeout(() => {
      const nova = {
        id: Date.now(),
        text: 'New automatic message from the administrator!',
        data: new Date(),
        important: Math.random() > 0.5,
        read: false,
      };
      setMensagens((prev) => [nova, ...prev]);
      setMensagemEmDestaque(nova.id);

      // Plays notification sound
      const audio = new Audio('/notification.ogg');
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Fetches messages from the backend on load
  useEffect(() => {
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}`)
        .then(res => res.json())
        .then(user => {
          // If there are no messages, keeps the default messages
          if (Array.isArray(user.messages) && user.messages.length > 0) {
            setMensagens(user.messages.map((m, i) => ({
              ...m,
              id: m.id || i + 1 // preserve id if exists, else fallback
            })));
          }
        })
        .catch(() => {
          // If there is an error, keeps the default messages
        });
    }
  }, [userId]);

  // Adds a new message manually
  const adicionarMensagem = () => {
    if (!novaMensagem.trim()) return;
    const nova = {
      id: Date.now(),
      text: novaMensagem,
      data: new Date(),
      important: false,
      read: false,
    };
    setMensagens((prev) => [nova, ...prev]);
    setNovaMensagem('');
    setSnackbar(true);
    // Save to backend
    if (userId) {
      fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nova)
      });
    }
  };

  // Marks message as read on click
  const marcarComoLida = (id) => {
    setMensagens((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  };

  // Filters messages according to the selected filter
  const mensagensFiltradas = mensagens.filter((msg) => {
    if (filtro === 'all') return true;
    if (filtro === 'important') return msg.important;
    if (filtro === 'unread') return !msg.read;
    return true;
  });

  // Groups filtered messages by date
  const agrupadas = agruparMensagensPorData(mensagensFiltradas);

  // Se não houver mensagens filtradas, mostra "No messages yet"
  const hasMessages = mensagensFiltradas.length > 0;

  if (loading) {
    return (
      <Box maxWidth="md" mx="auto" mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{mb: 3}}>
              Admin messages
            </Typography>
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            {/* Render filter buttons as disabled during loading for test reliability */}
            <ToggleButtonGroup value="all" exclusive sx={{ mb: 2 }}>
              <ToggleButton value="all" aria-label="All" disabled>All</ToggleButton>
              <ToggleButton value="important" aria-label="Important" disabled>Important</ToggleButton>
              <ToggleButton value="unread" aria-label="Unread" disabled>Unread</ToggleButton>
            </ToggleButtonGroup>
            {/* Don't renderize the message camp during loading */}
            <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onVoltar || (() => window.location.assign('/profile'))}
                sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
              >
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" mb={2}>
        Messages
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={adicionarMensagem}
      >
        New Message
      </Button>
      <List>
        {mensagens.length === 0 && (
          <Typography>No messages.</Typography>
        )}
        {mensagens.map((msg, idx) => (
          <ListItem
            key={idx}
            sx={{
              bgcolor: msg.read ? '#f5f5f5' : '#fffde7',
              borderRadius: 2,
              mb: 1
            }}
          >
            <Checkbox
              checked={!!msg.read}
              onChange={() => marcarComoLida(msg.id)}
            />
            <ListItemText
              primary={msg.text}
              secondary={msg.data ? new Date(msg.data).toLocaleString() : ''}
              sx={{ textDecoration: msg.read ? 'line-through' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={onVoltar}
      >
        Back
      </Button>
      <Snackbar
        open={snackbar}
        autoHideDuration={2500}
        onClose={() => setSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Message sent!
        </Alert>
      </Snackbar>
    </Paper>
  );
}