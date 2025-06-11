import React, { useState, useEffect } from 'react';
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
  Skeleton
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
  // State with user message list
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      texto: 'Promoção: Frete grátis para compras acima de R$ 200!',
      data: new Date(),
      importante: false,
      lida: false,
    },
    {
      id: 2,
      texto: 'Seu pedido #12344 foi enviado.',
      data: new Date(),
      importante: true,
      lida: false,
    },
    {
      id: 3,
      texto: 'Atualização de política de privacidade.',
      data: new Date(Date.now() - 86400000),
      importante: false,
      lida: true,
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
        texto: 'Nova mensagem automática do administrador!',
        data: new Date(),
        importante: Math.random() > 0.5,
        lida: false,
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

  // Adds a new message manually
  const adicionarMensagem = () => {
    if (!novaMensagem.trim()) return;
    const nova = {
      id: Date.now(),
      texto: novaMensagem,
      data: new Date(),
      importante: false,
      lida: false,
    };
    setMensagens((prev) => [nova, ...prev]);
    setNovaMensagem('');
    setSnackbar(true);
  };

  // Marks message as read on click
  const marcarComoLida = (id) => {
    setMensagens((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, lida: true } : msg))
    );
  };

  // Filters messages according to the selected filter
  const mensagensFiltradas = mensagens.filter((msg) => {
    if (filtro === 'all') return true;
    if (filtro === 'important') return msg.importante;
    if (filtro === 'unread') return !msg.lida;
    return true;
  });

  // Groups filtered messages by date
  const agrupadas = agruparMensagensPorData(mensagensFiltradas);

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
            <div style={{ margin: '24px 0', display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={onVoltar}
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
    <Box maxWidth="md" mx="auto" mt={4}>
      {/* Box: flexible container
          maxWidth="md": medium max width
          mx="auto": horizontally centers
          mt={4}: top margin */}
      <Card>
        {/* Card: highlights the message content */}
        <CardContent>
          {/* CardContent: inner area of the Card */}
          <Typography variant="h5" gutterBottom sx={{mb: 3}}>
            {/* Typography: large title */}
            Admin messages
          </Typography>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              {/* Skeleton: loading placeholder */}
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
            </>
          ) : (
            <>
              <ToggleButtonGroup
                value={filtro}
                exclusive
                onChange={(e, value) => value && setFiltro(value)}
                sx={{ mb: 2 }}
              >
                {/* ToggleButtonGroup: filter button group */}
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="important">Important</ToggleButton>
                <ToggleButton value="unread">Unread</ToggleButton>
              </ToggleButtonGroup>
              {Object.entries(agrupadas).map(([grupo, msgs]) => (
                <Box key={grupo} mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {/* Typography: subtitle for message group */}
                    {grupo}
                  </Typography>
                  <Divider />
                  {msgs.map((msg) => (
                    <Paper
                      key={msg.id}
                      elevation={msg.id === mensagemEmDestaque ? 6 : 1}
                      sx={{
                        mt: 1,
                        p: 2,
                        bgcolor: msg.id === mensagemEmDestaque ? 'primary.light' : msg.lida ? 'grey.100' : 'info.light',
                        borderLeft: msg.importante ? '5px solid red' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}
                      onClick={() => marcarComoLida(msg.id)}
                    >
                      {/* Paper: highlights each message */}
                      <Avatar sx={{ bgcolor: msg.importante ? 'error.main' : 'primary.main', width: 32, height: 32, fontSize: 18 }}>
                        {/* Avatar: sender icon */}
                        A
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2">{msg.texto}</Typography>
                        <Box display="flex" justifyContent="space-between" mt={1}>
                          <Typography variant="caption">
                            {new Date(msg.data).toLocaleString()}
                          </Typography>
                          {msg.importante && <Chip label="Important" size="small" color="error" />}
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ))}
              <Box display="flex" gap={2} mt={4} flexDirection={{ xs: 'column', sm: 'row' }}>
                <TextField
                  label="New message"
                  fullWidth
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  variant="outlined"
                  multiline
                  minRows={3}
                  maxRows={6}
                  sx={{ flex: 1 }}
                  InputProps={{
                    style: { resize: 'vertical' }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={adicionarMensagem}
                  sx={{
                    minWidth: 120,
                    height: { xs: 48, sm: 'auto' },
                    alignSelf: { xs: 'flex-end', sm: 'unset' }
                  }}
                >
                  Send
                </Button>
              </Box>
              <Box mt={4} display="flex" justifyContent="center">
                <Button
                  onClick={onVoltar}
                  variant="outlined"
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    background: '#fff',
                    borderColor: '#007b99',
                    color: '#007b99',
                    '&:hover': {
                      background: '#e3f2fd',
                      borderColor: '#004d66',
                      color: '#004d66'
                    }
                  }}
                >
                  Back to Profile
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
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
    </Box>
  );
}